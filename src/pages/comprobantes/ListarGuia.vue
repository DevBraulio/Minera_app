<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="receipt_long" class="q-mr-sm" />
        Listado de Boletas/Guías
      </h4>
      <q-btn
        color="primary"
        icon="add"
        label="Nueva Guía"
        @click="abrirRegistro"
        class="shadow-3"
      />
    </div>

    <!-- MENSAJE INFORMATIVO -->
    <q-banner rounded class="bg-blue-1 text-primary q-mb-md border-blue">
      <template v-slot:avatar>
        <q-icon name="info" color="primary" />
      </template>
      Haz clic en cualquier fila para ver el detalle completo de la boleta.
    </q-banner>

    <div class="row q-col-gutter-lg">
      <!-- TABLA PRINCIPAL -->
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
            :columns="columnasBoleta"
            row-key="Num_Boleta"
            flat
            :rows-per-page-options="[10, 20, 50]"
            @row-click="verDetalle"
            class="cursor-pointer sticky-header-table"
          >
            <template v-slot:body-cell-acciones="props">
              <q-td>
                <q-btn
                  icon="visibility"
                  color="primary"
                  round
                  flat
                  dense
                  @click.stop="verDetalle(null, props.row)"
                >
                  <q-tooltip>Ver Detalle</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- DIALOGO DETALLE -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 600px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">
            <q-icon name="receipt" class="q-mr-sm" />
            Detalle de Boleta #{{ detalle?.Num_Boleta }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-white" />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <!-- QR Y LINK -->
            <div class="col-12 col-md-4 flex flex-center column">
              <div class="qr-container q-mb-md">
                <img :src="qrBoleta" alt="QR" style="width: 150px; height: 150px" />
              </div>
              <q-btn
                :href="urlBoleta"
                target="_blank"
                label="Ver Boleta Web"
                icon="open_in_new"
                color="secondary"
                outline
                rounded
                dense
                class="full-width"
              />
            </div>

            <!-- INFORMACIÓN GENERAL -->
            <div class="col-12 col-md-8">
              <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
                Información General
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-item dense>
                    <q-item-section>
                      <q-item-label caption>Cliente</q-item-label>
                      <q-item-label>{{ detalle?.ClienteNombre }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item dense>
                    <q-item-section>
                      <q-item-label caption>Código Cliente</q-item-label>
                      <q-item-label>{{ detalle?.Cod_Cliente }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item dense>
                    <q-item-section>
                      <q-item-label caption>Fecha</q-item-label>
                      <q-item-label>{{ detalle?.Fecha }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item dense>
                    <q-item-section>
                      <q-item-label caption>Empleado</q-item-label>
                      <q-item-label>{{ detalle?.Cod_empleado }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
                Resumen Económico
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-4">
                  <q-item dense class="bg-grey-2 rounded-borders">
                    <q-item-section>
                      <q-item-label caption>Total</q-item-label>
                      <q-item-label class="text-weight-bold text-primary"
                        >S/. {{ detalle?.Total }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-4">
                  <q-item dense class="bg-grey-2 rounded-borders">
                    <q-item-section>
                      <q-item-label caption>A cuenta</q-item-label>
                      <q-item-label class="text-weight-bold text-positive"
                        >S/. {{ detalle?.Acuenta }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-4">
                  <q-item dense class="bg-grey-2 rounded-borders">
                    <q-item-section>
                      <q-item-label caption>Resta</q-item-label>
                      <q-item-label class="text-weight-bold text-negative"
                        >S/. {{ detalle?.Resta }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- TABLA GUIAS -->
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="science" class="q-mr-sm" />
            Guías / Ensayos asociados
          </div>

          <q-table
            flat
            bordered
            dense
            :rows="detalle?.guias || []"
            :columns="columnasGuias"
            row-key="Co_Guia"
            :rows-per-page-options="[10, 20, 50]"
            class="guias-table"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOGO REGISTRO GUÍA -->
    <q-dialog v-model="showRegistroDialog" persistent>
      <q-card style="min-width: 800px; max-width: 95vw">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">Registrar Nueva Guía</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <!-- SECCIÓN IZQUIERDA: FORMULARIO -->
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-primary text-bold q-mb-sm">Datos de la Guía</div>

              <!-- CLIENTE SELECCIONADO -->
              <q-input
                filled
                readonly
                v-model="nombreClienteSeleccionado"
                label="Cliente Seleccionado"
                hint="Seleccione un cliente de la lista"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>

              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-input filled v-model="formGuia.Co_boleta" label="Número de Boleta" />
                </div>
                <div class="col-12">
                  <q-input filled v-model="formGuia.identificacion" label="Identificación" />
                </div>
                <div class="col-12">
                  <q-input filled v-model="formGuia.Metodo" label="Método" />
                </div>
                <div class="col-12">
                  <q-input filled v-model="formGuia.Elementos" label="Elementos" />
                </div>
                <div class="col-12">
                  <q-input
                    filled
                    v-model="formGuia.Descripcion"
                    label="Descripción"
                    type="textarea"
                    rows="2"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    filled
                    v-model.number="formGuia.Total"
                    label="Total"
                    type="number"
                    step="0.01"
                    prefix="S/."
                  />
                </div>
                <div class="col-6">
                  <q-input filled v-model="formGuia.MarchaAnalítica" label="Marcha Analítica" />
                </div>
                <div class="col-12">
                  <q-input filled v-model="formGuia.MetodoVerdad" label="Método Verdad" />
                </div>
              </div>
            </div>

            <!-- SECCIÓN DERECHA: SELECCIÓN DE CLIENTE -->
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-primary text-bold q-mb-sm">Seleccionar Cliente</div>
              <q-input
                dense
                filled
                v-model="filtroClientes"
                placeholder="Buscar cliente..."
                class="q-mb-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-table
                flat
                bordered
                dense
                :rows="clientesFiltrados"
                :columns="columnasClientes"
                row-key="id_cliente"
                :rows-per-page-options="[10, 20, 50]"
                separator="cell"
                class="bg-grey-1"
              >
                <template v-slot:body-cell-acciones="props">
                  <q-td :props="props" class="text-center">
                    <q-btn
                      dense
                      round
                      color="positive"
                      icon="check"
                      size="sm"
                      @click="seleccionarCliente(props.row)"
                    >
                      <q-tooltip>Seleccionar</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            label="Guardar Guía"
            color="primary"
            @click="guardarGuia"
            :loading="loadingGuardar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import QRCode from 'qrcode'
import { Notify } from 'quasar'
import type { Boleta } from '../../interfaces'
import type { QTableProps } from 'quasar'

// INTERFAZ CLIENTE LOCAL
interface Cliente {
  id_cliente: string
  nom_cliente: string
  ruc_cliente: string
  telefono?: string
  direccion?: string
  email?: string
}

const API = 'https://cifradosdev.com/certi_minera_backend/public'

// ========= ESTADOS LISTADO =========
const boletas = ref<Boleta[]>([])
const detalle = ref<Boleta | null>(null)
const showDialog = ref(false)
const filtro = ref('')
const urlBoleta = ref('')
const qrBoleta = ref('')

// ========= ESTADOS REGISTRO =========
const showRegistroDialog = ref(false)
const loadingGuardar = ref(false)
const clientes = ref<Cliente[]>([])
const filtroClientes = ref('')
const nombreClienteSeleccionado = ref('')
const clienteIdSeleccionado = ref('')

const formGuia = ref({
  Co_Guia: null,
  Co_boleta: '',
  Cod_cliente: '',
  identificacion: '',
  Metodo: '',
  Elementos: '',
  Descripcion: '',
  Total: 0,
  MarchaAnalítica: '',
  MetodoVerdad: '',
})

// Columnas Boleta
const columnasBoleta: QTableProps['columns'] = [
  {
    name: 'Num_Boleta',
    label: 'Boleta',
    field: 'Num_Boleta',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ClienteNombre',
    label: 'Cliente',
    field: 'ClienteNombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'Fecha',
    label: 'Fecha',
    field: 'Fecha',
    align: 'center',
    sortable: true,
  },
  {
    name: 'Total',
    label: 'Total (S/.)',
    field: 'Total',
    align: 'right',
    sortable: true,
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'center',
  },
]

// Columnas Guías Detalle
const columnasGuias: QTableProps['columns'] = [
  { name: 'Co_Guia', label: 'ID Guía', field: 'Co_Guia', align: 'left' },
  { name: 'identificacion', label: 'Identificación', field: 'identificacion', align: 'left' },
  { name: 'TipoMuestraNombre', label: 'Tipo Muestra', field: 'TipoMuestraNombre', align: 'left' },
  { name: 'AnalisisNombre', label: 'Análisis / Método', field: 'AnalisisNombre', align: 'left' },
  { name: 'Descripcion', label: 'Descripción', field: 'Descripcion', align: 'left' },
  { name: 'Total', label: 'Precio', field: 'Total', align: 'right' },
]

// Columnas Clientes (Modal)
const columnasClientes: QTableProps['columns'] = [
  { name: 'acciones', label: 'Sel.', field: 'acciones', align: 'center' },
  { name: 'nom_cliente', label: 'Nombre', field: 'nom_cliente', align: 'left', sortable: true },
  { name: 'ruc_cliente', label: 'RUC', field: 'ruc_cliente', align: 'left' },
]

// Filtrado Boletas
const filtrado = computed(() => {
  if (!filtro.value) return boletas.value
  const lower = filtro.value.toLowerCase()
  return boletas.value.filter(
    (b) =>
      (b.Num_Boleta?.toLowerCase() || '').includes(lower) ||
      (b.ClienteNombre?.toLowerCase() || '').includes(lower) ||
      (b.Fecha?.toLowerCase() || '').includes(lower),
  )
})

// Filtrado Clientes (Modal)
const clientesFiltrados = computed(() => {
  if (!filtroClientes.value) return clientes.value
  const lower = filtroClientes.value.toLowerCase()
  return clientes.value.filter(
    (c) =>
      (c.nom_cliente?.toLowerCase() || '').includes(lower) ||
      (c.ruc_cliente?.toLowerCase() || '').includes(lower),
  )
})

// ==========================
// OBTENER BOLETAS Y CLIENTES
// ==========================
onMounted(() => {
  void cargarBoletas()
  void cargarClientes()
})

async function cargarBoletas() {
  try {
    const { data } = await axios.get<Boleta[]>(`${API}/boletas/top20`)
    boletas.value = data
  } catch (error) {
    console.error('Error cargando boletas:', error)
  }
}

async function cargarClientes() {
  try {
    const { data } = await axios.get<Cliente[]>(`${API}/clientes/listar`)
    clientes.value = data
  } catch (error) {
    console.error('Error cargando clientes:', error)
  }
}

// ==========================
// DETALLE + GENERAR QR
// ==========================
async function verDetalle(_: unknown, row: Boleta) {
  detalle.value = row
  urlBoleta.value = `https://cifradosdev.com/boleta/${row.Num_Boleta}`
  qrBoleta.value = await QRCode.toDataURL(urlBoleta.value)
  showDialog.value = true
}

// ==========================
// REGISTRO DE GUÍA
// ==========================
function abrirRegistro() {
  resetForm()
  showRegistroDialog.value = true
}

function resetForm() {
  nombreClienteSeleccionado.value = ''
  clienteIdSeleccionado.value = ''
  filtroClientes.value = ''
  formGuia.value = {
    Co_Guia: null,
    Co_boleta: '',
    Cod_cliente: '',
    identificacion: '',
    Metodo: '',
    Elementos: '',
    Descripcion: '',
    Total: 0,
    MarchaAnalítica: '',
    MetodoVerdad: '',
  }
}

function seleccionarCliente(cliente: Cliente) {
  clienteIdSeleccionado.value = cliente.id_cliente
  nombreClienteSeleccionado.value = cliente.nom_cliente
  Notify.create({
    type: 'positive',
    message: `Cliente seleccionado: ${cliente.nom_cliente}`,
    position: 'top',
    timeout: 1000,
  })
}

async function guardarGuia() {
  if (!clienteIdSeleccionado.value) {
    Notify.create({ type: 'warning', message: 'Debe seleccionar un cliente de la lista' })
    return
  }

  loadingGuardar.value = true
  try {
    // Asignar ID de cliente seleccionado
    formGuia.value.Cod_cliente = clienteIdSeleccionado.value

    await axios.post(`${API}/guias`, formGuia.value)

    Notify.create({ type: 'positive', message: 'Guía registrada correctamente' })
    showRegistroDialog.value = false
    void cargarBoletas() // Recargar lista
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any
    Notify.create({
      type: 'negative',
      message: 'Error al guardar guía',
      caption: err.response?.data?.message || 'Error desconocido',
    })
  } finally {
    loadingGuardar.value = false
  }
}
</script>

<style scoped lang="scss">
.border-blue {
  border: 1px solid #bbdefb;
}

.qr-container {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background: white;
}

.guias-table {
  :deep(thead tr:first-child th) {
    background-color: #f5f5f5;
    font-weight: bold;
  }
}
</style>
