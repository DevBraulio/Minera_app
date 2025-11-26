<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="add_card" class="q-mr-sm" />
        Crear Certificado
      </h4>
    </div>

    <div class="row q-col-gutter-md">
      <!-- SECCIÓN IZQUIERDA: LISTADO Y FILTROS -->
      <div class="col-12 col-md-6">
        <!-- FILTROS CARD -->
        <q-card class="q-mb-md shadow-1 rounded-borders">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
              <q-icon name="filter_list" class="q-mr-sm" />
              Filtros de Búsqueda
            </div>
            <div class="row q-col-gutter-sm items-center">
              <!-- Numero de Guia -->
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  v-model="filtros.numGuia"
                  label="N° Guía/Boleta"
                  hint="Buscar por número"
                >
                  <template v-slot:prepend>
                    <q-icon name="receipt" />
                  </template>
                </q-input>
              </div>

              <!-- Identificación -->
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  v-model="filtros.identificacion"
                  label="Identificación"
                  hint="ID usuario registro"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>
              </div>

              <!-- Nombre Cliente -->
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  v-model="filtros.cliente"
                  label="Cliente"
                  hint="Nombre del cliente"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>

              <!-- Fecha Recepción -->
              <div class="col-12 col-md-4">
                <q-input
                  dense
                  filled
                  v-model="filtros.fecha"
                  label="Fecha"
                  type="date"
                  hint="Fecha recepción"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>

              <!-- Rango de Fechas -->
              <div class="col-12 col-md-6">
                <q-input
                  dense
                  filled
                  v-model="filtros.rangoDisplay"
                  label="Rango Fechas"
                  readonly
                  class="cursor-pointer"
                  hint="Filtrar por periodo"
                >
                  <template v-slot:prepend>
                    <q-icon name="date_range" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="filtros.rango"
                      name="close"
                      @click.stop="filtros.rango = null"
                      class="cursor-pointer"
                    />
                  </template>

                  <!-- Popup Proxy attached to the input -->
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="filtros.rango"
                      range
                      mask="YYYY-MM-DD"
                      title="Rango de Fechas"
                      subtitle="Seleccione periodo"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-input>
              </div>

              <!-- Boton Limpiar -->
              <div class="col-12 col-md-2 text-center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="cleaning_services"
                  @click="limpiarFiltros"
                  class="q-mt-sm"
                >
                  <q-tooltip>Limpiar Filtros</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- TABLA RESULTADOS -->
        <div class="table-card">
          <q-table
            :rows="guiasFiltradas"
            :columns="columnas"
            row-key="Num_Boleta"
            flat
            :rows-per-page-options="[10, 20, 50]"
            class="modern-table cursor-pointer"
            @row-click="seleccionarBoleta"
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                @click="seleccionarBoleta($event, props.row)"
                :class="{
                  'bg-blue-1 text-primary': boletaSeleccionada?.Num_Boleta === props.row.Num_Boleta,
                }"
                class="cursor-pointer"
              >
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <template v-if="col.name === 'Estado'">
                    <q-icon
                      v-if="tieneCertificado(props.row.Num_Boleta)"
                      name="check_circle"
                      color="positive"
                      size="sm"
                    >
                      <q-tooltip>Certificado Generado</q-tooltip>
                    </q-icon>
                    <q-icon v-else name="radio_button_unchecked" color="grey-4" size="sm" />
                  </template>
                  <template v-else-if="col.name === 'ClienteNombre'">
                    {{ getNombreCliente(props.row.Cod_Cliente) }}
                  </template>
                  <template v-else>
                    {{ col.value }}
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>

      <!-- SECCIÓN DERECHA: PREVISUALIZACIÓN Y FORMULARIO -->
      <div class="col-12 col-md-6">
        <div v-if="boletaSeleccionada" class="column q-gutter-md full-height">
          <!-- CARD 1: GENERAR CERTIFICADO (ENCABEZADO) -->
          <q-card class="shadow-2">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">
                <q-icon name="post_add" class="q-mr-sm" />
                Generar Certificado
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    filled
                    :model-value="boletaSeleccionada.Num_Boleta"
                    label="N° Boleta"
                    readonly
                    bg-color="grey-2"
                  >
                    <template v-slot:prepend>
                      <q-icon name="receipt" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    filled
                    :model-value="getNombreCliente(boletaSeleccionada.Cod_Cliente)"
                    label="Cliente"
                    readonly
                    bg-color="grey-2"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    filled
                    :model-value="authStore.user?.nombre || 'Usuario Desconocido'"
                    label="Usuario Responsable"
                    readonly
                    bg-color="grey-2"
                    hint="Usuario que registra el certificado"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-banner class="bg-info text-white" rounded>
                    <template v-slot:avatar>
                      <q-icon name="info" />
                    </template>
                    El código del certificado se generará automáticamente con formato:
                    <strong>FRI-CER-año-XXXXXX</strong>
                  </q-banner>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md" v-if="!certificadoGenerado">
              <q-btn
                unelevated
                rounded
                color="primary"
                icon="settings"
                label="Generar Certificado"
                @click="generarCertificado"
                :loading="saving"
              />
            </q-card-actions>
          </q-card>

          <!-- CARD 2: DETALLES (ENSAYOS Y RESULTADOS) -->
          <q-card class="shadow-2 col">
            <q-card-section class="bg-secondary text-white">
              <div class="text-subtitle1 text-weight-bold row items-center">
                <q-icon name="science" class="q-mr-sm" />
                Detalles del Certificado
              </div>
            </q-card-section>

            <!-- STATE: NO CERTIFICADO GENERADO -->
            <q-card-section
              v-if="!certificadoGenerado"
              class="flex flex-center text-grey-7"
              style="min-height: 200px"
            >
              <div class="text-center">
                <q-icon name="info" size="3rem" class="q-mb-sm" />
                <div class="text-subtitle1">Genere el certificado para registrar los detalles</div>
              </div>
            </q-card-section>

            <!-- STATE: CERTIFICADO GENERADO (CONTENIDO) -->
            <q-card-section v-else class="scroll" style="max-height: 500px">
              <!-- LISTA DE ENSAYOS CON FORMULARIOS -->
              <div class="text-subtitle2 text-grey-8 q-mb-md">
                Complete los resultados de los ensayos:
              </div>

              <div v-if="boletaSeleccionada.guias && boletaSeleccionada.guias.length > 0">
                <q-expansion-item
                  v-for="(guia, index) in boletaSeleccionada.guias"
                  :key="guia.Co_Guia || index"
                  :label="`Ensayo: ${guia.identificacion}`"
                  :caption="`Método: ${guia.Metodo} | Elem: ${guia.Elementos}`"
                  icon="biotech"
                  class="q-mb-sm"
                  header-class="bg-blue-1"
                >
                  <q-card>
                    <q-card-section>
                      <div
                        v-if="guia.Co_Guia && resultadosPorGuia[guia.Co_Guia]?.loading"
                        class="row justify-center q-pa-md"
                      >
                        <q-spinner color="primary" size="2em" />
                      </div>

                      <div
                        v-else-if="guia.Co_Guia && resultadosPorGuia[guia.Co_Guia]?.campos?.length"
                      >
                        <div class="row q-col-gutter-md">
                          <template v-if="guia.Co_Guia">
                            <div
                              v-for="campo in resultadosPorGuia[guia.Co_Guia]?.campos || []"
                              :key="campo.id"
                              class="col-12 col-md-6"
                            >
                              <q-input
                                v-if="campo.id"
                                filled
                                v-model.number="resultadosPorGuia[guia.Co_Guia]!.valores[campo.id]"
                                :label="campo.nombre_resultado"
                                type="number"
                                step="0.01"
                                hint="Dejar vacío para registrar como 0"
                              />
                            </div>
                          </template>
                        </div>
                      </div>

                      <div v-else class="text-grey q-pa-sm text-center">
                        No hay campos de resultados configurados para este análisis.
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <!-- BOTÓN GUARDAR DATOS (AL FINAL DE TODOS LOS ENSAYOS) -->
                <div class="row justify-center q-mt-lg">
                  <q-btn
                    unelevated
                    rounded
                    color="positive"
                    icon="save"
                    label="Guardar Datos"
                    size="lg"
                    @click="guardarDatos"
                    :loading="savingResultados"
                  />
                </div>
              </div>
              <div v-else class="text-grey q-pa-md text-center">
                No hay ensayos asociados a esta boleta.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- EMPTY STATE -->
        <q-card
          v-else
          class="full-height flex flex-center bg-grey-1 text-grey-7"
          style="min-height: 400px"
        >
          <div class="text-center">
            <q-icon name="touch_app" size="4rem" />
            <div class="text-h6 q-mt-md">Seleccione una boleta</div>
            <div>Haga clic en una fila de la izquierda para comenzar</div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type {
  Boleta,
  Cliente,
  Guia,
  ResultadoConfiguracion,
  DetalleCertificado,
  Certificado,
} from 'src/interfaces'
import { useAuthStore } from 'src/stores/auth'

