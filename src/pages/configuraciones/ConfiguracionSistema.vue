<template>
  <q-page class="page-container">
    <!-- HEADER -->
    <div class="page-header">
      <h4 class="text-h4">
        <q-icon name="settings" class="q-mr-sm" />
        Configuración del Sistema
      </h4>
      <div>
        <template v-if="!isEditing">
          <q-btn
            label="Editar Información"
            icon="edit"
            color="primary"
            class="shadow-3"
            @click="startEditing"
          />
        </template>
        <template v-else>
          <q-btn
            label="Cancelar"
            flat
            color="negative"
            class="q-mr-sm"
            @click="cancelEditing"
            :disable="store.loading"
          />
          <q-btn
            label="Guardar Cambios"
            icon="save"
            color="positive"
            class="shadow-3"
            @click="guardarDatos"
            :loading="store.loading"
          />
        </template>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- SECCIÓN 1: INFORMACIÓN DE LA EMPRESA -->
      <div class="col-12 col-md-8">
        <div class="table-card q-pa-lg h-full">
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="business" class="q-mr-sm" />
            Datos de la Empresa
          </div>
          <q-separator class="q-mb-md" />

          <!-- VISTA DE LECTURA -->
          <div v-if="!isEditing" class="row q-col-gutter-y-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Nombre del Sistema</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.nombre_sistema || '---' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Razón Social</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.razon_social || '---' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">RUC</div>
              <div class="text-body1 text-weight-medium">{{ store.config.ruc || '---' }}</div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Teléfono</div>
              <div class="text-body1 text-weight-medium">{{ store.config.telefono || '---' }}</div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Email Oficial</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.email_oficial || '---' }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">URL Validación</div>
              <div class="text-body1 text-primary cursor-pointer text-weight-medium">
                {{ store.config.url_validacion || '---' }}
              </div>
            </div>
            <div class="col-12">
              <div class="text-caption text-grey-7">Dirección</div>
              <div class="text-body1 text-weight-medium">{{ store.config.direccion || '---' }}</div>
            </div>

            <div class="col-12">
              <q-separator class="q-my-sm" />
              <div class="text-subtitle2 text-primary q-mb-sm">Datos del Responsable</div>
            </div>

            <div class="col-12 col-sm-4">
              <div class="text-caption text-grey-7">Nombre</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.responsable_nombre || '---' }}
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-grey-7">Cargo</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.responsable_cargo || '---' }}
              </div>
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-grey-7">Registro / Colegiatura</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.responsable_registro || '---' }}
              </div>
            </div>

            <div class="col-12">
              <q-separator class="q-my-sm" />
              <div class="text-subtitle2 text-primary q-mb-sm">Configuración Adicional</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Color Corporativo</div>
              <div class="row items-center q-gutter-x-sm">
                <div
                  :style="{
                    backgroundColor: store.config.color_corporativo || '#ccc',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                  }"
                ></div>
                <div class="text-body1 text-weight-medium">
                  {{ store.config.color_corporativo || '---' }}
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-7">Leyenda Pie de Página</div>
              <div class="text-body1 text-weight-medium">
                {{ store.config.leyenda_pie || '---' }}
              </div>
            </div>
          </div>

          <!-- VISTA DE EDICIÓN -->
          <div v-else class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.nombre_sistema"
                label="Nombre del Sistema"
                :rules="[(val) => !!val || 'Campo requerido']"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.razon_social"
                label="Razón Social"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.ruc"
                label="RUC"
                mask="###########"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input filled v-model="form.telefono" label="Teléfono" dense class="input-modern" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.email_oficial"
                label="Email Oficial"
                type="email"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.url_validacion"
                label="URL Validación"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12">
              <q-input
                filled
                v-model="form.direccion"
                label="Dirección"
                dense
                class="input-modern"
              />
            </div>

            <div class="col-12">
              <div class="text-subtitle2 text-primary q-my-sm">Datos del Responsable</div>
            </div>

            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="form.responsable_nombre"
                label="Nombre Responsable"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="form.responsable_cargo"
                label="Cargo"
                dense
                class="input-modern"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                filled
                v-model="form.responsable_registro"
                label="Registro / Colegiatura"
                dense
                class="input-modern"
              />
            </div>

            <div class="col-12">
              <div class="text-subtitle2 text-primary q-my-sm">Configuración Adicional</div>
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.color_corporativo"
                label="Color Corporativo"
                dense
                class="input-modern"
              >
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="form.color_corporativo" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="form.leyenda_pie"
                label="Leyenda Pie de Página"
                dense
                class="input-modern"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: PERSONALIZACIÓN VISUAL -->
      <div class="col-12 col-md-4">
        <div class="table-card q-pa-lg h-full">
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="palette" class="q-mr-sm" />
            Personalización Visual
          </div>
          <q-separator class="q-mb-md" />

          <div class="column q-gutter-y-lg">
            <!-- LOGO -->
            <div>
              <div class="text-caption text-grey-7 q-mb-xs">Logo del Sistema</div>
              <div class="row items-center q-gutter-x-md">
                <q-avatar size="80px" rounded color="grey-2" text-color="grey">
                  <img
                    v-if="store.config.logo"
                    :src="store.config.logo"
                    style="object-fit: contain"
                  />
                  <q-icon v-else name="image_not_supported" />
                </q-avatar>
                <div v-if="isEditing">
                  <q-file
                    outlined
                    dense
                    v-model="files.logo"
                    label="Cambiar Logo"
                    accept=".jpg, .png, .jpeg"
                    style="max-width: 200px"
                    class="input-modern"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>

            <!-- FIRMA -->
            <div>
              <div class="text-caption text-grey-7 q-mb-xs">Firma Digital</div>
              <div class="row items-center q-gutter-x-md">
                <div
                  class="bg-grey-2 rounded-borders flex flex-center"
                  style="width: 150px; height: 60px; overflow: hidden"
                >
                  <img
                    v-if="store.config.firma_digital"
                    :src="store.config.firma_digital"
                    style="max-width: 100%; max-height: 100%"
                  />
                  <span v-else class="text-grey-6 text-caption">Sin Firma</span>
                </div>
                <div v-if="isEditing">
                  <q-file
                    outlined
                    dense
                    v-model="files.firma"
                    label="Subir Firma"
                    accept=".jpg, .png, .jpeg"
                    style="max-width: 200px"
                    class="input-modern"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>

            <!-- SELLO -->
            <div>
              <div class="text-caption text-grey-7 q-mb-xs">Sello Empresarial</div>
              <div class="row items-center q-gutter-x-md">
                <div
                  class="bg-grey-2 rounded-borders flex flex-center"
                  style="width: 100px; height: 100px; overflow: hidden"
                >
                  <img
                    v-if="store.config.sello_digital"
                    :src="store.config.sello_digital"
                    style="max-width: 100%; max-height: 100%"
                  />
                  <span v-else class="text-grey-6 text-caption">Sin Sello</span>
                </div>
                <div v-if="isEditing">
                  <q-file
                    outlined
                    dense
                    v-model="files.sello"
                    label="Subir Sello"
                    accept=".jpg, .png, .jpeg"
                    style="max-width: 200px"
                    class="input-modern"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSystemConfigStore } from 'src/stores/systemConfig'
