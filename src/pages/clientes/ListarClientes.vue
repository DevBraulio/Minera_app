<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="account_circle" class="q-mr-sm" />
        Gestión de Clientes
      </h4>
      <q-btn
        unelevated
        rounded
        color="accent"
        icon="person_add"
        label="Registrar Cliente"
        @click="abrirCrear"
        class="btn-accent"
      />
    </div>

    <!-- TABLE CARD -->
    <div class="table-card">
      <div class="q-pa-md">
        <q-input dense filled v-model="filtro" placeholder="Buscar cliente..." class="input-modern">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon v-if="filtro" name="close" @click="filtro = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </div>

      <q-table
        :rows="clientesFiltrados"
        :columns="columnas"
        row-key="id_cliente"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="modern-table"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td>
            <!-- EDITAR -->
            <q-btn
              dense
              round
              flat
              color="primary"
              icon="edit"
              @click="abrirEditar(props.row)"
              class="q-mr-sm"
            >
              <q-tooltip>Editar cliente</q-tooltip>
            </q-btn>

            <!-- ELIMINAR -->
            <q-btn
              dense
              round
              flat
              color="negative"
              icon="delete"
              @click="eliminar(props.row.id_cliente)"
            >
              <q-tooltip>Eliminar cliente</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- DIALOG CREAR/EDITAR -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 600px" class="dialog-card">
        <q-card-section class="dialog-title">
          <div class="text-h6">
            <q-icon :name="editando ? 'edit' : 'person_add'" class="q-mr-sm" />
            {{ editando ? 'Editar Cliente' : 'Registrar Cliente' }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                filled
                v-model="form.nom_cliente"
                label="Nombre Completo"
                class="input-modern"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input filled v-model="form.ruc_cliente" label="RUC" class="input-modern">
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input filled v-model="form.tel_cliente" label="Teléfono" class="input-modern">
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input filled v-model="form.email" label="Email" type="email" class="input-modern">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input filled v-model="form.direccion" label="Dirección" class="input-modern">
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                filled
                v-model="form.observaciones"
                label="Observaciones"
                type="textarea"
                rows="3"
                class="input-modern"
              >
                <template v-slot:prepend>
                  <q-icon name="notes" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Guardar"
            color="accent"
            @click="guardar"
            :loading="loading"
            class="btn-accent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify, Dialog } from 'quasar'
import axios from 'axios'

const API = 'https://cifradosdev.com/certi_minera_backend/public'

interface Cliente {
  id_cliente?: number | undefined
  nom_cliente: string
  ruc_cliente: string
  tel_cliente: string
  email: string
  direccion?: string | undefined
  fech_ingreso?: string | undefined
  observaciones?: string | undefined
  estado?: number | undefined
}

const clientes = ref<Cliente[]>([])
const dialog = ref(false)
const loading = ref(false)
const editando = ref(false)
const filtro = ref('')

const form = ref<Cliente>({
  id_cliente: undefined,
  nom_cliente: '',
  ruc_cliente: '',
  tel_cliente: '',
  email: '',
  direccion: '',
  observaciones: '',
})

const columnas = [
  { name: 'id_cliente', label: 'ID', field: 'id_cliente', align: 'left' as const, sortable: true },
  {
    name: 'nom_cliente',
    label: 'Nombre',
    field: 'nom_cliente',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'ruc_cliente', label: 'RUC', field: 'ruc_cliente', align: 'left' as const },
  { name: 'tel_cliente', label: 'Teléfono', field: 'tel_cliente', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
]

const clientesFiltrados = computed(() => {
  if (!filtro.value) return clientes.value
  const txt = filtro.value.toLowerCase()
  return clientes.value.filter(
    (c) =>
      c.nom_cliente?.toLowerCase().includes(txt) ||
      c.ruc_cliente?.toLowerCase().includes(txt) ||
      c.email?.toLowerCase().includes(txt) ||
      c.tel_cliente?.toLowerCase().includes(txt),
  )
})

onMounted(() => {
  void listar()
})

// LISTAR
async function listar() {
  try {
    const { data } = await axios.get(`${API}/clientes/listar`)
    clientes.value = data
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar clientes',
    })
  }
}

// Abrir crear
function abrirCrear() {
  editando.value = false
  form.value = {
    id_cliente: undefined,
    nom_cliente: '',
    ruc_cliente: '',
    tel_cliente: '',
    email: '',
    direccion: '',
    observaciones: '',
  }
  dialog.value = true
}

// Abrir editar
function abrirEditar(cliente: Cliente) {
  editando.value = true
  form.value = {
    id_cliente: cliente.id_cliente,
    nom_cliente: cliente.nom_cliente,
    ruc_cliente: cliente.ruc_cliente,
    tel_cliente: cliente.tel_cliente,
    email: cliente.email,
    direccion: cliente.direccion || '',
    observaciones: cliente.observaciones || '',
  }
  dialog.value = true
}

// GUARDAR
async function guardar() {
  loading.value = true

  try {
    if (editando.value && form.value.id_cliente) {
      // actualizar
      await axios.put(`${API}/clientes/actualizar/${form.value.id_cliente}`, form.value)

      Notify.create({
        type: 'positive',
        message: 'Cliente actualizado correctamente',
      })
    } else {
      // registrar
      await axios.post(`${API}/clientes/guardar`, form.value)

      Notify.create({
        type: 'positive',
        message: 'Cliente registrado correctamente',
      })
    }

    dialog.value = false
    void listar()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    Notify.create({
      type: 'negative',
      message: 'Error al guardar',
      caption: err.response?.data?.message || 'Intenta nuevamente',
    })
  }

  loading.value = false
}

// ELIMINAR
function eliminar(id: number) {
  Dialog.create({
    title: 'Confirmar',
    message: '¿Eliminar cliente?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        await axios.delete(`${API}/clientes/eliminar/${id}`)
        Notify.create({
          type: 'positive',
          message: 'Cliente eliminado',
        })
        void listar()
      } catch {
        Notify.create({
          type: 'negative',
          message: 'Error al eliminar cliente',
        })
      }
    })()
  })
}
</script>

<style scoped lang="scss">
// Usar estilos globales de app.scss
</style>
