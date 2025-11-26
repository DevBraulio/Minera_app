<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="verified_user" class="q-mr-sm" />
        Listado de Certificados
      </h4>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add"
        label="Nuevo Certificado"
        to="/certificados/crear"
        class="btn-accent"
      />
    </div>

    <!-- TABLE CARD -->
    <div class="table-card">
      <div class="q-pa-md">
        <q-input
          dense
          filled
          v-model="filtro"
          placeholder="Buscar certificado..."
          class="input-modern"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon v-if="filtro" name="close" @click="filtro = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </div>

      <q-table
        :rows="certificadosFiltrados"
        :columns="columnas"
        row-key="id"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="modern-table cursor-pointer"
        @row-click="verDetalle"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click.stop="verDetalle(null, props.row)"
            >
              <q-tooltip>Ver Detalles</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- DIALOG DETALLE -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">
            <q-icon name="verified" class="q-mr-sm" />
            Certificado: {{ certificadoSeleccionado?.codigo_certificado }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-white" />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <!-- INFO GENERAL -->
            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Código Guía</q-item-label>
                  <q-item-label class="text-subtitle1">{{
                    certificadoSeleccionado?.co_guia
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>ID Configuración</q-item-label>
                  <q-item-label class="text-subtitle1">{{
                    certificadoSeleccionado?.id_configuracion
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- RESULTADOS (DETALLES) -->
          <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
            Resultados del Análisis
          </div>

          <div v-if="loadingDetalles" class="row justify-center">
            <q-spinner color="primary" size="2em" />
          </div>
          <div v-else-if="detallesCertificado.length > 0">
            <q-list bordered separator>
              <q-item v-for="(det, index) in detallesCertificado" :key="det.id || index">
                <q-item-section>
                  <q-item-label>Resultado ID: {{ det.id_resultado_config }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold text-primary">
                    {{ det.valor_obtenido }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else class="text-grey text-center q-pa-sm">
            No se encontraron detalles para este certificado.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn unelevated color="accent" icon="print" label="Imprimir" @click="imprimir" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import type { QTableProps } from 'quasar'
import type { Certificado, DetalleCertificado } from 'src/interfaces'

const API = 'https://cifradosdev.com/certi_minera_backend/public'

// --- ESTADOS ---
const certificados = ref<Certificado[]>([])
const filtro = ref('')
const showDialog = ref(false)
const certificadoSeleccionado = ref<Certificado | null>(null)
const detallesCertificado = ref<DetalleCertificado[]>([])
const loadingDetalles = ref(false)

// --- COLUMNAS ---
const columnas: QTableProps['columns'] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  {
    name: 'codigo_certificado',
    label: 'Código',
    field: 'codigo_certificado',
    align: 'left',
    sortable: true,
  },
  { name: 'co_guia', label: 'Guía Asociada', field: 'co_guia', align: 'left', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

// --- COMPUTED ---
const certificadosFiltrados = computed(() => {
  if (!filtro.value) return certificados.value
  const txt = filtro.value.toLowerCase()
  return certificados.value.filter(
    (c) => c.codigo_certificado.toLowerCase().includes(txt) || String(c.co_guia).includes(txt),
  )
})

// --- LIFECYCLE ---
onMounted(() => {
  void listarCertificados()
})

// --- METHODS ---
async function listarCertificados() {
  try {
    const { data } = await axios.get<Certificado[]>(`${API}/certificado/certificados`)
    certificados.value = data
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar certificados',
    })
  }
}

async function verDetalle(_: unknown, row: Certificado) {
  certificadoSeleccionado.value = row
  showDialog.value = true
  await cargarDetalles(row.id!)
}

async function cargarDetalles(idCertificado: number) {
  loadingDetalles.value = true
  detallesCertificado.value = []
  try {
    // NOTA: La API documentada no tiene un endpoint directo para filtrar detalles por ID de certificado.
    // Intentaremos obtener todos y filtrar en cliente, o usar un endpoint si existiera.
    // Asumiremos por ahora que debemos traer todos. Esto NO es óptimo para producción con muchos datos.
    // TODO: Solicitar endpoint backend: GET /certificado/certificados/{id}/detalles

    const { data } = await axios.get<DetalleCertificado[]>(`${API}/certificado/certificado_detalle`)
    detallesCertificado.value = data.filter((d) => d.id_certificado === idCertificado)
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'warning',
      message: 'No se pudieron cargar los detalles',
    })
  } finally {
    loadingDetalles.value = false
  }
}

function imprimir() {
  Notify.create({
    type: 'info',
    message: 'Función de imprimir en desarrollo',
  })
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