const API = 'https://cifradosdev.com/certi_minera_backend/public'
const authStore = useAuthStore()

// --- ESTADOS ---
const boletas = ref<Boleta[]>([])
const clientes = ref<Cliente[]>([])
const certificados = ref<Certificado[]>([])

const filtros = ref({
  numGuia: '',
  identificacion: '',
  cliente: '',
  fecha: '',
  rango: null as { from: string; to: string } | string | null,
  rangoDisplay: '',
})

// Selección
const boletaSeleccionada = ref<Boleta | null>(null)
const guiaSeleccionada = ref<Guia | null>(null)

const camposResultados = ref<ResultadoConfiguracion[]>([])
const valoresResultados = ref<Record<number, number>>({})
const saving = ref(false)
const savingResultados = ref(false)
const certificadoGenerado = ref<number | null>(null)

// Resultados por guía (para manejar múltiples ensayos)
const resultadosPorGuia = ref<
  Record<
    number,
    {
      loading: boolean
      campos: ResultadoConfiguracion[]
      valores: Record<number, number>
    }
  >
>({})

// --- COLUMNAS ---
const columnas: QTableProps['columns'] = [
  {
    name: 'Estado',
    label: 'Estado',
    field: 'Estado',
    align: 'center',
    sortable: false,
  },
  {
    name: 'Num_Boleta',
    label: 'N° Guía',
    field: 'Num_Boleta',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ClienteNombre',
    label: 'Cliente',
    field: 'Cod_Cliente',
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
]

// --- WATCHERS ---
watch(
  () => filtros.value.rango,
  (val) => {
    if (!val) {
      filtros.value.rangoDisplay = ''
      return
    }
    if (typeof val === 'string') {
      filtros.value.rangoDisplay = val
    } else {
      filtros.value.rangoDisplay = `${val.from} - ${val.to}`
    }
  },
)

// --- COMPUTED: FILTRADO ---
const guiasFiltradas = computed(() => {
  return boletas.value.filter((b) => {
    // 1. Num Guia
    if (
      filtros.value.numGuia &&
      b.Num_Boleta &&
      !b.Num_Boleta.toLowerCase().includes(filtros.value.numGuia.toLowerCase())
    ) {
      return false
    }

    // 2. Identificacion (ID del empleado/usuario que registró)
    if (filtros.value.identificacion) {
      const ident = filtros.value.identificacion.toLowerCase()
      const matchEmpleado = b.Cod_empleado && b.Cod_empleado.toLowerCase().includes(ident)
      if (!matchEmpleado) return false
    }

    // 3. Nombre Cliente
    if (filtros.value.cliente) {
      const cliente = clientes.value.find((c) => String(c.id_cliente) == String(b.Cod_Cliente))
      const nombre = cliente?.nom_cliente.toLowerCase() || ''
      if (!nombre.includes(filtros.value.cliente.toLowerCase())) return false
    }

    // 4. Fecha Exacta
    if (filtros.value.fecha) {
      if (!b.Fecha.startsWith(filtros.value.fecha)) return false
    }

    // 5. Rango de Fechas
    if (filtros.value.rango) {
      const fechaBoletaStr = b.Fecha.substring(0, 10)
      let fromStr = ''
      let toStr = ''

      if (typeof filtros.value.rango === 'string') {
        fromStr = filtros.value.rango
        toStr = filtros.value.rango
      } else {
        fromStr = filtros.value.rango.from
        toStr = filtros.value.rango.to
      }

      if (fechaBoletaStr < fromStr || fechaBoletaStr > toStr) {
        return false
      }
    }

    return true
  })
})

// --- LIFECYCLE ---
onMounted(() => {
  void cargarDatos()
})

// --- METHODS ---
async function cargarDatos() {
  try {
    const [resBoletas, resClientes, resCertificados] = await Promise.all([
      axios.get<Boleta[]>(`${API}/boletas/top20`),
      axios.get<Cliente[]>(`${API}/clientes/listar`),
      axios.get<Certificado[]>(`${API}/certificado/certificados`),
    ])
    boletas.value = resBoletas.data
    clientes.value = resClientes.data
    certificados.value = resCertificados.data
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar datos',
    })
  }
}

