/**
 * Store en memoria para desarrollo local sin Supabase.
 * Solo activo cuando NODE_ENV === 'development' y hay cookie dev-auth.
 */

import { type Empresa, type Proyecto, type RegistroHoras, type NotaDiaria } from '@/types/app'

export const DEV_USER_ID = 'dev-user-mika-00000000-0000-0000-0000-000000000001'

// Usamos globalThis para que el store sobreviva hot-reloads de Next.js
declare global {
  // eslint-disable-next-line no-var
  var __devStore: DevStore | undefined
}

interface DevStore {
  empresas: Empresa[]
  proyectos: Proyecto[]
  registros: RegistroHoras[]
  notas: NotaDiaria[]
}

function initStore(): DevStore {
  return { empresas: [], proyectos: [], registros: [], notas: [] }
}

export function getDevStore(): DevStore {
  if (!globalThis.__devStore) {
    globalThis.__devStore = initStore()
  }
  return globalThis.__devStore
}

export function resetDevStore() {
  globalThis.__devStore = initStore()
}

function uuid() {
  return crypto.randomUUID()
}

function now() {
  return new Date().toISOString()
}

// ─── Empresas ─────────────────────────────────────────────────────────────────
export const devEmpresas = {
  list: () => getDevStore().empresas.filter((e) => e.activa),

  create: (body: { nombre: string; color: string; rut_empresa?: string }): Empresa => {
    const item: Empresa = {
      id: uuid(), user_id: DEV_USER_ID,
      nombre: body.nombre, color: body.color,
      rut_empresa: body.rut_empresa ?? null,
      activa: true, created_at: now(),
    }
    getDevStore().empresas.push(item)
    return item
  },

  update: (id: string, body: Partial<Empresa>): Empresa | null => {
    const store = getDevStore()
    const idx = store.empresas.findIndex((e) => e.id === id)
    if (idx === -1) return null
    store.empresas[idx] = { ...store.empresas[idx], ...body }
    return store.empresas[idx]
  },

  softDelete: (id: string) => devEmpresas.update(id, { activa: false }),
}

// ─── Proyectos ────────────────────────────────────────────────────────────────
export const devProyectos = {
  list: (empresa_id?: string) => {
    const proyectos = getDevStore().proyectos.filter((p) => p.activo)
    const filtered = empresa_id ? proyectos.filter((p) => p.empresa_id === empresa_id) : proyectos
    return filtered.map((p) => ({
      ...p,
      empresa: getDevStore().empresas.find((e) => e.id === p.empresa_id) ?? null,
    }))
  },

  create: (body: { nombre: string; color: string; empresa_id?: string | null; descripcion?: string | null }): Proyecto => {
    const empresa = getDevStore().empresas.find((e) => e.id === body.empresa_id) ?? undefined
    const item: Proyecto = {
      id: uuid(), user_id: DEV_USER_ID,
      nombre: body.nombre, color: body.color,
      empresa_id: body.empresa_id ?? null,
      descripcion: body.descripcion ?? null,
      activo: true, created_at: now(),
      empresa: empresa ? { id: empresa.id, nombre: empresa.nombre, color: empresa.color } : undefined,
    }
    getDevStore().proyectos.push(item)
    return item
  },

  softDelete: (id: string) => {
    const store = getDevStore()
    const idx = store.proyectos.findIndex((p) => p.id === id)
    if (idx !== -1) store.proyectos[idx].activo = false
  },
}

// ─── Registros de horas ───────────────────────────────────────────────────────
export const devRegistros = {
  list: (mes: string, empresa_id?: string | null, proyecto_id?: string | null): RegistroHoras[] => {
    const store = getDevStore()
    return store.registros
      .filter((r) => r.fecha.startsWith(mes))
      .filter((r) => !empresa_id || r.empresa_id === empresa_id)
      .filter((r) => !proyecto_id || r.proyecto_id === proyecto_id)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map((r) => ({
        ...r,
        empresa: store.empresas.find((e) => e.id === r.empresa_id) ?? undefined,
        proyecto: store.proyectos.find((p) => p.id === r.proyecto_id) ?? undefined,
      }))
  },

  create: (body: { empresa_id?: string | null; proyecto_id?: string | null; fecha: string; horas: number; descripcion?: string | null }): RegistroHoras => {
    const store = getDevStore()
    const empresa = store.empresas.find((e) => e.id === body.empresa_id)
    const proyecto = store.proyectos.find((p) => p.id === body.proyecto_id)
    const item: RegistroHoras = {
      id: uuid(), user_id: DEV_USER_ID,
      empresa_id: body.empresa_id ?? null,
      proyecto_id: body.proyecto_id ?? null,
      fecha: body.fecha, horas: body.horas,
      descripcion: body.descripcion ?? null,
      synced_sheets: false,
      created_at: now(), updated_at: now(),
      empresa: empresa ? { id: empresa.id, nombre: empresa.nombre, color: empresa.color } : undefined,
      proyecto: proyecto ? { id: proyecto.id, nombre: proyecto.nombre, color: proyecto.color } : undefined,
    }
    store.registros.push(item)
    return item
  },

  update: (id: string, body: Partial<RegistroHoras>): RegistroHoras | null => {
    const store = getDevStore()
    const idx = store.registros.findIndex((r) => r.id === id)
    if (idx === -1) return null
    store.registros[idx] = { ...store.registros[idx], ...body, updated_at: now() }
    return store.registros[idx]
  },

  delete: (id: string) => {
    const store = getDevStore()
    const idx = store.registros.findIndex((r) => r.id === id)
    if (idx !== -1) store.registros.splice(idx, 1)
  },
}

// ─── Notas diarias ────────────────────────────────────────────────────────────
export const devNotas = {
  get: (fecha: string): NotaDiaria | null =>
    getDevStore().notas.find((n) => n.fecha === fecha) ?? null,

  upsert: (fecha: string, contenido: string): NotaDiaria => {
    const store = getDevStore()
    const idx = store.notas.findIndex((n) => n.fecha === fecha)
    if (idx !== -1) {
      store.notas[idx].contenido = contenido
      store.notas[idx].updated_at = now()
      return store.notas[idx]
    }
    const item: NotaDiaria = {
      id: uuid(), user_id: DEV_USER_ID,
      fecha, contenido, created_at: now(), updated_at: now(),
    }
    store.notas.push(item)
    return item
  },
}
