<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="attach_money" class="q-mr-sm" />
        Configuración de Precios
      </h4>
      <q-btn
        label="Nueva Configuración"
        icon="add"
        color="primary"
        unelevated
        rounded
        @click="abrirDialogo"
      />
    </div>

    <!-- TABLA -->
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <div class="table-card">
          <div class="q-pa-md">
            <q-input dense filled v-model="filtro" placeholder="Buscar..." class="input-modern">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <q-table
            :rows="filtrado"
            :columns="columns"
            row-key="id"
            flat
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:body-cell-estado="props">
              <q-td>
                <q-badge
                  :color="props.row.estado === 1 ? 'positive' : 'grey-5'"
                  :label="props.row.estado === 1 ? 'Activo' : 'Inactivo'"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td>
                <q-btn
                  icon="edit"
                  color="primary"
                  round
                  flat
                  dense
                  class="q-mr-sm"
                  @click="editar(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>

                <q-btn
                  :icon="props.row.estado === 1 ? 'toggle_on' : 'toggle_off'"
                  :color="props.row.estado === 1 ? 'positive' : 'grey'"
                  round
                  flat
                  dense
                  class="q-mr-sm"
                  @click="toggleEstado(props.row)"
                >
                  <q-tooltip>{{ props.row.estado === 1 ? 'Desactivar' : 'Activar' }}</q-tooltip>
                </q-btn>

                <q-btn
                  icon="list"
                  color="secondary"
                  round
                  flat
                  dense
                  @click="irResultados(props.row)"
                >
                  <q-tooltip>Ver resultados</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- DIALOGO FORMULARIO -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            <q-icon name="add_circle" class="q-mr-sm" />
            {{ configuracionForm.id ? 'Actualizar Precio' : 'Nueva Configuración' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- SELECT TIPO MUESTRA -->
          <q-select
            filled
            dense
            v-model="configuracionForm.id_tipo_muestra"
            :options="tiposMuestra"
            option-value="id"
            option-label="tipo_muestra"
            emit-value
            map-options
            label="Tipo de Muestra"
            class="input-modern q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="biotech" />
            </template>
          </q-select>

          <!-- SELECT ELEMENTO -->
          <q-select
            filled
            dense
            v-model="configuracionForm.id_elemento"
            :options="elementos"
            option-value="id"
            option-label="tipo_elemento"
            emit-value
            map-options
            label="Elemento"
            class="input-modern q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>

          <!-- SELECT MARCHA METODO -->
          <q-select
            filled
            dense
            v-model="configuracionForm.id_marcha_metodo"
            :options="metodos"
            option-value="id"
            option-label="metodo"
            emit-value
            map-options
            label="Marcha / Método"
            class="input-modern q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="precision_manufacturing" />
            </template>
          </q-select>

          <q-input
            filled
            dense
            v-model="configuracionForm.nombre_comercial"
            label="Nombre Comercial"
            class="input-modern q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="label" />
            </template>
          </q-input>

          <q-input
            filled
            dense
            v-model.number="configuracionForm.precio"
            type="number"
            label="Precio (S/.)"
            class="input-modern q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="payments" />
            </template>
          </q-input>

          <q-input
            filled
            dense
            v-model.number="configuracionForm.resultados_esperados"
            type="number"
            label="Cantidad"
            hint="Cantidad de resultados esperados"
            class="input-modern q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="analytics" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            unelevated
            rounded
            :label="configuracionForm.id ? 'Actualizar' : 'Guardar'"
            :color="configuracionForm.id ? 'warning' : 'primary'"
            @click="guardar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
/* ---------------------------------
     IMPORTS
  ----------------------------------- */
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Notify, type QTableProps } from 'quasar'
import { useRouter } from 'vue-router'
import type { ConfiguracionPrecio, TipoMuestra, Elemento, MarchaMetodo } from '../../interfaces'
/* ---------------------------------
     ROUTER
  ----------------------------------- */
const router = useRouter()

/* ---------------------------------
     API BASE
  ----------------------------------- */
const API = 'https://cifradosdev.com/certi_minera_backend/public'

/* ---------------------------------
     ESTADO
  ----------------------------------- */
const showDialog = ref(false)

/* ---------------------------------
     FORMULARIO
  ----------------------------------- */
const configuracionForm = ref<{
  id: number | null
  id_tipo_muestra: number | null
  id_elemento: number | null
  id_marcha_metodo: number | null
  nombre_comercial: string
  precio: number | null
  resultados_esperados: number | null
}>({
  id: null,
  id_tipo_muestra: null,
  id_elemento: null,
  id_marcha_metodo: null,
  nombre_comercial: '',
  precio: null,
  resultados_esperados: null,
})

/* ---------------------------------
     LISTAS Y TABLA
  ----------------------------------- */

const tiposMuestra = ref<TipoMuestra[]>([])
const elementos = ref<Elemento[]>([])
const metodos = ref<MarchaMetodo[]>([])
const lista = ref<ConfiguracionPrecio[]>([])
const filtro = ref<string>('')

/* ---------------------------------
     COLUMNAS
  ----------------------------------- */
const columns: QTableProps['columns'] = [
  {
    name: 'nombre_comercial',
    label: 'Nombre Comercial',
    field: 'nombre_comercial',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'tipo_muestra',
    label: 'Tipo Muestra',
    field: 'nombre_tipo_muestra',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'tipo_elemento',
    label: 'Elemento',
    field: 'nombre_elemento',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'metodo',
    label: 'Método',
    field: 'nombre_metodo',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right' as const, sortable: true },
  { name: 'dias', label: 'Cantidad', field: 'resultados_esperados', align: 'center' as const },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
]

/* ---------------------------------
     FILTRADO
  ----------------------------------- */
const filtrado = computed(() =>
  lista.value.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(filtro.value.toLowerCase()),
  ),
)

/* ---------------------------------
     CARGA INICIAL
  ----------------------------------- */
onMounted(async () => {
  await cargarListas()
  await cargarConfiguraciones()
})

/* ---------------------------------
     CARGAR LISTAS
  ----------------------------------- */
async function cargarListas() {
  tiposMuestra.value = (await axios.get(`${API}/tipo-muestra`)).data
  elementos.value = (await axios.get(`${API}/elemento`)).data
  metodos.value = (await axios.get(`${API}/marcha-metodo`)).data
}

/* ---------------------------------
     CARGAR CONFIGURACIONES
  ----------------------------------- */
async function cargarConfiguraciones() {
  const data = (await axios.get(`${API}/configuracion-precios`)).data
  console.log('Configuraciones Data:', data) // DEBUG

  lista.value = data.map((item: ConfiguracionPrecio) => ({
    ...item,
    estado: Number(item.estado !== undefined ? item.estado : item.activo), // Handle both fields
    nombre_tipo_muestra:
      tiposMuestra.value.find((t) => t.id == item.id_tipo_muestra)?.tipo_muestra || '—',
    nombre_elemento: elementos.value.find((e) => e.id == item.id_elemento)?.tipo_elemento || '—',
    nombre_metodo: metodos.value.find((m) => m.id == item.id_marcha_metodo)?.metodo || '—',
  }))
}

/* ---------------------------------
     ABRIR DIALOGO
  ----------------------------------- */
function abrirDialogo() {
  limpiarFormulario()
  showDialog.value = true
}

/* ---------------------------------
     GUARDAR / ACTUALIZAR
  ----------------------------------- */
async function guardar() {
  try {
    if (!configuracionForm.value.id) {
      await axios.post(`${API}/configuracion-precios`, configuracionForm.value)
      Notify.create({ type: 'positive', message: 'Registrado correctamente' })
    } else {
      await axios.put(
        `${API}/configuracion-precios/${configuracionForm.value.id}`,
        configuracionForm.value,
      )
      Notify.create({ type: 'warning', message: 'Actualizado correctamente' })
    }

    showDialog.value = false
    limpiarFormulario()
    void cargarConfiguraciones()
  } catch {
    Notify.create({ type: 'negative', message: 'Error al guardar' })
  }
}

/* ---------------------------------
     EDITAR
  ----------------------------------- */
function editar(row: ConfiguracionPrecio) {
  configuracionForm.value = {
    id: row.id ?? null,
    id_tipo_muestra: row.id_tipo_muestra,
    id_elemento: row.id_elemento,
    id_marcha_metodo: row.id_marcha_metodo,
    nombre_comercial: row.nombre_comercial,
    precio: row.precio,
    resultados_esperados: row.resultados_esperados,
  }
  showDialog.value = true
}

/* ---------------------------------
     TOGGLE ESTADO (ACTIVAR/DESACTIVAR)
  ----------------------------------- */
async function toggleEstado(row: ConfiguracionPrecio) {
  try {
    if (row.estado === 1) {
      // Inactivar usando DELETE
      await axios.delete(`${API}/configuracion-precios/${row.id}`)
      Notify.create({ type: 'warning', message: 'Configuración desactivada' })
    } else {
      // Activar usando PUT /activar/{id}
      await axios.put(`${API}/configuracion-precios/activar/${row.id}`)
      Notify.create({ type: 'positive', message: 'Configuración activada' })
    }
    void cargarConfiguraciones()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Error al cambiar el estado' })
  }
}

/* ---------------------------------
     IR A RESULTADOS
  ----------------------------------- */
function irResultados(row: ConfiguracionPrecio) {
  if (!row || !row.id) {
    Notify.create({ type: 'negative', message: 'No se pudo obtener el ID' })
    return
  }

  void router.push(`/configuracion-precios/${row.id}/resultados`)
}

/* ---------------------------------
     LIMPIAR FORMULARIO
  ----------------------------------- */
function limpiarFormulario() {
  configuracionForm.value = {
    id: null,
    id_tipo_muestra: null,
    id_elemento: null,
    id_marcha_metodo: null,
    nombre_comercial: '',
    precio: null,
    resultados_esperados: null,
  }
}
</script>

<style scoped lang="scss">
// Use global styles from app.scss
// Additional component-specific styles if needed
</style>
