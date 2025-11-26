import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

export interface SystemConfig {
  id?: string
  nombre_sistema: string
  razon_social: string
  ruc: string
  direccion: string
  telefono: string
  email_oficial: string
  url_validacion: string
  logo?: string
  firma_digital?: string
  sello_digital?: string
  color_corporativo?: string
  leyenda_pie?: string
  responsable_nombre?: string
  responsable_cargo?: string
  responsable_registro?: string
  modo_impresion?: string
}

const API = 'https://cifradosdev.com/certi_minera_backend/public'

export const useSystemConfigStore = defineStore('systemConfig', () => {
  const config = ref<SystemConfig>({
    nombre_sistema: 'Sistema Minera',
    razon_social: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email_oficial: '',
    url_validacion: '',
    color_corporativo: '#1976D2', // Default primary blue
  })

  const loading = ref(false)

  async function fetchConfig() {
    try {
      const { data } = await axios.get<SystemConfig>(`${API}/sistema-config`)
      // Merge with defaults to ensure we always have a name
      config.value = { ...config.value, ...data }
      if (!config.value.nombre_sistema) config.value.nombre_sistema = 'Sistema Minera'
    } catch (error) {
      console.error('Error fetching system config:', error)
    }
  }

  async function saveConfig(data: SystemConfig) {
    loading.value = true
    try {
      await axios.post(`${API}/sistema-config/guardar`, data)
      config.value = { ...config.value, ...data }
      Notify.create({ type: 'positive', message: 'Configuración guardada correctamente' })
    } catch (error) {
      console.error('Error saving config:', error)
      Notify.create({ type: 'negative', message: 'Error al guardar configuración' })
    } finally {
      loading.value = false
    }
  }

  async function uploadFiles(formData: FormData) {
    loading.value = true
    try {
      await axios.post(`${API}/sistema-config/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchConfig() // Reload to get new URLs
      Notify.create({ type: 'positive', message: 'Archivos subidos correctamente' })
    } catch (error) {
      console.error('Error uploading files:', error)
      Notify.create({ type: 'negative', message: 'Error al subir archivos' })
    } finally {
      loading.value = false
    }
  }

  return {
    config,
    loading,
    fetchConfig,
    saveConfig,
    uploadFiles,
  }
})
