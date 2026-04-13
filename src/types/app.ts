// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string
  full_name: string | null
  rut: string | null
  email: string
  avatar_url: string | null
  sheets_spreadsheet_id: string | null
  created_at: string
  updated_at: string
}

// ─── Empresa ──────────────────────────────────────────────────────────────────
export interface Empresa {
  id: string
  user_id: string
  nombre: string
  color: string
  rut_empresa: string | null
  activa: boolean
  created_at: string
}

export type EmpresaCreate = Pick<Empresa, 'nombre' | 'color'> & { rut_empresa?: string }
export type EmpresaUpdate = Partial<EmpresaCreate> & { activa?: boolean }

// ─── Proyecto ─────────────────────────────────────────────────────────────────
export interface Proyecto {
  id: string
  user_id: string
  empresa_id: string | null
  nombre: string
  descripcion: string | null
  color: string
  activo: boolean
  created_at: string
  empresa?: Pick<Empresa, 'id' | 'nombre' | 'color'>
}

export type ProyectoCreate = Pick<Proyecto, 'nombre' | 'color'> & {
  empresa_id?: string | null
  descripcion?: string | null
}
export type ProyectoUpdate = Partial<ProyectoCreate> & { activo?: boolean }

// ─── Registro de Horas ────────────────────────────────────────────────────────
export interface RegistroHoras {
  id: string
  user_id: string
  empresa_id: string | null
  proyecto_id: string | null
  fecha: string // YYYY-MM-DD
  horas: number
  descripcion: string | null
  synced_sheets: boolean
  created_at: string
  updated_at: string
  empresa?: Pick<Empresa, 'id' | 'nombre' | 'color'>
  proyecto?: Pick<Proyecto, 'id' | 'nombre' | 'color'>
}

export type RegistroCreate = {
  empresa_id?: string | null
  proyecto_id?: string | null
  fecha: string
  horas: number
  descripcion?: string | null
}
export type RegistroUpdate = Partial<RegistroCreate>

// ─── Nota Diaria ──────────────────────────────────────────────────────────────
export interface NotaDiaria {
  id: string
  user_id: string
  fecha: string
  contenido: string
  created_at: string
  updated_at: string
}

// ─── Métricas ─────────────────────────────────────────────────────────────────
export interface MetricasMensuales {
  mes: string // YYYY-MM
  total_horas: number
  num_registros: number
  promedio_diario: number
  por_empresa: Array<{
    empresa_id: string
    empresa_nombre: string
    empresa_color: string
    total_horas: number
  }>
  por_proyecto: Array<{
    proyecto_id: string
    proyecto_nombre: string
    proyecto_color: string
    empresa_nombre: string | null
    total_horas: number
  }>
  por_dia: Array<{
    fecha: string
    total_horas: number
  }>
}

export interface SyncStatus {
  last_sync: string | null
  status: 'success' | 'error' | 'pending' | 'never'
  records_synced: number
  error_message: string | null
}
