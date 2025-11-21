import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Login (Ruta pública)
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },

  // Rutas protegidas
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      // ➜ Usuarios
      {
        path: 'usuarios/listar',
        component: () => import('pages/usuarios/ListarUsuarios.vue'),
      },
      // ➜ Clientes
      {
        path: 'clientes/listar',
        component: () => import('pages/clientes/ListarClientes.vue'),
      },
      {
        path: '/panel-configuracion',
        component: () => import('pages/configuraciones/PanelConfiguracion.vue'),
      },
      {
        path: '/configuracion-precios',
        component: () => import('pages/configuraciones/ConfiguracionPrecios.vue'),
      },
      {
        path: '/configuracion-precios/:id/resultados',
        component: () => import('pages/configuraciones/ConfiguracionResultados.vue'),
      },
      {
        path: '/guias/registrar',
        component: () => import('pages/clientes/RegistrarGuia.vue'),
      },
      {
        path: '/guias/Listar',
        component: () => import('pages/comprobantes/ListarGuia.vue'),
      },
    ],
  },

  // 404 (Último siempre)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
