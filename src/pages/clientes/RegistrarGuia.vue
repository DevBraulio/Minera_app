<template>
  <q-page class="page-container">
    <div class="row q-col-gutter-xl">
      <!-- ================== FORMULARIO DE GUÍA ====================== -->
      <div class="col-7">
        <q-card class="form-card">
          <div class="text-h6 text-primary text-bold">Registrar Guía</div>

          <div class="q-gutter-md q-mt-md">
            <!-- BOLETA -->
            <q-input filled v-model="form.Co_boleta" label="Número de Boleta" />

            <!-- CLIENTE -->
            <q-input
              filled
              readonly
              v-model="clienteSeleccionado"
              label="Cliente seleccionado"
              hint="Seleccione un cliente de la tabla de la derecha"
            />

            <q-input filled label="Identificación" v-model="form.identificacion" />
            <q-input filled label="Método" v-model="form.Metodo" />
            <q-input filled label="Elementos" v-model="form.Elementos" />
            <q-input filled label="Descripción" type="textarea" v-model="form.Descripcion" />

            <q-input filled type="number" step="0.01" label="Total" v-model.number="form.Total" />
            <q-input filled label="Marcha Analítica" v-model="form.MarchaAnalítica" />
            <q-input filled label="Método Verdad" v-model="form.MetodoVerdad" />
          </div>

          <!-- BOTONES -->
          <div class="row q-mt-lg justify-between">
            <q-btn flat color="primary" label="Limpiar" @click="resetear" />

            <q-btn
              color="primary"
              label="Guardar Guía"
              :loading="loading"
              @click="guardarGuia"
              style="border-radius: 10px"
            />
          </div>
        </q-card>
      </div>

      <!-- ================== LISTA DE CLIENTES ====================== -->
      <div class="col-5">
        <div class="table-card">
          <div class="q-pa-md">
            <div class="text-h6 text-primary text-bold q-mb-md">Lista de Clientes</div>

            <!-- BUSCADOR -->
            <q-input
              dense
              filled
              v-model="filtro"
              label="Buscar cliente..."
              @input="filtrarClientes"
              prepend-icon="search"
              clearable
            />
          </div>

          <!-- TABLA -->
          <q-table
            class="q-mt-md bg-white"
            :loading="loadingTabla"
            :rows="clientesFiltrados"
            :columns="columnas"
            row-key="id_cliente"
            flat
            bordered
            separator="cell"
            :rows-per-page-options="[10, 20, 50]"
          >
            <template v-slot:loading>
              <q-inner-loading showing>
                <q-spinner color="primary" size="40px" />
              </q-inner-loading>
            </template>

            <template v-slot:body-cell-acciones="props">
              <q-td class="text-center">
                <!-- SELECCIONAR CLIENTE -->
                <q-btn
                  dense
                  round
                  color="green"
                  icon="check"
                  @click="seleccionarCliente(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'

const API = 'https://cifradosdev.com/certi_minera_backend/public'

// ============ ESTADOS ============
const loading = ref(false)
const loadingTabla = ref(false)

// Buscador
const filtro = ref('')

interface Cliente {
  id_cliente: string
  nom_cliente: string
  ruc_cliente: string
  telefono: string
  direccion: string
  email: string
}

// Lista clientes
const clientes = ref<Cliente[]>([])
const clientesFiltrados = ref<Cliente[]>([])

// Nombre mostrado del cliente
const clienteSeleccionado = ref('')

// ============ FORMULARIO GUÍA ============
const form = ref({
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

// ================== COLUMNAS CLIENTE ==================
const columnas = [
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
  { name: 'id_cliente', label: 'ID', field: 'id_cliente', align: 'left' as const, sortable: true },
  {
    name: 'nom_cliente',
    label: 'Nombre',
    field: 'nom_cliente',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'ruc_cliente', label: 'RUC', field: 'ruc_cliente', align: 'left' as const },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' as const },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
]

// ================== CARGAR CLIENTES ==================
onMounted(() => {
  void listarClientes()
})

async function listarClientes() {
  loadingTabla.value = true
  try {
    const { data } = await axios.get(`${API}/clientes/listar`)
    clientes.value = data
    clientesFiltrados.value = data
  } catch {
    Notify.create({ type: 'negative', message: 'Error al cargar clientes' })
  }
  loadingTabla.value = false
}

// ================== FILTRAR ==================
function filtrarClientes() {
  const txt = filtro.value.toLowerCase()
  clientesFiltrados.value = clientes.value.filter((c) =>
    (c.nom_cliente || '').toLowerCase().includes(txt),
  )
}

// ================== SELECCIONAR CLIENTE ==================
function seleccionarCliente(cli: Cliente) {
  clienteSeleccionado.value = cli.nom_cliente
  form.value.Cod_cliente = cli.id_cliente // IMPORTANTE
  Notify.create({
    type: 'positive',
    message: 'Cliente seleccionado correctamente',
  })
}

// ================== RESET ==================
function resetear() {
  clienteSeleccionado.value = ''
  form.value = {
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

// ================== GUARDAR GUÍA ==================
async function guardarGuia() {
  loading.value = true
  try {
    await axios.post(`${API}/guias`, form.value)
    Notify.create({ type: 'positive', message: 'Guía registrada' })
    resetear()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    Notify.create({
      type: 'negative',
      message: 'Error al guardar guía',
      caption: err.response?.data?.message,
    })
  }
  loading.value = false
}
</script>

<style></style>
