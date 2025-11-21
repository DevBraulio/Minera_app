import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const API = 'https://cifradosdev.com/certi_minera_backend/public'

interface Usuario {
  id?: number
  nombre: string
  usuario: string
  cargo: string
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<Usuario | null>(null)
  const token = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)

  // Inicializar desde localStorage
  function initializeAuth() {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (error) {
        console.error('Error al parsear usuario almacenado:', error)
        clearAuth()
      }
    }
  }

  // Login
  async function login(usuario: string, contraseña: string): Promise<boolean> {
    try {
      const { data } = await axios.post(`${API}/usuarios/login`, {
        usuario,
        contraseña,
      })

      // Verificar si el login fue exitoso
      // El backend devuelve: { mensaje: "Login exitoso", usuario: {...} }
      if (data && data.usuario && data.usuario.id) {
        const usuarioData = data.usuario

        // Guardar usuario
        user.value = {
          id: parseInt(usuarioData.id),
          nombre: usuarioData.nombre || usuario,
          usuario: usuarioData.usuario || usuario,
          cargo: usuarioData.cargo || 'Usuario',
        }

        // Generar token simple (ya que el backend no lo proporciona)
        // En producción, el backend debería devolver un JWT
        const generatedToken = `user_${usuarioData.id}_${Date.now()}`
        token.value = generatedToken

        // Guardar en localStorage
        localStorage.setItem('auth_user', JSON.stringify(user.value))
        localStorage.setItem('auth_token', generatedToken)

        Notify.create({
          type: 'positive',
          message: `Bienvenido ${user.value.nombre}`,
          position: 'top-right',
        })

        return true
      } else {
        Notify.create({
          type: 'negative',
          message: 'Credenciales inválidas',
          position: 'top-right',
        })
        return false
      }
    } catch (error: unknown) {
      console.error('Error en login:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al iniciar sesión. Verifica tus credenciales.',
        position: 'top-right',
      })
      return false
    }
  }

  // Logout
  function logout() {
    clearAuth()
    Notify.create({
      type: 'info',
      message: 'Sesión cerrada correctamente',
      position: 'top-right',
    })
  }

  // Limpiar autenticación
  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  // Verificar autenticación
  function checkAuth(): boolean {
    return isAuthenticated.value
  }

  return {
    // Estado
    user,
    token,
    // Getters
    isAuthenticated,
    currentUser,
    // Acciones
    login,
    logout,
    checkAuth,
    initializeAuth,
  }
})
