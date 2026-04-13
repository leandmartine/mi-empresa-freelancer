import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { mesActual, rangoMes } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const mes = searchParams.get('mes') ?? mesActual()
  const { desde, hasta } = rangoMes(mes)

  const { data: registros, error } = await supabase
    .from('registros_horas')
    .select(`
      *,
      empresa:empresas(id, nombre, color),
      proyecto:proyectos(id, nombre, color)
    `)
    .eq('user_id', user.id)
    .gte('fecha', desde)
    .lte('fecha', hasta)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Calcular métricas en el servidor
  const total_horas = registros?.reduce((acc, r) => acc + r.horas, 0) ?? 0
  const num_registros = registros?.length ?? 0
  const dias_con_trabajo = new Set(registros?.map((r) => r.fecha)).size
  const promedio_diario = dias_con_trabajo > 0 ? total_horas / dias_con_trabajo : 0

  // Por empresa
  const empresasMap = new Map<string, { empresa_id: string; empresa_nombre: string; empresa_color: string; total_horas: number }>()
  registros?.forEach((r) => {
    if (!r.empresa_id) return
    const key = r.empresa_id
    if (!empresasMap.has(key)) {
      empresasMap.set(key, {
        empresa_id: r.empresa_id,
        empresa_nombre: r.empresa?.nombre ?? 'Sin nombre',
        empresa_color: r.empresa?.color ?? '#f472b6',
        total_horas: 0,
      })
    }
    empresasMap.get(key)!.total_horas += r.horas
  })

  // Por proyecto
  const proyectosMap = new Map<string, { proyecto_id: string; proyecto_nombre: string; proyecto_color: string; empresa_nombre: string | null; total_horas: number }>()
  registros?.forEach((r) => {
    if (!r.proyecto_id) return
    const key = r.proyecto_id
    if (!proyectosMap.has(key)) {
      proyectosMap.set(key, {
        proyecto_id: r.proyecto_id,
        proyecto_nombre: r.proyecto?.nombre ?? 'Sin nombre',
        proyecto_color: r.proyecto?.color ?? '#fbcfe8',
        empresa_nombre: r.empresa?.nombre ?? null,
        total_horas: 0,
      })
    }
    proyectosMap.get(key)!.total_horas += r.horas
  })

  // Por día
  const diasMap = new Map<string, number>()
  registros?.forEach((r) => {
    diasMap.set(r.fecha, (diasMap.get(r.fecha) ?? 0) + r.horas)
  })

  const metricas = {
    mes,
    total_horas,
    num_registros,
    promedio_diario,
    por_empresa: Array.from(empresasMap.values()).sort((a, b) => b.total_horas - a.total_horas),
    por_proyecto: Array.from(proyectosMap.values()).sort((a, b) => b.total_horas - a.total_horas),
    por_dia: Array.from(diasMap.entries())
      .map(([fecha, total_horas]) => ({ fecha, total_horas }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha)),
  }

  return NextResponse.json({ data: metricas })
}