function getNombreCliente(id: string | number) {
  const c = clientes.value.find((x) => String(x.id_cliente) == String(id))
  return c ? c.nom_cliente : '---'
}

function limpiarFiltros() {
  filtros.value = {
    numGuia: '',
    identificacion: '',
    cliente: '',
    fecha: '',
    rango: null,
    rangoDisplay: '',
  }
}

function tieneCertificado(numBoleta?: string) {
  if (!numBoleta) return false
  return certificados.value.some((c) => c.Num_Boleta === numBoleta)
}

// Selección de Boleta
function seleccionarBoleta(evt: Event, row: Boleta) {
  boletaSeleccionada.value = row
  guiaSeleccionada.value = null
  camposResultados.value = []
  valoresResultados.value = {}
  certificadoGenerado.value = null
  resultadosPorGuia.value = {} // Reset resultados por guía

  // Verificar si ya tiene certificado
  const certExistente = certificados.value.find((c) => c.Num_Boleta === row.Num_Boleta)
  if (certExistente && certExistente.id) {
    console.log('Certificado existente encontrado:', certExistente)
    certificadoGenerado.value = certExistente.id

    // Cargar los detalles del certificado existente
    void cargarResultadosParaTodasLasGuias().then(() => {
      void cargarValoresExistentes(certExistente.id!)
    })

    Notify.create({
      type: 'info',
      message: `Esta boleta ya tiene el certificado ${certExistente.codigo_certificado}. Modo edición activado.`,
      timeout: 3000,
    })
  }
}

