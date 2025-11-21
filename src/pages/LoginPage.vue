<template>
  <q-layout>
    <q-page-container>
      <q-page class="login-page">
        <div class="login-container">
          <!-- LADO IZQUIERDO - Información del Sistema -->
          <div class="info-section">
            <div class="info-content">
              <div class="logo-large">
                <q-icon name="business" size="80px" color="white" />
              </div>
              <h1 class="system-title">Sistema Minera</h1>
              <p class="system-subtitle">Gestión Integral de Laboratorio</p>

              <div class="features-list">
                <div class="feature-item" v-for="(feature, index) in features" :key="index">
                  <q-icon :name="feature.icon" size="24px" color="white" />
                  <span>{{ feature.text }}</span>
                </div>
              </div>

              <div class="stats-container">
                <div class="stat-item">
                  <div class="stat-number">100%</div>
                  <div class="stat-label">Seguro</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">Disponible</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">+500</div>
                  <div class="stat-label">Análisis</div>
                </div>
              </div>
            </div>
          </div>

          <!-- LADO DERECHO - Formulario de Login -->
          <div class="form-section">
            <div class="form-content">
              <div class="welcome-text">
                <h2>Bienvenido</h2>
                <p>Ingresa tus credenciales para continuar</p>
              </div>

              <q-form @submit="handleLogin" class="login-form">
                <div class="input-group">
                  <label class="input-label">Usuario</label>
                  <q-input
                    filled
                    v-model="form.usuario"
                    placeholder="Ingresa tu usuario"
                    :rules="[(val) => !!val || 'El usuario es requerido']"
                    lazy-rules
                    class="modern-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="primary" />
                    </template>
                  </q-input>
                </div>

                <div class="input-group">
                  <label class="input-label">Contraseña</label>
                  <q-input
                    filled
                    v-model="form.contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Ingresa tu contraseña"
                    :rules="[(val) => !!val || 'La contraseña es requerida']"
                    lazy-rules
                    class="modern-input"
                    @keyup.enter="handleLogin"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" color="primary" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="showPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="grey-6"
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="options-row">
                  <q-checkbox v-model="rememberMe" label="Recordarme" dense color="primary" />
                  <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
                </div>

                <q-btn
                  unelevated
                  type="submit"
                  label="Iniciar Sesión"
                  color="primary"
                  class="login-btn"
                  size="lg"
                  :loading="loading"
                  :disable="loading"
                  no-caps
                >
                  <template v-slot:loading>
                    <q-spinner-dots size="20px" />
                  </template>
                </q-btn>
              </q-form>

              <div class="footer-text">
                <p>© 2025 Sistema Minera. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  usuario: '',
  contraseña: '',
})

const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

const features = [
  { icon: 'analytics', text: 'Análisis de Muestras' },
  { icon: 'inventory_2', text: 'Gestión de Inventario' },
  { icon: 'description', text: 'Reportes Detallados' },
  { icon: 'security', text: 'Seguridad Garantizada' },
]

async function handleLogin() {
  loading.value = true

  try {
    const success = await authStore.login(form.value.usuario, form.value.contraseña)

    if (success) {
      // Redirigir al dashboard
      await router.push('/')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 500px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* LADO IZQUIERDO - Información */
.info-section {
  flex: 1;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.info-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
}

.logo-large {
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.system-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.system-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.features-list {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(10px);
  }

  span {
    font-size: 1rem;
  }
}

.stats-container {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
}

.stat-item {
  text-align: center;

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

/* LADO DERECHO - Formulario */
.form-section {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
}

.form-content {
  width: 100%;
  max-width: 400px;
}

.welcome-text {
  margin-bottom: 40px;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 10px 0;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.modern-input {
  :deep(.q-field__control) {
    border-radius: 12px;
    height: 56px;
    background: #f8f9fa;
    border: 2px solid transparent;
    transition: all 0.3s ease;

    &:hover {
      background: #f0f1f3;
    }
  }

  :deep(.q-field__control):before {
    border: none;
  }

  :deep(.q-field--focused .q-field__control) {
    background: white;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  :deep(.q-field__native) {
    padding-left: 10px;
  }
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
}

.forgot-link {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent);
    text-decoration: underline;
  }
}

.login-btn {
  height: 56px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.footer-text {
  margin-top: 30px;
  text-align: center;

  p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 0;
  }
}
</style>
