<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="group" class="q-mr-sm" />
        Gestión de Usuarios
      </h4>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="person_add"
        label="Registrar Usuario"
        @click="abrirCrear"
        class="btn-primary"
      />
    </div>

    <!-- TABLE CARD -->
    <div class="table-card">
      <q-table
        :rows="usuarios"
        :columns="columnas"
        row-key="id"
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
              <q-tooltip>Editar usuario</q-tooltip>
            </q-btn>

            <!-- ELIMINAR -->
            <q-btn dense round flat color="negative" icon="delete" @click="eliminar(props.row.id)">
              <q-tooltip>Eliminar usuario</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- DIALOG CREAR/EDITAR -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 600px" class="form-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon :name="editando ? 'edit' : 'person_add'" class="q-mr-sm" />
            {{ editando ? 'Editar Usuario' : 'Registrar Usuario' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                filled
                v-model="form.nombre"
                label="Nombre Completo"
                class="input-modern"
                :rules="[(val) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="form.usuario"
                label="Usuario"
                class="input-modern"
                :rules="[(val) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="form.contraseña"
                label="Contraseña"
                type="password"
                class="input-modern"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-select
                filled
                v-model="form.cargo"
                :options="opcionesCargo"
                label="Cargo"
                class="input-modern"
                :rules="[(val) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="work" />
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Guardar"
            color="primary"
            @click="guardar"
            :loading="loading"
            class="btn-primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Notify, Dialog } from 'quasar'
import axios from 'axios'
import type { Usuario } from '../../interfaces'

const API = 'https://cifradosdev.com/certi_minera_backend/public'

const usuarios = ref<Usuario[]>([])
const dialog = ref(false)
const loading = ref(false)
const editando = ref(false)

const form = ref<{
  id: number | null
  nombre: string
  usuario: string
  contraseña: string
  cargo: string
  activo: string
}>({
  id: null,
  nombre: '',
  usuario: '',
  contraseña: '',
  cargo: '',
  activo: '1',
})

const columnas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' as const },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' as const },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
]

const opcionesCargo = [
  'Administrador',
  'Gerente',
  'Supervisor',
  'Analista',
  'Técnico de Laboratorio',
  'Asistente',
  'Recepcionista',
]

onMounted(() => {
  void listar()
})

// LISTAR
async function listar() {
  try {
    const { data } = await axios.get(`${API}/usuarios/listar`)
    usuarios.value = data
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar usuarios',
    })
  }
}

// Abrir crear
function abrirCrear() {
  editando.value = false
  form.value = {
    id: null,
    nombre: '',
    usuario: '',
    contraseña: '',
    cargo: '',
    activo: '1',
  }
  dialog.value = true
}

// Abrir editar
function abrirEditar(usuario: Usuario) {
  editando.value = true
  form.value = {
    id: usuario.id ?? null,
    nombre: usuario.nombre,
    usuario: usuario.usuario,
    contraseña: '',
    cargo: usuario.cargo,
    activo: '1',
  }
  dialog.value = true
}

// GUARDAR
async function guardar() {
  loading.value = true

  try {
    if (editando.value) {
      // actualizar
      await axios.put(`${API}/usuarios/actualizar/${form.value.id}`, form.value)

      Notify.create({
        type: 'positive',
        message: 'Usuario actualizado correctamente',
      })
    } else {
      // registrar
      await axios.post(`${API}/usuarios/registrar`, form.value)

      Notify.create({
        type: 'positive',
        message: 'Usuario registrado correctamente',
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
    message: '¿Eliminar usuario?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        await axios.delete(`${API}/usuarios/eliminar/${id}`)
        Notify.create({
          type: 'positive',
          message: 'Usuario eliminado',
        })
        void listar()
      } catch {
        Notify.create({
          type: 'negative',
          message: 'Error al eliminar usuario',
        })
      }
    })()
  })
}
</script>
