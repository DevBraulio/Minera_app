# Sistema de Gestión Minera

Bienvenido al repositorio del **Sistema de Gestión Minera**, una aplicación web moderna desarrollada con **Vue 3** y **Quasar Framework** para la administración eficiente de procesos mineros, clientes y comprobantes.

## 🚀 Características Principales

- **Gestión de Clientes:** Registro, listado y administración de clientes.
- **Comprobantes y Guías:** Emisión y seguimiento de boletas y guías de remisión.
- **Configuración Dinámica:** Panel para gestionar precios, tipos de muestra, análisis y elementos.
- **Dashboard:** Visualización de datos clave con gráficos interactivos.
- **Autenticación:** Sistema de login seguro.
- **Diseño Responsivo:** Interfaz adaptada a diferentes dispositivos.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido sobre un stack tecnológico robusto y moderno:

- **[Vue 3](https://vuejs.org/):** El framework progresivo de JavaScript (Composition API).
- **[Quasar Framework](https://quasar.dev/):** Framework UI de alto rendimiento basado en Vue.
- **[TypeScript](https://www.typescriptlang.org/):** Superset de JavaScript para un código más seguro y escalable.
- **[Pinia](https://pinia.vuejs.org/):** Gestión de estado intuitiva y modular.
- **[Axios](https://axios-http.com/):** Cliente HTTP para la comunicación con el backend.
- **[ApexCharts](https://apexcharts.com/):** Gráficos interactivos y modernos.
- **[QRCode](https://www.npmjs.com/package/qrcode):** Generación de códigos QR para boletas.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- **Node.js** (Versión 18 o superior recomendada)
- **NPM** (Gestor de paquetes incluido con Node.js) o **Yarn**

## 📦 Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd minera
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # O si usas yarn:
    yarn
    ```

## ▶️ Ejecución

### Modo Desarrollo

Para iniciar el servidor de desarrollo con recarga en caliente (HMR):

```bash
npm run dev
# O:
quasar dev
```

La aplicación estará disponible generalmente en `http://localhost:9000`.

### Compilación para Producción

Para generar los archivos estáticos optimizados para despliegue:

```bash
npm run build
# O:
quasar build
```

Los archivos generados se encontrarán en la carpeta `dist/spa`.

### Linter y Formato

Para revisar y corregir el estilo del código:

```bash
npm run lint
npm run format
```

## 📂 Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos (imágenes, fuentes)
├── boot/            # Archivos de inicialización (axios, etc.)
├── components/      # Componentes Vue reutilizables
├── css/             # Estilos globales (app.scss)
├── layouts/         # Plantillas de diseño (MainLayout, etc.)
├── pages/           # Vistas de la aplicación (Rutas)
│   ├── clientes/
│   ├── comprobantes/
│   ├── configuraciones/
│   └── ...
├── router/          # Configuración de rutas (Vue Router)
├── stores/          # Estados globales (Pinia)
└── App.vue          # Componente raíz
```

## 🤝 Contribución

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3.  Haz Commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4.  Haz Push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

---

Desarrollado con ❤️ usando Quasar Framework.
