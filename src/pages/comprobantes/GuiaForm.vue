<template>
  <q-page class="q-pa-xl bg-grey-2">
    <q-card class="q-pa-xl shadow-10 bg-white" style="border-radius: 18px">
      <div class="text-h5 text-primary text-bold q-mb-lg">Registrar Boleta y Ensayos</div>

      <!-- ===================================================== -->
      <!--                  DATOS GENERALES BOLETA               -->
      <!-- ===================================================== -->
      <div class="row q-col-gutter-lg">
        <!-- FECHA -->
        <div class="col-3">
          <q-input filled type="date" v-model="boleta.Fecha" label="Fecha" />
        </div>

        <!-- CLIENTE -->
        <div class="col-4 row">
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

        <!-- EMPLEADO -->
        <div class="col-3">
          <q-input filled label="Empleado" v-model="boleta.Cod_empleado" readonly />
        </div>

        <!-- TIPO DOCUMENTO -->
        <div class="col-3">
          <q-select
            filled
            v-model="boleta.TIPO"
            :options="['Factura', 'Boleta', 'Guía']"
            label="Tipo Documento"
          />
        </div>

        <!-- ENVASE -->
        <div class="col-3">
          <q-select
            filled
            v-model="boleta.Envase"
            :options="['Envase 1', 'Envase 2', 'Envase 3']"
            label="Envase"
          />
        </div>

        <!-- ACUENTA -->
        <div class="col-3">
          <q-input
            filled
            type="number"
            v-model.number="boleta.Acuenta"
            label="Acuenta (Adelanto)"
            @update:model-value="calcularResta"
          />
        </div>

        <!-- RESTA -->
        <div class="col-3">
          <q-input filled readonly v-model.number="boleta.Resta" type="number" label="Resta" />
        </div>
      </div>

      <!-- ===================================================== -->
      <!--                       ENSAYOS                         -->
      <!-- ===================================================== -->

      <div class="text-h6 text-primary q-mt-xl q-mb-md">Ensayos</div>

      <div v-for="(ens, index) in ensayos" :key="index" class="q-mb-xl">
        <q-card class="q-pa-md bg-grey-1">
          <div class="row q-col-gutter-md">
            <!-- IDENTIFICACION -->
            <div class="col-4">
              <q-input filled v-model="ens.identificacion" label="Identificación de la muestra" />
            </div>

            <!-- TIPO MUESTRA -->
            <div class="col-4">
              <q-select
                filled
                v-model="ens.id_tipo_muestra"
                :options="tiposMuestra"
                option-label="tipo_muestra"
                option-value="id"
                label="Tipo de Muestra"
                emit-value
                map-options
                @update:model-value="cargarAnalisis(ens)"
              />
            </div>

            <!-- TIPO ANALISIS -->
            <div class="col-4">
              <q-select
                filled
                v-model="ens.id_analisis"
                :options="ens.analisisDisponibles"
                option-label="nombre_comercial"
                option-value="id"
                label="Tipo de Análisis"
                emit-value
                map-options
                @update:model-value="llenarDesdeConfiguracion(ens)"
              />
            </div>

            <!-- PRECIO -->
            <div class="col-12">
              <q-input filled readonly v-model="ens.Total" type="number" label="Precio (S/.)" />
            </div>
          </div>

          <div class="text-right q-mt-md">
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Quitar Ensayo"
              @click="eliminarEnsayo(index)"
            />
          </div>
        </q-card>
      </div>

      <!-- TOTAL GENERAL -->
      <q-card class="q-pa-md bg-primary text-white text-center q-mb-xl">
        <div class="text-h6">TOTAL ENSAYOS: S/ {{ totalEnsayos }}</div>
      </q-card>

      <q-btn
        color="secondary"
        icon="add"
        label="Agregar Ensayo"
        @click="agregarEnsayo"
        class="q-mb-xl"
      />

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
import axios from 'axios'
import { Notify } from 'quasar'

const API = 'https://cifradosdev.com/certi_minera_backend/public'

const loading = ref(false)

const modalCliente = ref(false)
const textoBuscar = ref('')
const clientesBusqueda = ref([])

const clientes = ref([])
const tiposMuestra = ref([])

const boleta = ref({
  Cod_Cliente: '',
  Cod_empleado: '2',
  Fecha: '',
  Total: 0,
  Acuenta: 0,
  Resta: 0,
  Envase: '',
  Can_muestras: 0,
  TIPO: 'Guía',
})

// RESTA
function calcularResta() {
  boleta.value.Resta = boleta.value.Total - (boleta.value.Acuenta || 0)
}

// =========================
// ENSAYOS
// =========================
const ensayos = ref([crearEnsayo()])

function crearEnsayo() {
  return {
    identificacion: '',
    id_tipo_muestra: null,
    id_analisis: null,
    analisisDisponibles: [],
    Total: 0,
    id_configuracion_precios: null,
  }
}

function agregarEnsayo() {
  ensayos.value.push(crearEnsayo())
}

function eliminarEnsayo(i) {
  ensayos.value.splice(i, 1)
}

const totalEnsayos = computed(() =>
  ensayos.value.reduce((sum, e) => sum + (parseFloat(e.Total) || 0), 0),
)

// =========================
// CARGAR DATOS
// =========================
onMounted(async () => {
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

function seleccionarCliente(c) {
  boleta.value.Cod_Cliente = c.id_cliente
  modalCliente.value = false
}

// =========================
// CARGAR ANALISIS
// =========================
async function cargarAnalisis(ens) {
  ens.analisisDisponibles = (
    await axios.get(`${API}/configuracion-precios/por-tipo-muestra`, {
      params: { muestra: ens.id_tipo_muestra },
    })
  ).data
  ens.id_analisis = null
  ens.Total = 0
}

// =========================
// LLENAR DATOS ANALISIS
// =========================
function llenarDesdeConfiguracion(ens) {
  const item = ens.analisisDisponibles.find((x) => x.id === ens.id_analisis)
  if (!item) return

  ens.id_configuracion_precios = item.id
  ens.Total = item.precio
}

// =========================
// GUARDAR BOLETA
// =========================
async function guardar() {
  try {
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

    const payload = {
      boleta: boleta.value,
      guias: ensayos.value,
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
    loading.value = false
    Notify.create({ type: 'negative', message: err.response?.data?.message || 'Error al guardar' })
  }
}
</script>
