<template>
  <q-page class="q-pa-md">
    <q-btn
      icon="arrow_back"
      color="primary"
      flat
      label="Volver"
      class="q-mb-md"
      @click="$router.back()"
    />

    <div class="text-h5 text-primary q-mb-md">
      Configuración de Resultados para: <b>{{ nombreComercial }}</b>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="(res, index) in bloques" :key="index" class="col-12 col-md-6">
        <q-card :class="res.visible == 1 ? 'card-blue' : 'card-red'">
          <div class="q-pa-md">
            <!-- TÍTULO -->
            <div class="text-h6 q-mb-sm">{{ res.codigo }} — {{ res.nombre_resultado }}</div>

            <!-- ORDEN (readonly) -->
            <q-input filled dense v-model="res.orden" label="Orden" readonly class="q-mt-md" />

            <!-- NOMBRE EDITABLE -->
            <q-input
              filled
              dense
              v-model="res.nombre_resultado"
              label="Nombre del resultado"
              class="q-mt-md"
            />

            <!-- VISIBLE -->
            <q-select
              filled
              dense
              v-model="res.visible"
              :options="visibilidad"
              label="Visible"
              emit-value
              map-options
              class="q-mt-md"
            />

            <!-- FORMULA -->
            <q-input
              filled
              dense
              v-model="res.formula"
              label="Fórmula (E1 + 20) / E2"
              class="q-mt-md"
            />

            <!-- PRUEBA -->
            <q-input
              filled
              dense
              v-model.number="res.prueba"
              type="number"
              step="0.01"
              label="Prueba (decimal)"
              class="q-mt-md"
            />

            <!-- RESULTADO CALCULADO -->
            <q-input
              filled
              dense
              :model-value="res.resultado"
              label="Resultado calculado"
              readonly
              class="q-mt-md"
            />
          </div>
        </q-card>
      </div>
    </div>

    <!-- GUARDAR -->
    <q-btn
      label="Guardar Todo"
      color="primary"
      class="full-width q-mt-xl"
      size="lg"
      @click="guardarTodo"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'
import type { ResultadoConfiguracion } from '../../interfaces'

const API = 'https://cifradosdev.com/certi_minera_backend/public'
const route = useRoute()
const id_config = route.params.id as string

const nombreComercial = ref('')

interface Bloque {
  id: number | null
  codigo: string
  nombre_resultado: string
  orden: number
  visible: number
  formula: string
  prueba: number
  resultado: string
}

const bloques = ref<Bloque[]>([])

const visibilidad = [
  { label: 'Sí', value: 1 },
  { label: 'No', value: 0 },
]

/* -------------------------------------
   CARGA INICIAL
-------------------------------------- */
onMounted(async () => {
  await cargarConfiguracion()
  await cargarResultados()
  recalcular()
})

/* -------------------------------------
   CARGAR CONFIGURACIÓN BASE
-------------------------------------- */
async function cargarConfiguracion() {
  const data = (await axios.get(`${API}/configuracion-precios/${id_config}`)).data

  nombreComercial.value = data.nombre_comercial

  const cantidad = Number(data.resultados_esperados)

  // Crear bloques vacíos E1, E2...
  bloques.value = [...Array(cantidad)].map((_, i) => ({
    id: null,
    codigo: `E${i + 1}`,
    nombre_resultado: `Resultado ${i + 1}`,
    orden: i + 1,
    visible: 1,
    formula: '',
    prueba: 0.0,
    resultado: '--',
  }))
}

/* -------------------------------------
   CARGAR RESULTADOS EXISTENTES
-------------------------------------- */
async function cargarResultados() {
  const data = (await axios.get(`${API}/configuracion-precios/${id_config}/resultados`)).data

  data.forEach((res: ResultadoConfiguracion) => {
    const ix = res.orden - 1
    if (bloques.value[ix]) {
      bloques.value[ix] = {
        ...bloques.value[ix],
        id: res.id ?? null,
        nombre_resultado: res.nombre_resultado,
        visible: res.visible,
        formula: res.formula,
        prueba: res.prueba ?? 0.0,
      }
    }
  })
}

/* -------------------------------------
   EVALUAR FORMULAS
-------------------------------------- */
function calcularFormula(formula: string, bloquesArr: Bloque[]) {
  if (!formula || formula.trim() === '') return null

  let expr = formula

  // Reemplazar E1, E2, E3 por valores
  bloquesArr.forEach((b, i) => {
    expr = expr.replaceAll(`E${i + 1}`, b.resultado ?? 0)
  })

  try {
    // Validación segura
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      return 'Error'
    }

    return eval(expr)
  } catch {
    return 'Error'
  }
}

function recalcular() {
  bloques.value.forEach((b) => {
    if (!b.formula || b.formula.trim() === '') {
      b.resultado = String(b.prueba)
    } else {
      const val = calcularFormula(b.formula, bloques.value)
      b.resultado = val !== null ? String(val) : '--'
    }
  })
}

watch(bloques, recalcular, { deep: true })

/* -------------------------------------
   GUARDAR TODO
-------------------------------------- */
async function guardarTodo() {
  try {
    for (const bloque of bloques.value) {
      const payload = {
        nombre_resultado: bloque.nombre_resultado,
        orden: bloque.orden,
        visible: bloque.visible,
        formula: bloque.formula,
        prueba: bloque.prueba,
      }

      if (!bloque.id) {
        await axios.post(`${API}/configuracion-precios/${id_config}/resultados`, payload)
      } else {
        await axios.put(`${API}/configuracion-precios/resultados/${bloque.id}`, payload)
      }
    }

    Notify.create({ type: 'positive', message: 'Resultados guardados correctamente' })

    await cargarResultados()
    recalcular()
  } catch {
    Notify.create({ type: 'negative', message: 'Error al guardar' })
  }
}
</script>

<style>
.card-blue {
  border-left: 6px solid #1976d2;
  background: #e3f2fd;
  border-radius: 14px;
}

.card-red {
  border-left: 6px solid #d32f2f;
  background: #ffebee;
  border-radius: 14px;
}
</style>
