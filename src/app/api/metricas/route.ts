import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { isDevAuth } from '@/lib/supabase/auth-dev'
import { devRegistros } from '@/lib/supabase/dev-store'
import { mesActual, rangoMes } from '@/lib/utils'

type EmpresaConTarifa = { id: string; tarifa_por_hora?: number | null }

function calcularMetricas(
  registros: ReturnType<typeof devRegistros.list>,
  mes: string,
  empresasConTarifa: EmpresaConTarifa[] = []
) {
  const total_horas = registros.reduce((acc, r) => acc + r.horas, 0)
  const num_registros = registros.length
  const dias_con_trabajo = new Set(registros.map((r) => r.fecha)).size
  const promedio_diario = dias_con_trabajo > 0 ? total_horas / dias_con_trabajo : 0

  const empresasMap = new Map<string, { empresa_id: string; empresa_nombre: string; empresa_color: string; total_horas: number }>()
  registros.forEach((r) => {
    if (!r.empresa_id) return
    if (!empresasMap.has(r.empresa_id)) {
      empresasMap.set(r.empresa_id, {
        empresa_id: r.empresa_id,
        empresa_nombre: r.empresa?.nombre ?? 'Sin nombre',
        empresa_color: r.empresa?.color ?? '#f472b6',
        total_horas: 0,
      })
    }
    empresasMap.get(r.empresa_id)!.total_horas += r.horas
  })

  const proyectosMap = new Map<string, { proyecto_id: string; proyecto_nombre: string; proyecto_color: string; empresa_nombre: string | null; total_horas: number }>()
  registros.forEach((r) => {
    if (!r.proyecto_id) return
    if (!proyectosMap.has(r.proyecto_id)) {
      proyectosMap.set(r.proyecto_id, {
        proyecto_id: r.proyecto_id,
        proyecto_nombre: r.proyecto?.nombre ?? 'Sin nombre',
        proyecto_color: r.proyecto?.color ?? '#fbcfe8',
        empresa_nombre: r.empresa?.nombre ?? null,
        total_horas: 0,
      })
    }
    proyectosMap.get(r.proyecto_id)!.total_horas += r.horas
  })

  const diasMap = new Map<string, number>()
  registros.forEach((r) => {
    diasMap.set(r.fecha, (diasMap.get(r.fecha) ?? 0) + r.horas)
  })

  const tarifaMap = new Map(empresasConTarifa.map((e) => [e.id, e.tarifa_por_hora ?? 0]))

  const porEmpresaConIngresos = Array.from(empresasMap.values())
    .sort((a, b) => b.total_horas - a.total_horas)
    .map((e) => ({
      ...e,
      ingresos_estimados: (tarifaMap.get(e.empresa_id) ?? 0) * e.total_horas,
    }))

  return {
    mes,
    total_horas,
    num_registros,
    promedio_diario,
    por_empresa: porEmpresaConIngresos,
    por_proyecto: Array.from(proyectosMap.values()).sort((a, b) => b.total_horas - a.total_horas),
    por_dia: Array.from(diasMap.entries())
      .map(([fecha, total_horas]) => ({ fecha, total_horas }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha)),
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mes = searchParams.get('mes') ?? mesActual()

  if (isDevAuth(req)) {
    const registros = devRegistros.list(mes)
    return NextResponse.json({ data: calcularMetricas(registros, mes) })
  }

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { desde, hasta } = rangoMes(mes)
  const [{ data: registros, error }, { data: empresas }] = await Promise.all([
    supabase
      .from('registros_horas')
      .select(`*, empresa:empresas(id, nombre, color), proyecto:proyectos(id, nombre, color)`)
      .eq('user_id', user.id).gte('fecha', desde).lte('fecha', hasta),
    supabase
      .from('empresas')
      .select('id, tarifa_por_hora')
      .eq('user_id', user.id),
  ])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: calcularMetricas(registros ?? [], mes, empresas ?? []) })
}