async function cargarValoresExistentes(idCertificado: number) {
  try {
    const { data } = await axios.get(`${API}/certificado/certificados/${idCertificado}`)
    // data.detalles contiene los detalles
    // data.certificado contiene la info del certificado

    if (data.detalles && Array.isArray(data.detalles)) {
      const detalles = data.detalles as DetalleCertificado[]

      // Mapear los valores a resultadosPorGuia
      // Necesitamos saber a qué guía pertenece cada detalle.
      // Asumimos que id_resultado_config es único por configuración de precios.

      for (const guiaId in resultadosPorGuia.value) {
        const datosGuia = resultadosPorGuia.value[guiaId]
        if (!datosGuia || !datosGuia.campos) continue

        for (const campo of datosGuia.campos) {
          if (campo.id) {
            const detalle = detalles.find((d) => d.id_resultado_config === campo.id)
            if (detalle) {
              datosGuia.valores[campo.id] = detalle.valor_obtenido
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error cargando valores existentes:', error)
    Notify.create({
      type: 'warning',
      message: 'No se pudieron cargar los valores existentes del certificado',
    })
  }
}

async function generarCertificado() {
  if (!boletaSeleccionada.value) {
    Notify.create({
      type: 'warning',
      message: 'Seleccione una boleta primero',
    })
    return
  }

  if (!boletaSeleccionada.value.guias || boletaSeleccionada.value.guias.length === 0) {
    Notify.create({
      type: 'warning',
      message: 'La boleta seleccionada no tiene ensayos (guías) asociados.',
    })
    return
  }

  saving.value = true
  try {
    // Log de la boleta seleccionada para debug
    console.log('Boleta seleccionada completa:', JSON.stringify(boletaSeleccionada.value, null, 2))
    console.log('Número de guías asociadas:', boletaSeleccionada.value.guias?.length || 0)

    // Nuevo payload según ANALYSIS.md:
    // El backend ahora crea certificados automáticamente desde una boleta
    // y genera el código correlativo FRI-CER-año-XXXXXX automáticamente

    if (!authStore.user?.id || isNaN(Number(authStore.user.id))) {
      throw new Error('ID de usuario no válido. Por favor inicie sesión nuevamente.')
    }

    const payloadCert = {
      Num_Boleta: boletaSeleccionada.value.Num_Boleta, // String
      id_usuario: Number(authStore.user.id), // Asegurar que sea número
    }

    console.log('Payload para crear certificado (JSON):', JSON.stringify(payloadCert, null, 2))

    const resCert = await axios.post(`${API}/certificado/certificados`, payloadCert)

    // Log para debug
    console.log('Respuesta del servidor (completa):', JSON.stringify(resCert.data, null, 2))

    // Según ANALYSIS.md, la respuesta incluye:
    // { success: true, id_certificado: 15, codigo_certificado: "FRI-CER-2025-000001",
    //   cantidad_detalles: 3, num_guias_procesadas: 2, detalles_creados: 2 }
    const idCertificado = resCert.data.id_certificado
    const codigoCertificado = resCert.data.codigo_certificado

    console.log('ID del certificado:', idCertificado)
    console.log('Código generado:', codigoCertificado)

    if (!idCertificado || typeof idCertificado !== 'number') {
      console.error('Estructura de respuesta no reconocida:', JSON.stringify(resCert.data))
      throw new Error('No se obtuvo ID del certificado creado')
    }

    certificadoGenerado.value = idCertificado

    // Cargar campos de resultados para todas las guías
    await cargarResultadosParaTodasLasGuias()

    // El backend ya creó los detalles automáticamente según la respuesta
    // cantidad_detalles y detalles_creados indican cuántos se crearon
    console.log(`Detalles creados automáticamente: ${resCert.data.detalles_creados || 0}`)

    Notify.create({
      type: 'positive',
      message: `Certificado ${codigoCertificado} generado exitosamente con ${resCert.data.detalles_creados || 0} detalles. Ahora puede editar los valores.`,
      timeout: 4000,
    })
  } catch (error: unknown) {
    console.error('Error completo:', error)

    let errorMessage = 'Error al generar certificado'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number } }
      // Loguear la respuesta del error como string para que el usuario pueda copiarla
      console.error(
        'Respuesta del error (JSON):',
        JSON.stringify(axiosError.response?.data, null, 2),
      )
      console.error('Status del error:', axiosError.response?.status)

      // Intentar extraer el mensaje de error del backend
      const errorData = axiosError.response?.data
      if (errorData && typeof errorData === 'object') {
        const data = errorData as Record<string, unknown>

        // Manejo específico para error de duplicado (Boleta ya tiene certificado)
        if (
          data.db_error_code === 1062 ||
          (typeof data.db_error_message === 'string' &&
            data.db_error_message.includes('Duplicate entry'))
        ) {
          errorMessage = 'Esta boleta YA TIENE un certificado generado. No se puede crear otro.'
        } else if ('message' in data && typeof data.message === 'string') {
          errorMessage += ': ' + data.message
        } else if ('error' in data && typeof data.error === 'string') {
          errorMessage += ': ' + data.error
        } else {
          errorMessage += ': ' + JSON.stringify(errorData)
        }
      } else if (typeof errorData === 'string') {
        errorMessage += ': ' + errorData
      }
    }

    Notify.create({
      type: 'negative',
      message: errorMessage,
      timeout: 8000,
      html: true,
    })
  } finally {
    saving.value = false
  }
}

// Cargar campos de resultados para todas las guías de la boleta
async function cargarResultadosParaTodasLasGuias() {
  if (!boletaSeleccionada.value?.guias) return

  for (const guia of boletaSeleccionada.value.guias) {
    if (!guia.Co_Guia) continue

    const guiaId = guia.Co_Guia

    resultadosPorGuia.value[guiaId] = {
      loading: true,
      campos: [],
      valores: {},
    }

    try {
      const { data } = await axios.get<ResultadoConfiguracion[]>(
        `${API}/configuracion-precios/${guia.id_configuracion_precios}/resultados/visibles`,
      )
      resultadosPorGuia.value[guiaId].campos = data
      resultadosPorGuia.value[guiaId].loading = false
    } catch (error) {
      console.error(`Error cargando resultados para guía ${guiaId}:`, error)
      resultadosPorGuia.value[guiaId].loading = false
    }
  }
}

// Guardar/Actualizar los datos de los detalles del certificado
async function guardarDatos() {
  if (!certificadoGenerado.value || !boletaSeleccionada.value?.guias) return

  savingResultados.value = true
  try {
    // 1. Obtener todos los detalles existentes del certificado
    const { data: detallesExistentes } = await axios.get(
      `${API}/certificado/certificados/${certificadoGenerado.value}`,
    )

    console.log('Detalles existentes:', detallesExistentes)

    const actualizaciones: Promise<unknown>[] = []

    // 2. Actualizar cada detalle
    for (const guia of boletaSeleccionada.value.guias) {
      if (!guia.Co_Guia) continue

      const datosGuia = resultadosPorGuia.value[guia.Co_Guia]
      if (!datosGuia?.campos) continue

      for (const campo of datosGuia.campos) {
        if (campo.id) {
          const valorObtenido = Number(datosGuia.valores[campo.id]) || 0

          // Buscar el detalle existente por id_resultado_config
          const detalleExistente = detallesExistentes.detalles?.find(
            (d: DetalleCertificado) => d.id_resultado_config === campo.id,
          )

          if (detalleExistente && detalleExistente.id) {
            // Actualizar el detalle existente
            const updatePromise = axios.put(
              `${API}/certificado/certificado_detalle/${detalleExistente.id}`,
              { valor_obtenido: valorObtenido },
            )
            actualizaciones.push(updatePromise)
          }
        }
      }
    }

    if (actualizaciones.length > 0) {
      console.log(`Actualizando ${actualizaciones.length} detalles...`)
      await Promise.all(actualizaciones)
      console.log('Todos los detalles actualizados exitosamente')
    }

    Notify.create({
      type: 'positive',
      message: 'Datos guardados correctamente',
      icon: 'check_circle',
    })
  } catch (error: unknown) {
    console.error('Error completo:', error)

    let errorMessage = 'Error al guardar los datos'
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      console.error('Respuesta del error:', axiosError.response?.data)

      if (axiosError.response?.data?.message) {
        errorMessage += ': ' + axiosError.response.data.message
      } else if (axiosError.response?.data) {
        errorMessage += ': ' + JSON.stringify(axiosError.response.data)
      }
    }

    Notify.create({
      type: 'negative',
      message: errorMessage,
      timeout: 5000,
    })
  } finally {
    savingResultados.value = false
  }
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modern-table {
  width: 100%;
}
</style>
