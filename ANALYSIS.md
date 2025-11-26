# Documentación de la API - Certi Minera

**Base URL:** `https://cifradosdev.com/certi_minera_backend/public`

Esta documentación ha sido actualizada basada en la definición Swagger proporcionada.

## 1. Certificados

### Listar todos los certificados

- **GET** `/certificado/certificados`

### Crear un certificado automáticamente desde una boleta

- **POST** `/certificado/certificados`
- **Descripción:** Crea un certificado con código correlativo FRI-CER-año-XXXXXX y genera automáticamente sus detalles según la configuración.
- **Body:**
  ```json
  {
    "Num_Boleta": "FRI-2025-000001",
    "id_usuario": 1
  }
  ```
- **Respuesta exitosa (201):**
  ```json
  {
    "success": true,
    "id_certificado": 15,
    "codigo_certificado": "FRI-CER-2025-000001",
    "cantidad_detalles": 3,
    "num_guias_procesadas": 2,
    "detalles_creados": 2
  }
  ```

### Obtener un certificado por ID

- **GET** `/certificado/certificados/{id}`

### Actualizar un certificado

- **PUT** `/certificado/certificados/{id}`

### Eliminar un certificado

- **DELETE** `/certificado/certificados/{id}`

---

## 2. Detalles de Certificado

### Listar todos los detalles

- **GET** `/certificado/certificado_detalle`

### Crear uno o varios detalles

- **POST** `/certificado/certificado_detalle`
- **Body:**
  ```json
  [
    {
      "id_certificado": 1,
      "id_resultado_config": 10,
      "valor_obtenido": 3.45
    }
  ]
  ```

### Obtener detalle por ID

- **GET** `/certificado/certificado_detalle/{id}`

### Actualizar un detalle

- **PUT** `/certificado/certificado_detalle/{id}`

### Eliminar un detalle

- **DELETE** `/certificado/certificado_detalle/{id}`

---

## 3. Clientes

### Guardar o actualizar un cliente

- **POST** `/clientes/guardar`
- **Body:**
  ```json
  {
    "nom_cliente": "Jaime Supo",
    "ruc_cliente": "123456789",
    "tel_cliente": "987654321",
    "email": "jaime@minera.com",
    "fech_ingreso": "2024-02-10",
    "observaciones": "Cliente VIP"
  }
  ```

### Actualizar un cliente por ID

- **PUT** `/clientes/actualizar/{id}`

### Listar todos los clientes activos

- **GET** `/clientes/listar`

### Obtener un cliente por ID

- **GET** `/clientes/obtener/{id}`

### Eliminar un cliente (marcar como inactivo)

- **DELETE** `/clientes/eliminar/{id}`

### Reactivar un cliente eliminado

- **PUT** `/clientes/reactivar/{id}`

### Buscar cliente por texto

- **GET** `/clientes/buscar`
- **Parámetros:** `q` (string)

---

## 4. Boletas

### Registrar boleta con ensayos

- **POST** `/boletas`
- **Body:**
  ```json
  {
    "boleta": {
      "Cod_Cliente": "5",
      "Cod_empleado": "2",
      "Fecha": "2025-11-17",
      "Total": 200,
      "Acuenta": 50,
      "Resta": 150,
      "Envase": "Envase 1",
      "Can_muestras": 2,
      "TIPO": "Guía"
    },
    "guias": [
      {
        "identificacion": "M1",
        "id_tipo_muestra": 1,
        "id_analisis": 3,
        "id_configuracion_precios": 3,
        "Total": 100,
        "Descripcion": ""
      }
    ]
  }
  ```

### Obtener las 20 boletas más recientes con sus guías

- **GET** `/boletas/top20`

---

## 5. Guías

### Registrar un ensayo individual

- **POST** `/guias`
- **Body:**
  ```json
  {
    "Co_boleta": "FRI-2025-000001",
    "Cod_cliente": "5",
    "identificacion": "M1",
    "Metodo": "3",
    "Elementos": "1",
    "id_configuracion_precios": 3,
    "Total": 100
  }
  ```

---

## 6. Configuración de Precios

### Listar todas las configuraciones activas

- **GET** `/configuracion-precios`

### Crear una nueva configuración

