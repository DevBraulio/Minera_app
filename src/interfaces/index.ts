export interface Certificado {
  id?: number
  codigo_certificado: string
  co_guia: number
  id_configuracion: number
}

export interface DetalleCertificado {
  id?: number
  id_certificado: number
  id_resultado_config: number
  valor_obtenido: number
}

export interface Cliente {
  id_cliente?: number
  cod_cliente?: string
  nom_cliente: string
  ruc_cliente: string
  tel_cliente: string
  email: string
  fech_ingreso: string
  observaciones: string
  estado?: number
}

export interface Boleta {
  Num_Boleta?: string
  Cod_Cliente: string
  Cod_empleado: string
  Fecha: string
  Total: number
  Acuenta: number
  Resta: number
  Envase: string
  Can_muestras: number
  TIPO: string
  ClienteNombre?: string
  guias?: Guia[]
}

export interface Guia {
  Co_Guia?: number
  Co_boleta?: string
  Cod_cliente?: string
  identificacion: string
  id_tipo_muestra?: number
  id_analisis?: number
  id_configuracion_precios: number
  Metodo?: string
  Elementos?: string
  Total: number
  Descripcion?: string
  TipoMuestraNombre?: string
  AnalisisNombre?: string
}

export interface ConfiguracionPrecio {
  id?: number
  id_tipo_muestra: number
  id_elemento: number
  id_marcha_metodo: number
  nombre_comercial: string
  precio: number
  resultados_esperados: number
  estado?: number // 1 = activo, 0 = inactivo
  nombre_tipo_muestra?: string // For display purposes
  nombre_elemento?: string // For display purposes
  nombre_metodo?: string // For display purposes
}

export interface ResultadoConfiguracion {
  id?: number
  id_configuracion?: number
  nombre_resultado: string
  orden: number
  visible: number
  formula: string
  prueba?: number
}

export interface Elemento {
  id?: number
  tipo_elemento: string
}

export interface MarchaMetodo {
  id?: number
  metodo: string
}

export interface TipoMuestra {
  id?: number
  tipo_muestra: string
}

export interface Usuario {
  id?: number
  nombre: string
  usuario: string
  contraseña?: string
  cargo: string
  estado?: number
}
