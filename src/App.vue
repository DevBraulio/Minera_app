<template>
  <router-view />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useSystemConfigStore } from 'src/stores/systemConfig'

const configStore = useSystemConfigStore()

watchEffect(() => {
  document.title = configStore.config.nombre_sistema || 'Sistema Minera'
})
</script>
