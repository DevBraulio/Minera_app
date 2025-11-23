<template>
  <q-page class="q-pa-xl bg-grey-2">
    <q-card class="q-pa-xl shadow-10 bg-white" style="border-radius: 18px">
      <div class="text-h5 text-primary text-bold q-mb-lg">Registrar Boleta y Ensayos</div>

      <!-- ===================================================== -->
      <!--                  DATOS GENERALES BOLETA               -->
      <!-- ===================================================== -->
      <!-- ===================================================== -->
      <!--                  DATOS GENERALES BOLETA               -->
      <!-- ===================================================== -->
      <div class="row q-col-gutter-lg">
        <!-- ROW 1 -->
        <!-- FECHA -->
        <div class="col-12 col-md-3">
          <q-input filled type="date" v-model="boleta.Fecha" label="Fecha" />
        </div>

        <!-- TIPO DOCUMENTO -->
        <div class="col-12 col-md-3">
          <q-select
            filled
            v-model="boleta.TIPO"
            :options="['Factura', 'Boleta', 'Guía']"
            label="Tipo Documento"
          />
        </div>

        <!-- EMPLEADO (Registrado por) -->
        <div class="col-12 col-md-6">
          <q-input
            filled
            label="Registrado por (Empleado)"
            v-model="empleadoDisplay"
            readonly
            hint="Usuario que registra la guía"
          />
        </div>

        <!-- ROW 2 -->
        <!-- CLIENTE -->
        <div class="col-12 col-md-4 row">
          <q-select
            class="col"
            filled
            v-model="boleta.Cod_Cliente"
            :options="clientes"
            option-label="nom_cliente"
            option-value="id_cliente"
            label="Cliente"
            emit-value
            map-options
          />

          <q-btn
            dense
            color="primary"
            icon="search"
            class="q-ml-sm col-auto"
            @click="modalCliente = true"
          />
        </div>

        <!-- ENVASE -->
        <div class="col-12 col-md-3">
          <q-select
            filled
            v-model="boleta.Envase"
            :options="['Envase 1', 'Envase 2', 'Envase 3']"
            label="Envase"
          />
        </div>

        <!-- ACUENTA -->
        <div class="col-12 col-md-2">
          <q-input
            filled
            type="number"
            v-model.number="boleta.Acuenta"
            label="Acuenta"
            @update:model-value="calcularResta"
          />
        </div>

        <!-- RESTA -->
        <div class="col-12 col-md-3">
          <q-input filled readonly v-model.number="boleta.Resta" type="number" label="Resta" />
        </div>
      </div>

      <!-- ===================================================== -->
      <!--                       ENSAYOS                         -->
      <!-- ===================================================== -->

      <div class="text-h6 text-primary q-mt-xl q-mb-md">Ensayos</div>

      <q-markup-table dense flat bordered separator="cell" class="q-mb-lg">
        <thead class="bg-grey-2">
          <tr>
            <th class="text-left" style="width: 30%; min-width: 200px">Identificación</th>
            <th class="text-left" style="width: 25%; min-width: 180px">Tipo Muestra</th>
            <th class="text-left" style="width: 25%; min-width: 180px">
              Tipo Análisis (Nombre Comercial)
            </th>
            <th class="text-right" style="width: 10%; min-width: 100px">Precio</th>
            <th class="text-center" style="width: 10%; min-width: 50px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ens, index) in ensayos" :key="index">
            <td class="q-pa-none">
              <q-input
                dense
                borderless
                v-model="ens.identificacion"
                placeholder="Identificación"
                class="q-px-sm full-width"
              />
            </td>
            <td class="q-pa-none">
              <q-select
                dense
                borderless
                v-model="ens.id_tipo_muestra"
                :options="tiposMuestra"
                option-label="tipo_muestra"
                option-value="id"
                emit-value
                map-options
                class="q-px-sm full-width"
                @update:model-value="(val) => cargarAnalisis(val, ens)"
              />
            </td>
            <td class="q-pa-none">
              <q-select
                dense
                borderless
                v-model="ens.id_analisis"
                :options="ens.analisisDisponibles"
                option-label="nombre_comercial"
                option-value="id"
                emit-value
                map-options
                class="q-px-sm full-width"
                :disable="!ens.id_tipo_muestra"
                :label="!ens.id_tipo_muestra ? 'Seleccione Tipo Muestra primero' : ''"
                @update:model-value="llenarDesdeConfiguracion(ens)"
              />
            </td>
            <td class="text-right q-px-sm">
              {{ ens.Total ? ens.Total.toFixed(2) : '0.00' }}
            </td>
            <td class="text-center q-pa-none">
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                size="sm"
                @click="eliminarEnsayo(index)"
              />
            </td>
          </tr>
          <!-- Total Row -->
          <tr class="bg-grey-1 text-bold">
            <td colspan="3" class="text-right q-pr-md">TOTAL ENSAYOS:</td>
            <td class="text-right q-px-sm">S/ {{ totalEnsayos.toFixed(2) }}</td>
            <td class="text-center">
              <q-btn flat round dense color="primary" icon="add" size="sm" @click="agregarEnsayo">
                <q-tooltip>Agregar Fila</q-tooltip>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-btn
        color="primary"
        label="Guardar Boleta"
        size="lg"
        class="full-width"
        :loading="loading"
        @click="guardar"
      />
    </q-card>

    <!-- ===================================================== -->
    <!--                  MODAL BUSCAR CLIENTE                 -->
    <!-- ===================================================== -->

    <q-dialog v-model="modalCliente">
      <q-card style="min-width: 450px">
        <q-card-section><div class="text-h6">Buscar Cliente</div></q-card-section>

        <q-card-section>
          <q-input
            filled
            label="Buscar cliente..."
            v-model="textoBuscar"
            debounce="400"
            @update:model-value="buscarCliente"
          />
        </q-card-section>

        <q-list bordered separator>
          <q-item
            v-for="c in clientesBusqueda"
            :key="c.id_cliente"
            clickable
            @click="seleccionarCliente(c)"
          >
            <q-item-section>
              <q-item-label>{{ c.nom_cliente }}</q-item-label>
              <q-item-label caption>{{ c.ruc_cliente }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const API = 'https://cifradosdev.com/certi_minera_backend/public'
const authStore = useAuthStore()

// INTERFACES
interface Cliente {
  id_cliente: string
  nom_cliente: string
  ruc_cliente: string
}

interface TipoMuestra {
  id: number
  tipo_muestra: string
}

interface Analisis {
  id: number
  nombre_comercial: string
  precio: number
}

interface Ensayo {
  identificacion: string
  id_tipo_muestra: number | null
  id_analisis: number | null
  analisisDisponibles: Analisis[]
  Total: number
  id_configuracion_precios: number | null
  Descripcion: string
}

const loading = ref(false)

const modalCliente = ref(false)
const textoBuscar = ref('')
const clientesBusqueda = ref<Cliente[]>([])

const clientes = ref<Cliente[]>([])
const tiposMuestra = ref<TipoMuestra[]>([])

const boleta = ref({
  Cod_Cliente: '',
  Cod_empleado: '',
  Fecha: '',
  Total: 0,
  Acuenta: 0,
  Resta: 0,
  Envase: '',
  Can_muestras: 0,
  TIPO: 'Guía',
})

const empleadoDisplay = computed(() => {
  if (authStore.currentUser) {
    return `${authStore.currentUser.nombre} (ID: ${authStore.currentUser.id})`
  }
  return ''
})

// RESTA
function calcularResta() {
  boleta.value.Resta = boleta.value.Total - (boleta.value.Acuenta || 0)
}

// =========================
// ENSAYOS
// =========================
const ensayos = ref<Ensayo[]>([crearEnsayo()])

function crearEnsayo(): Ensayo {
  return {
    identificacion: '',
    id_tipo_muestra: null,
    id_analisis: null,
    analisisDisponibles: [],
    Total: 0,
    id_configuracion_precios: null,
    Descripcion: '', // Added missing field
  }
}

function agregarEnsayo() {
  ensayos.value.push(crearEnsayo())
}

function eliminarEnsayo(i: number) {
  ensayos.value.splice(i, 1)
}

const totalEnsayos = computed(() => ensayos.value.reduce((sum, e) => sum + (e.Total || 0), 0))

// =========================
// CARGAR DATOS
// =========================
onMounted(async () => {
  if (authStore.currentUser) {
    boleta.value.Cod_empleado = String(authStore.currentUser.id)
  }
  clientes.value = (await axios.get(`${API}/clientes/listar`)).data
  tiposMuestra.value = (await axios.get(`${API}/tipo-muestra`)).data
})

// =========================
// BUSCAR CLIENTE
// =========================
async function buscarCliente() {
  if (textoBuscar.value.length < 2) return
  clientesBusqueda.value = (
    await axios.get(`${API}/clientes/buscar`, {
      params: { q: textoBuscar.value },
    })
  ).data
}

function seleccionarCliente(c: Cliente) {
  boleta.value.Cod_Cliente = c.id_cliente
  modalCliente.value = false
}

// =========================
// CARGAR ANALISIS
// =========================
async function cargarAnalisis(val: number, ens: Ensayo) {
  ens.id_tipo_muestra = val
  ens.analisisDisponibles = []
  ens.id_analisis = null
  ens.Total = 0

  if (!val) return

  try {
    const res = await axios.get(`${API}/configuracion-precios/por-tipo-muestra`, {
      params: { muestra: val },
    })
    ens.analisisDisponibles = res.data
  } catch (error) {
    console.error('Error cargando análisis:', error)
  }
}

// =========================
// LLENAR DATOS ANALISIS
// =========================
function llenarDesdeConfiguracion(ens: Ensayo) {
  console.log('Seleccionado ID:', ens.id_analisis)
  console.log('Disponibles:', ens.analisisDisponibles)
  // Use == to handle string/number mismatch
  const item = ens.analisisDisponibles.find((x) => x.id == ens.id_analisis)

  if (!item) {
    console.warn('No se encontró el análisis seleccionado')
    return
  }

  console.log('Item encontrado:', item)
  ens.id_configuracion_precios = item.id
  ens.Total = Number(item.precio) // Ensure number
}

// =========================
// GUARDAR BOLETA
// =========================
// GUARDAR BOLETA
// =========================
async function guardar() {
  try {
    // VALIDACIONES
    if (!boleta.value.Cod_Cliente) {
      Notify.create({ type: 'negative', message: 'Seleccione un cliente.' })
      return
    }
    if (!boleta.value.Fecha) {
      Notify.create({ type: 'negative', message: 'Seleccione una fecha.' })
      return
    }
    if (!boleta.value.Envase) {
      Notify.create({ type: 'negative', message: 'Seleccione un envase.' })
      return
    }
    if (!boleta.value.TIPO) {
      Notify.create({ type: 'negative', message: 'Seleccione un tipo de documento.' })
      return
    }

    if (ensayos.value.length === 0) {
      Notify.create({ type: 'negative', message: 'Debe agregar al menos un ensayo.' })
      return
    }

    for (const e of ensayos.value) {
      if (!e.id_configuracion_precios) {
        Notify.create({ type: 'negative', message: 'Todos los ensayos deben tener análisis.' })
        return
      }
    }

    loading.value = true

    boleta.value.Total = totalEnsayos.value
    boleta.value.Can_muestras = ensayos.value.length
    calcularResta()

    // Clean up payload with STRICT TYPES
    const guiasPayload = ensayos.value.map((e) => ({
      identificacion: String(e.identificacion || ''),
      id_tipo_muestra: Number(e.id_tipo_muestra),
      id_analisis: Number(e.id_analisis),
      id_configuracion_precios: Number(e.id_configuracion_precios),
      Total: Number(e.Total),
      Descripcion: String(e.Descripcion || ''),
    }))

    const boletaPayload = {
      Cod_Cliente: String(boleta.value.Cod_Cliente),
      Cod_empleado: String(boleta.value.Cod_empleado),
      Fecha: String(boleta.value.Fecha),
      Total: Number(boleta.value.Total),
      Acuenta: Number(boleta.value.Acuenta),
      Resta: Number(boleta.value.Resta),
      Envase: String(boleta.value.Envase),
      Can_muestras: Number(boleta.value.Can_muestras),
      TIPO: String(boleta.value.TIPO),
    }

    const payload = {
      boleta: boletaPayload,
      guias: guiasPayload,
    }

    await axios.post(`${API}/boletas`, payload)

    loading.value = false
    Notify.create({ type: 'positive', message: 'Boleta guardada exitosamente' })

    // LIMPIAR FORMULARIO
    boleta.value = {
      Cod_Cliente: '',
      Cod_empleado: '2',
      Fecha: '',
      Total: 0,
      Acuenta: 0,
      Resta: 0,
      Envase: '',
      Can_muestras: 0,
      TIPO: 'Guía',
    }

    ensayos.value = [crearEnsayo()]
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    loading.value = false
    console.error(error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar',
    })
  }
}
</script>
