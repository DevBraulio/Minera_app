<template>
  <q-page class="page-container">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="tune" class="q-mr-sm" />
        Panel de Configuración
      </h4>
      <div class="text-caption text-grey-7">
        Gestiona tipos de muestra, elementos y métodos de análisis
      </div>
    </div>

    <!-- ACTION BUTTONS -->
    <div class="action-buttons">
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add"
        label="Nuevo Tipo de Muestra"
        @click="abrirDialogTipoMuestra"
        class="btn-action"
      />
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add"
        label="Nuevo Elemento"
        @click="abrirDialogElemento"
        class="btn-action"
      />
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="add"
        label="Nuevo Método"
        @click="abrirDialogMarcha"
        class="btn-action"
      />
    </div>

    <!-- UNIFIED TABLE WITH TABS -->
    <div class="table-card">
      <q-tabs
        v-model="tabActual"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="accent"
        align="left"
      >
        <q-tab name="tiposMuestra" icon="biotech" label="Tipos de Muestra" />
        <q-tab name="elementos" icon="category" label="Elementos" />
        <q-tab name="metodos" icon="precision_manufacturing" label="Métodos" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tabActual" animated>
        <!-- TAB: TIPOS DE MUESTRA -->
        <q-tab-panel name="tiposMuestra">
          <q-table
            :rows="tiposMuestra"
            :columns="colTipoMuestra"
            dense
            flat
            row-key="id"
            :rows-per-page-options="[10, 20, 50]"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-acciones="props">
              <q-td class="text-center">
                <q-btn
                  size="sm"
                  round
                  flat
                  icon="edit"
                  color="primary"
                  @click="editarTipoMuestra(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  round
                  flat
                  icon="delete"
                  color="negative"
                  @click="confirmarEliminarTipoMuestra(props.row.id)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- TAB: ELEMENTOS -->
        <q-tab-panel name="elementos">
          <q-table
            :rows="elementos"
            :columns="colElemento"
            dense
            flat
            row-key="id"
            :rows-per-page-options="[10, 20, 50]"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-acciones="props">
              <q-td class="text-center">
                <q-btn
                  size="sm"
                  round
                  flat
                  icon="edit"
                  color="primary"
                  @click="editarElemento(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  round
                  flat
                  icon="delete"
                  color="negative"
                  @click="confirmarEliminarElemento(props.row.id)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- TAB: MÉTODOS -->
        <q-tab-panel name="metodos">
          <q-table
            :rows="marchas"
            :columns="colMarcha"
            dense
            flat
            row-key="id"
            :rows-per-page-options="[10, 20, 50]"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-acciones="props">
              <q-td class="text-center">
                <q-btn
                  size="sm"
                  round
                  flat
                  icon="edit"
                  color="primary"
                  @click="editarMarchaMetodo(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  round
                  flat
                  icon="delete"
                  color="negative"
                  @click="confirmarEliminarMarcha(props.row.id)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- DIALOG: TIPO MUESTRA -->
    <q-dialog v-model="dialogTipoMuestra" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-title">
          <div class="text-h6">
            <q-icon name="biotech" class="q-mr-sm" />
            {{ tipoMuestraForm.id ? 'Actualizar Tipo de Muestra' : 'Nuevo Tipo de Muestra' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="tipoMuestraForm.tipo_muestra"
            label="Nombre del tipo de muestra"
            class="input-modern"
            :rules="[(val) => !!val || 'Campo requerido']"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="science" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" @click="cerrarDialogTipoMuestra" />
          <q-btn
            unelevated
            :label="tipoMuestraForm.id ? 'Actualizar' : 'Guardar'"
            :color="tipoMuestraForm.id ? 'warning' : 'accent'"
            @click="guardarTipoMuestra"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG: ELEMENTO -->
    <q-dialog v-model="dialogElemento" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-title">
          <div class="text-h6">
            <q-icon name="category" class="q-mr-sm" />
            {{ elementoForm.id ? 'Actualizar Elemento' : 'Nuevo Elemento' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="elementoForm.tipo_elemento"
            label="Nombre del elemento"
            class="input-modern"
            :rules="[(val) => !!val || 'Campo requerido']"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="auto_awesome" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" @click="cerrarDialogElemento" />
          <q-btn
            unelevated
            :label="elementoForm.id ? 'Actualizar' : 'Guardar'"
            :color="elementoForm.id ? 'warning' : 'accent'"
            @click="guardarElemento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOG: MARCHA-MÉTODO -->
    <q-dialog v-model="dialogMarcha" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-title">
          <div class="text-h6">
            <q-icon name="precision_manufacturing" class="q-mr-sm" />
            {{ marchaForm.id ? 'Actualizar Método' : 'Nuevo Método' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="marchaForm.metodo"
            label="Nombre del método"
            class="input-modern"
            :rules="[(val) => !!val || 'Campo requerido']"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="engineering" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" @click="cerrarDialogMarcha" />
          <q-btn
            unelevated
            :label="marchaForm.id ? 'Actualizar' : 'Guardar'"
            :color="marchaForm.id ? 'warning' : 'accent'"
            @click="guardarMarchaMetodo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify, Dialog } from 'quasar'
import type { TipoMuestra, Elemento, MarchaMetodo } from '../../interfaces'

defineOptions({
  name: 'PagePanelConfiguracion',
})

const API = 'https://cifradosdev.com/certi_minera_backend/public'

// ============================
//     DIALOG CONTROLS
// ============================
const dialogTipoMuestra = ref(false)
const dialogElemento = ref(false)
const dialogMarcha = ref(false)
const tabActual = ref('tiposMuestra')

// ============================
//     FORM REFS
// ============================
const tipoMuestraForm = ref<{ id: number | null; tipo_muestra: string }>({
  id: null,
  tipo_muestra: '',
})
const elementoForm = ref<{ id: number | null; tipo_elemento: string }>({
  id: null,
  tipo_elemento: '',
})
const marchaForm = ref<{ id: number | null; metodo: string }>({ id: null, metodo: '' })

/* ============================
          LISTAS
  ============================ */
const tiposMuestra = ref<TipoMuestra[]>([])
const elementos = ref<Elemento[]>([])
const marchas = ref<MarchaMetodo[]>([])

/* ============================
          COLUMNAS
  ============================ */
const colTipoMuestra = [
  { name: 'tipo_muestra', label: 'Tipo', field: 'tipo_muestra', align: 'left' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
]

const colElemento = [
  { name: 'tipo_elemento', label: 'Elemento', field: 'tipo_elemento', align: 'left' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
]

const colMarcha = [
  { name: 'metodo', label: 'Método', field: 'metodo', align: 'left' as const },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' as const },
]

/* ============================
   DIALOG OPEN/CLOSE FUNCTIONS
  ============================ */
function abrirDialogTipoMuestra() {
  tipoMuestraForm.value = { id: null, tipo_muestra: '' }
  dialogTipoMuestra.value = true
}

function cerrarDialogTipoMuestra() {
  tipoMuestraForm.value = { id: null, tipo_muestra: '' }
  dialogTipoMuestra.value = false
}

function abrirDialogElemento() {
  elementoForm.value = { id: null, tipo_elemento: '' }
  dialogElemento.value = true
}

function cerrarDialogElemento() {
  elementoForm.value = { id: null, tipo_elemento: '' }
  dialogElemento.value = false
}

function abrirDialogMarcha() {
  marchaForm.value = { id: null, metodo: '' }
  dialogMarcha.value = true
}

function cerrarDialogMarcha() {
  marchaForm.value = { id: null, metodo: '' }
  dialogMarcha.value = false
}

/* ============================
     TIPO MUESTRA (CRUD)
  ============================ */
async function cargarTiposMuestra() {
  tiposMuestra.value = (await axios.get(`${API}/tipo-muestra`)).data
}
async function guardarTipoMuestra() {
  if (!tipoMuestraForm.value.tipo_muestra.trim()) {
    Notify.create({ type: 'warning', message: 'El campo es requerido' })
    return
  }
  if (tipoMuestraForm.value.id) {
    await axios.put(`${API}/tipo-muestra/${tipoMuestraForm.value.id}`, tipoMuestraForm.value)
    Notify.create({ type: 'positive', message: 'Actualizado correctamente' })
  } else {
    await axios.post(`${API}/tipo-muestra`, tipoMuestraForm.value)
    Notify.create({ type: 'positive', message: 'Registrado correctamente' })
  }
  cerrarDialogTipoMuestra()
  void cargarTiposMuestra()
}
function editarTipoMuestra(row: TipoMuestra) {
  tipoMuestraForm.value = {
    id: row.id ?? null,
    tipo_muestra: row.tipo_muestra,
  }
  dialogTipoMuestra.value = true
}
function confirmarEliminarTipoMuestra(id: number) {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de eliminar este tipo de muestra?',
    cancel: { label: 'Cancelar', color: 'grey-7', flat: true },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
  }).onOk(() => {
    void (async () => {
      await axios.delete(`${API}/tipo-muestra/${id}`)
      Notify.create({ type: 'negative', message: 'Eliminado correctamente' })
      void cargarTiposMuestra()
    })()
  })
}

/* ============================
          ELEMENTO (CRUD)
  ============================ */
async function cargarElementos() {
  elementos.value = (await axios.get(`${API}/elemento`)).data
}
async function guardarElemento() {
  if (!elementoForm.value.tipo_elemento.trim()) {
    Notify.create({ type: 'warning', message: 'El campo es requerido' })
    return
  }
  if (elementoForm.value.id) {
    await axios.put(`${API}/elemento/${elementoForm.value.id}`, elementoForm.value)
    Notify.create({ type: 'positive', message: 'Actualizado correctamente' })
  } else {
    await axios.post(`${API}/elemento`, elementoForm.value)
    Notify.create({ type: 'positive', message: 'Registrado correctamente' })
  }
  cerrarDialogElemento()
  void cargarElementos()
}
function editarElemento(row: Elemento) {
  elementoForm.value = {
    id: row.id ?? null,
    tipo_elemento: row.tipo_elemento,
  }
  dialogElemento.value = true
}
function confirmarEliminarElemento(id: number) {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de eliminar este elemento?',
    cancel: { label: 'Cancelar', color: 'grey-7', flat: true },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
  }).onOk(() => {
    void (async () => {
      await axios.delete(`${API}/elemento/${id}`)
      Notify.create({ type: 'negative', message: 'Eliminado correctamente' })
      void cargarElementos()
    })()
  })
}

/* ============================
      MARCHA MÉTODO (CRUD)
  ============================ */
async function cargarMarchas() {
  marchas.value = (await axios.get(`${API}/marcha-metodo`)).data
}
async function guardarMarchaMetodo() {
  if (!marchaForm.value.metodo.trim()) {
    Notify.create({ type: 'warning', message: 'El campo es requerido' })
    return
  }
  if (marchaForm.value.id) {
    await axios.put(`${API}/marcha-metodo/${marchaForm.value.id}`, marchaForm.value)
    Notify.create({ type: 'positive', message: 'Actualizado correctamente' })
  } else {
    await axios.post(`${API}/marcha-metodo`, marchaForm.value)
    Notify.create({ type: 'positive', message: 'Registrado correctamente' })
  }
  cerrarDialogMarcha()
  void cargarMarchas()
}
function editarMarchaMetodo(row: MarchaMetodo) {
  marchaForm.value = {
    id: row.id ?? null,
    metodo: row.metodo,
  }
  dialogMarcha.value = true
}
function confirmarEliminarMarcha(id: number) {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de eliminar este método?',
    cancel: { label: 'Cancelar', color: 'grey-7', flat: true },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
  }).onOk(() => {
    void (async () => {
      await axios.delete(`${API}/marcha-metodo/${id}`)
      Notify.create({ type: 'negative', message: 'Eliminado correctamente' })
      void cargarMarchas()
    })()
  })
}

onMounted(() => {
  void cargarTiposMuestra()
  void cargarElementos()
  void cargarMarchas()
})
</script>

<style scoped lang="scss">
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  .btn-action {
    font-weight: 500;
    padding: 0.5rem 1.5rem;
  }
}

.dialog-card {
  min-width: 500px;
  max-width: 600px;
}

.dialog-title {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: var(--text-on-primary);

  .text-h6 {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
}

// Tab styles
:deep(.q-tabs) {
  .q-tab {
    color: var(--text-secondary);
    font-weight: 500;

    &--active {
      color: var(--primary);
      font-weight: 600;
    }
  }

  .q-tab__indicator {
    background-color: var(--accent);
    height: 3px;
  }
}

// Table improvements
:deep(.q-table) {
  thead tr th {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--text-on-primary);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }

  tbody tr {
    transition: background-color 150ms ease-in-out;

    &:hover {
      background-color: var(--surface-variant);
    }

    &:nth-child(even) {
      background-color: rgba(236, 240, 241, 0.3);
    }
  }
}
</style>