- **POST** `/configuracion-precios`
- **Body:**
  ```json
  {
    "id_tipo_muestra": 1,
    "id_elemento": 2,
    "id_marcha_metodo": 3,
    "nombre_comercial": "Análisis Oro Especial",
    "precio": 150,
    "resultados_esperados": 5
  }
  ```

### Obtener una configuración por ID

- **GET** `/configuracion-precios/{id}`

### Actualizar una configuración

- **PUT** `/configuracion-precios/{id}`

### Eliminar una configuración (inactivar)

- **DELETE** `/configuracion-precios/{id}`

### Reactivar una configuración eliminada

- **PUT** `/configuracion-precios/activar/{id}`

### Listar análisis por tipo de muestra

- **GET** `/configuracion-precios/por-tipo-muestra`
- **Parámetros:** `muestra` (integer)

---

## 7. Configuración de Resultados

### Listar todos los resultados de una configuración

- **GET** `/configuracion-precios/{id}/resultados`

### Crear un nuevo resultado para una configuración

- **POST** `/configuracion-precios/{id}/resultados`
- **Body:**
  ```json
  {
    "nombre_resultado": "A",
    "orden": 1,
    "visible": 1,
    "formula": "B - A"
  }
  ```

### Listar solo los resultados visibles

- **GET** `/configuracion-precios/{id}/resultados/visibles`

### Obtener un resultado específico por ID

- **GET** `/configuracion-precios/resultados/{id}`

### Actualizar un resultado

- **PUT** `/configuracion-precios/resultados/{id}`

### Eliminar un resultado

- **DELETE** `/configuracion-precios/resultados/{id}`

---

## 8. Elemento

### Listar todos los elementos activos

- **GET** `/elemento`

### Crear un nuevo elemento

- **POST** `/elemento`

### Actualizar un elemento

- **PUT** `/elemento/{id}`

### Eliminar un elemento (inactivar)

- **DELETE** `/elemento/{id}`

### Reactivar un elemento eliminado

- **PUT** `/elemento/activar/{id}`

---

## 9. Marcha/Método

### Listar todos los métodos activos

- **GET** `/marcha-metodo`

### Crear un nuevo método

- **POST** `/marcha-metodo`

### Actualizar un método

- **PUT** `/marcha-metodo/{id}`

### Eliminar un método (inactivar)

- **DELETE** `/marcha-metodo/{id}`

### Reactivar un método eliminado

- **PUT** `/marcha-metodo/activar/{id}`

---

## 10. Tipo de Muestra

### Listar todos los tipos de muestra activos

- **GET** `/tipo-muestra`

### Crear un nuevo tipo de muestra

- **POST** `/tipo-muestra`

### Actualizar un tipo de muestra

- **PUT** `/tipo-muestra/{id}`

### Eliminar un tipo de muestra (inactivar)

- **DELETE** `/tipo-muestra/{id}`

### Reactivar un tipo de muestra eliminado

- **PUT** `/tipo-muestra/activar/{id}`

---

## 11. Usuarios

### Registrar un nuevo usuario

- **POST** `/usuarios/registrar`

### Listar todos los usuarios activos

- **GET** `/usuarios/listar`

### Obtener un usuario por ID

- **GET** `/usuarios/obtener/{id}`

### Eliminar un usuario (inactivar)

- **DELETE** `/usuarios/eliminar/{id}`

### Reactivar un usuario eliminado

- **PUT** `/usuarios/activar/{id}`

### Autenticación de usuario (Login)

- **POST** `/usuarios/login`

---

## 12. Configuración del Sistema

### Obtener configuración actual

- **GET** `/sistema-config`

### Guardar o actualizar configuración

- **POST** `/sistema-config/guardar`
- **Body:**
  ```json
  {
    "nombre_empresa": "Minera S.A.",
    "ruc": "20123456789",
    "direccion": "Av. Principal 123",
    "telefono": "012345678",
    "email": "contacto@minera.com",
    "web": "www.minera.com"
  }
  ```

### Subir archivos (logo, firma, sello)

- **POST** `/sistema-config/upload`
- **Body:** `FormData`
  - `logo`: File
  - `firma`: File
  - `sello`: File

---

## 13. Impresiones

### Generar impresión unificada

- **GET** `/impresiones/generar`
- **Parámetros:**
  - `id_guia` (integer, opcional)
  - `id_boleta` (integer, opcional)
  - `id_certificado` (integer, opcional)