import { Notify } from 'quasar'

const store = useSystemConfigStore()
const isEditing = ref(false)

const form = ref({
  nombre_sistema: '',
  razon_social: '',
  ruc: '',
  direccion: '',
  telefono: '',
  email_oficial: '',
  url_validacion: '',
  color_corporativo: '',
  leyenda_pie: '',
  responsable_nombre: '',
  responsable_cargo: '',
  responsable_registro: '',
  modo_impresion: '',
})

const files = ref({
  logo: null as File | null,
  firma: null as File | null,
  sello: null as File | null,
})

onMounted(async () => {
  await store.fetchConfig()
  syncForm()
})

function syncForm() {
  form.value = {
    nombre_sistema: store.config.nombre_sistema || '',
    razon_social: store.config.razon_social || '',
    ruc: store.config.ruc || '',
    direccion: store.config.direccion || '',
    telefono: store.config.telefono || '',
    email_oficial: store.config.email_oficial || '',
    url_validacion: store.config.url_validacion || '',
    color_corporativo: store.config.color_corporativo || '#1976D2',
    leyenda_pie: store.config.leyenda_pie || '',
    responsable_nombre: store.config.responsable_nombre || '',
    responsable_cargo: store.config.responsable_cargo || '',
    responsable_registro: store.config.responsable_registro || '',
    modo_impresion: store.config.modo_impresion || 'A4',
  }
}

watch(
  () => store.config,
  () => {
    if (!isEditing.value) syncForm()
  },
  { deep: true },
)

function startEditing() {
  syncForm()
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  files.value = { logo: null, firma: null, sello: null }
  syncForm()
}

async function guardarDatos() {
  // 1. Guardar datos de texto
  await store.saveConfig(form.value)

  // 2. Subir archivos si existen
  if (files.value.logo || files.value.firma || files.value.sello) {
    const formData = new FormData()
    if (files.value.logo) formData.append('logo', files.value.logo)
    if (files.value.firma) formData.append('firma', files.value.firma)
    if (files.value.sello) formData.append('sello', files.value.sello)

    await store.uploadFiles(formData)
  }

  // 3. Finalizar
  isEditing.value = false
  files.value = { logo: null, firma: null, sello: null }
  Notify.create({ type: 'positive', message: 'Configuración actualizada correctamente' })
}
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
