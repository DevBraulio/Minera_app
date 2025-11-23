<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Sistema Minera</q-toolbar-title>

        <!-- Usuario actual -->
        <div v-if="authStore.currentUser" class="row items-center q-gutter-sm">
          <q-icon name="account_circle" size="sm" />
          <div class="column">
            <div class="text-caption">{{ authStore.currentUser.nombre }}</div>
            <div class="text-caption text-grey-4" style="font-size: 0.7rem">
              {{ authStore.currentUser.cargo }}
            </div>
          </div>

          <q-separator vertical inset class="q-mx-sm" />

          <q-btn flat dense round icon="logout" @click="handleLogout">
            <q-tooltip>Cerrar Sesión</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="modern-drawer">
      <q-list padding class="text-grey-9">
        <q-item-label header class="text-primary text-bold text-subtitle1">
          <q-icon name="business" size="sm" class="q-mr-sm" />
          Sistema Minera
        </q-item-label>

        <!-- INICIO -->
        <q-item clickable v-ripple to="/" exact class="menu-item">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- USUARIOS -->
        <q-item clickable v-ripple to="/usuarios/listar" class="menu-item">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuarios</q-item-label>
          </q-item-section>
        </q-item>

        <!-- CLIENTES -->
        <q-item clickable v-ripple to="/clientes/listar" class="menu-item">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Clientes</q-item-label>
          </q-item-section>
        </q-item>

        <q-expansion-item
          icon="settings"
          label="Configuraciones"
          dense-toggle
          header-class="text-weight-medium"
        >
          <q-list dense class="nested-list">
            <q-item clickable v-ripple to="/panel-configuracion" class="nested-item">
              <q-item-section avatar>
                <q-icon name="tune" size="sm" />
              </q-item-section>
              <q-item-section>Panel de Configuración</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/configuracion-precios" class="nested-item">
              <q-item-section avatar>
                <q-icon name="attach_money" size="sm" />
              </q-item-section>
              <q-item-section>Configuración Precios</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- COMPROBANTES -->
        <q-expansion-item
          icon="receipt_long"
          label="Guias"
          dense-toggle
          header-class="text-weight-medium"
        >
          <q-list dense class="nested-list">
            <q-item clickable v-ripple to="/boletas/form" class="nested-item">
              <q-item-section avatar>
                <q-icon name="receipt" size="sm" />
              </q-item-section>
              <q-item-section>Gestion de Guía</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/guias/listar" class="nested-item">
              <q-item-section avatar>
                <q-icon name="list_alt" size="sm" />
              </q-item-section>
              <q-item-section>Listar Guías</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- CERTIFICADOS -->
        <q-expansion-item
          icon="verified"
          label="Certificados"
          dense-toggle
          header-class="text-weight-medium"
        >
          <q-list dense class="nested-list">
            <q-item clickable v-ripple to="/certificados/listar" class="nested-item">
              <q-item-section avatar>
                <q-icon name="verified_user" size="sm" />
              </q-item-section>
              <q-item-section>Listar Certificados</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/certificados/crear" class="nested-item">
              <q-item-section avatar>
                <q-icon name="add_card" size="sm" />
              </q-item-section>
              <q-item-section>Crear Certificado</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <!-- PAGE CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { Dialog } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  Dialog.create({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro de que deseas cerrar sesión?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authStore.logout()
    void router.push('/login')
  })
}
</script>
