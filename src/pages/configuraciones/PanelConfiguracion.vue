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

    <!-- 3-COLUMN LAYOUT -->
    <div class="row q-col-gutter-md">
      <!-- COLUMN 1: TIPOS DE MUESTRA -->
      <div class="col-12 col-md-4">
        <!-- CARD 1: FORMULARIO -->
        <q-card class="column-card q-mb-md">
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="biotech" class="q-mr-sm" />
              Tipos de Muestra
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-input
                  filled
                  dense
                  v-model="tipoMuestraForm.tipo_muestra"
                  label="Nombre"
                  class="input-modern"
                  @keyup.enter="guardarTipoMuestra"
                />
              </div>
              <div class="col-auto">
                <q-btn round dense flat icon="check" color="primary" @click="guardarTipoMuestra">
                  <q-tooltip>{{ tipoMuestraForm.id ? 'Actualizar' : 'Guardar' }}</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="tipoMuestraForm.id || tipoMuestraForm.tipo_muestra"
                  round
                  dense
                  flat
                  icon="close"
                  color="grey-7"
                  @click="cancelarTipoMuestra"
                >
                  <q-tooltip>Cancelar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- CARD 2: TABLA -->
        <q-card class="column-card">
          <q-card-section class="q-pa-none">
            <q-table
              :rows="tiposMuestra"
              :columns="colTipoMuestra"
              dense
              flat
              row-key="id"
              :rows-per-page-options="[10, 20, 50]"
              :pagination="{ rowsPerPage: 10 }"
              class="sticky-header-table cursor-pointer"
              @row-click="(evt, row) => editarTipoMuestra(row)"
            >
              <template #body-cell-acciones="props">
                <q-td class="text-center">
                  <q-btn
                    flat
                    dense
                    label="Eliminar"
                    color="negative"
                    size="sm"
                    @click.stop="confirmarEliminarTipoMuestra(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- COLUMN 2: ELEMENTOS -->
      <div class="col-12 col-md-4">
        <!-- CARD 1: FORMULARIO -->
        <q-card class="column-card q-mb-md">
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="category" class="q-mr-sm" />
              Elementos
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-input
                  filled
                  dense
                  v-model="elementoForm.tipo_elemento"
                  label="Nombre"
                  class="input-modern"
                  @keyup.enter="guardarElemento"
                />
              </div>
              <div class="col-auto">
                <q-btn round dense flat icon="check" color="primary" @click="guardarElemento">
                  <q-tooltip>{{ elementoForm.id ? 'Actualizar' : 'Guardar' }}</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="elementoForm.id || elementoForm.tipo_elemento"
                  round
                  dense
                  flat
                  icon="close"
                  color="grey-7"
                  @click="cancelarElemento"
                >
                  <q-tooltip>Cancelar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- CARD 2: TABLA -->
        <q-card class="column-card">
          <q-card-section class="q-pa-none">
            <q-table
              :rows="elementos"
              :columns="colElemento"
              dense
              flat
              row-key="id"
              :rows-per-page-options="[10, 20, 50]"
              :pagination="{ rowsPerPage: 10 }"
              class="sticky-header-table cursor-pointer"
              @row-click="(evt, row) => editarElemento(row)"
            >
              <template #body-cell-acciones="props">
                <q-td class="text-center">
                  <q-btn
                    flat
                    dense
                    label="Eliminar"
                    color="negative"
                    size="sm"
                    @click.stop="confirmarEliminarElemento(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- COLUMN 3: MÉTODOS -->
      <div class="col-12 col-md-4">
        <!-- CARD 1: FORMULARIO -->
        <q-card class="column-card q-mb-md">
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle1 text-weight-bold row items-center">
              <q-icon name="precision_manufacturing" class="q-mr-sm" />
              Métodos
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-input
                  filled
                  dense
                  v-model="marchaForm.metodo"
                  label="Nombre"
                  class="input-modern"
                  @keyup.enter="guardarMarchaMetodo"
                />
              </div>
              <div class="col-auto">
                <q-btn round dense flat icon="check" color="primary" @click="guardarMarchaMetodo">
                  <q-tooltip>{{ marchaForm.id ? 'Actualizar' : 'Guardar' }}</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="marchaForm.id || marchaForm.metodo"
                  round
                  dense
                  flat
                  icon="close"
                  color="grey-7"
                  @click="cancelarMarcha"
                >
                  <q-tooltip>Cancelar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- CARD 2: TABLA -->
        <q-card class="column-card">
          <q-card-section class="q-pa-none">
            <q-table
              :rows="marchas"
              :columns="colMarcha"
              dense
              flat
              row-key="id"
              :rows-per-page-options="[10, 20, 50]"
              :pagination="{ rowsPerPage: 10 }"
              class="sticky-header-table cursor-pointer"
              @row-click="(evt, row) => editarMarchaMetodo(row)"
            >
              <template #body-cell-acciones="props">
                <q-td class="text-center">
                  <q-btn
                    flat
                    dense
                    label="Eliminar"
                    color="negative"
                    size="sm"
                    @click.stop="confirmarEliminarMarcha(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
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
  cancelarTipoMuestra()
  void cargarTiposMuestra()
}
function editarTipoMuestra(row: TipoMuestra) {
  tipoMuestraForm.value = {
    id: row.id ?? null,
    tipo_muestra: row.tipo_muestra,
  }
}
function cancelarTipoMuestra() {
  tipoMuestraForm.value = { id: null, tipo_muestra: '' }
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
  cancelarElemento()
  void cargarElementos()
}
function editarElemento(row: Elemento) {
  elementoForm.value = {
    id: row.id ?? null,
    tipo_elemento: row.tipo_elemento,
  }
}
function cancelarElemento() {
  elementoForm.value = { id: null, tipo_elemento: '' }
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
  cancelarMarcha()
  void cargarMarchas()
}
function editarMarchaMetodo(row: MarchaMetodo) {
  marchaForm.value = {
    id: row.id ?? null,
    metodo: row.metodo,
  }
}
function cancelarMarcha() {
  marchaForm.value = { id: null, metodo: '' }
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
