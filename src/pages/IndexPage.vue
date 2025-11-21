<template>
  <q-page class="page-container">
    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h4 class="text-h4 q-mb-sm">
          <q-icon name="dashboard" class="q-mr-sm" />
          Dashboard - Sistema Minera
        </h4>
        <p class="text-subtitle1 text-grey-7">Bienvenido al sistema de gestión</p>
      </div>
      <div class="text-right">
        <div class="text-h6">{{ fechaActual }}</div>
        <div class="text-caption text-grey-7">{{ horaActual }}</div>
      </div>
    </div>

    <!-- STATISTICS CARDS -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card stat-card-clients">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="stat-label">Clientes</div>
                <div class="stat-value">{{ stats.clientes }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="account_circle" size="48px" class="stat-icon" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card stat-card-users">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="stat-label">Usuarios</div>
                <div class="stat-value">{{ stats.usuarios }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="group" size="48px" class="stat-icon" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card stat-card-configs">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="stat-label">Configuraciones</div>
                <div class="stat-value">{{ stats.configuraciones }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="settings" size="48px" class="stat-icon" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card stat-card-samples">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="stat-label">Tipos de Muestra</div>
                <div class="stat-value">{{ stats.tiposMuestra }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="biotech" size="48px" class="stat-icon" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="bar_chart" class="q-mr-sm" />
              Configuraciones por Tipo de Muestra
            </div>
            <apexchart
              v-if="
                chartConfigsByType.series.length > 0 &&
                (chartConfigsByType.series[0]?.data?.length ?? 0) > 0
              "
              type="bar"
              :options="chartConfigsByType.options"
              :series="chartConfigsByType.series"
              height="300"
            />
            <div v-else class="text-center text-grey-6 q-py-xl">
              <q-icon name="info" size="48px" />
              <div class="q-mt-md">No hay datos disponibles</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="pie_chart" class="q-mr-sm" />
              Distribución de Elementos
            </div>
            <apexchart
              v-if="chartElementDistribution.series.length > 0"
              type="pie"
              :options="chartElementDistribution.options"
              :series="chartElementDistribution.series"
              height="300"
            />
            <div v-else class="text-center text-grey-6 q-py-xl">
              <q-icon name="info" size="48px" />
              <div class="q-mt-md">No hay datos disponibles</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- RECENT ACTIVITY -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="activity-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="history" class="q-mr-sm" />
              Últimos Clientes Registrados
            </div>
            <q-list separator>
              <q-item v-for="cliente in ultimosClientes" :key="cliente.id_cliente || 0">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ cliente.nom_cliente }}</q-item-label>
                  <q-item-label caption>RUC: {{ cliente.ruc_cliente }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-5" />
                </q-item-section>
              </q-item>
              <q-item v-if="ultimosClientes.length === 0">
                <q-item-section class="text-center text-grey-6">
                  No hay clientes registrados
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="activity-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="settings_suggest" class="q-mr-sm" />
              Últimas Configuraciones
            </div>
            <q-list separator>
              <q-item v-for="config in ultimasConfiguraciones" :key="config.id_configuracion || 0">
                <q-item-section avatar>
                  <q-avatar color="accent" text-color="white" icon="tune" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ config.nombre_comercial }}</q-item-label>
                  <q-item-label caption>Precio: S/ {{ config.precio }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-5" />
                </q-item-section>
              </q-item>
              <q-item v-if="ultimasConfiguraciones.length === 0">
                <q-item-section class="text-center text-grey-6">
                  No hay configuraciones registradas
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const API = 'https://cifradosdev.com/certi_minera_backend/public'

// Estados
const stats = ref({
  clientes: 0,
  usuarios: 0,
  configuraciones: 0,
  tiposMuestra: 0,
})

const ultimosClientes = ref<
  Array<{
    id_cliente?: number
    nom_cliente: string
    ruc_cliente: string
    [key: string]: unknown
  }>
>([])
const ultimasConfiguraciones = ref<
  Array<{
    id_configuracion?: number
    nombre_comercial: string
    precio: number
    [key: string]: unknown
  }>
>([])
const tiposMuestra = ref<
  Array<{
    id_tipo_muestra?: number
    tipo_muestra: string
    [key: string]: unknown
  }>
>([])
const elementos = ref<
  Array<{
    id_elemento?: number
    tipo_elemento: string
    [key: string]: unknown
  }>
>([])
const configuraciones = ref<
  Array<{
    id_configuracion?: number
    id_tipo_muestra?: number
    id_elemento?: number
    [key: string]: unknown
  }>
>([])

// Fecha y hora
const fechaActual = ref('')
const horaActual = ref('')

// Gráfico de Barras: Configuraciones por Tipo de Muestra
const chartConfigsByType = computed(() => ({
  options: {
    chart: {
      id: 'configs-by-type',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#f39c12'],
    xaxis: {
      categories: tiposMuestra.value.map((t) => t.tipo_muestra || 'Sin nombre'),
    },
    yaxis: {
      title: {
        text: 'Cantidad de Configuraciones',
      },
    },
    grid: {
      borderColor: '#e0e0e0',
    },
  },
  series: [
    {
      name: 'Configuraciones',
      data: tiposMuestra.value.map((tipo) => {
        return configuraciones.value.filter((c) => c.id_tipo_muestra === tipo.id_tipo_muestra)
          .length
      }),
    },
  ],
}))

// Gráfico de Pastel: Distribución de Elementos
const chartElementDistribution = computed(() => ({
  options: {
    chart: {
      id: 'element-distribution',
    },
    labels: elementos.value.map((e) => e.tipo_elemento || 'Sin nombre'),
    colors: ['#2c3e50', '#f39c12', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6'],
    legend: {
      position: 'bottom' as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom' as const,
          },
        },
      },
    ],
  },
  series: elementos.value.map((elemento) => {
    return configuraciones.value.filter((c) => c.id_elemento === elemento.id_elemento).length
  }),
}))

onMounted(() => {
  actualizarFechaHora()
  setInterval(actualizarFechaHora, 1000)
  void cargarDatos()
})

function actualizarFechaHora() {
  const now = new Date()
  fechaActual.value = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  horaActual.value = now.toLocaleTimeString('es-ES')
}

async function cargarDatos() {
  try {
    // Cargar clientes
    const { data: clientesData } = await axios.get(`${API}/clientes/listar`)
    stats.value.clientes = clientesData.length
    ultimosClientes.value = clientesData.slice(-5).reverse()

    // Cargar usuarios
    const { data: usuariosData } = await axios.get(`${API}/usuarios/listar`)
    stats.value.usuarios = usuariosData.length

    // Cargar configuraciones
    const { data: configuracionesData } = await axios.get(`${API}/configuracion-precios`)
    stats.value.configuraciones = configuracionesData.length
    configuraciones.value = configuracionesData
    ultimasConfiguraciones.value = configuracionesData.slice(-5).reverse()

    // Cargar tipos de muestra
    const { data: tiposMuestraData } = await axios.get(`${API}/tipo-muestra`)
    stats.value.tiposMuestra = tiposMuestraData.length
    tiposMuestra.value = tiposMuestraData

    // Cargar elementos
    const { data: elementosData } = await axios.get(`${API}/elemento`)
    elementos.value = elementosData
  } catch (error) {
    console.error('Error al cargar datos:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar datos del dashboard',
    })
  }
}
</script>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid var(--primary);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &.stat-card-clients {
    border-left-color: #3498db;
  }

  &.stat-card-users {
    border-left-color: #2ecc71;
  }

  &.stat-card-configs {
    border-left-color: #f39c12;
  }

  &.stat-card-samples {
    border-left-color: #9b59b6;
  }
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: var(--spacing-xs);
}

.stat-icon {
  opacity: 0.2;
}

.chart-card,
.activity-card {
  height: 100%;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--shadow-lg);
  }
}
</style>
