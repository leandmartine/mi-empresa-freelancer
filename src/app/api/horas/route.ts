import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { rangoMes, mesActual } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const mes = searchParams.get('mes') ?? mesActual()
  const empresa_id = searchParams.get('empresa_id')
  const proyecto_id = searchParams.get('proyecto_id')
  const { desde, hasta } = rangoMes(mes)

  let query = supabase
    .from('registros_horas')
    .select(`
      *,
      empresa:empresas(id, nombre, color),
      proyecto:proyectos(id, nombre, color)
    `)
    .eq('user_id', user.id)
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false })

  if (empresa_id) query = query.eq('empresa_id', empresa_id)
  if (proyecto_id) query = query.eq('proyecto_id', proyecto_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { empresa_id, proyecto_id, fecha, horas, descripcion } = body

  if (!fecha || !horas || horas <= 0 || horas > 24) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('registros_horas')
    .insert({
      user_id: user.id,
      empresa_id: empresa_id || null,
      proyecto_id: proyecto_id || null,
      fecha,
      horas,
      descripcion: descripcion || null,
    })
    .select(`
      *,
      empresa:empresas(id, nombre, color),
      proyecto:proyectos(id, nombre, color)
    `)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Disparar sync con Google Sheets en background (no bloqueante)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sync/sheets`, {
    method: 'POST',
    headers: { Cookie: req.headers.get('cookie') ?? '' },
  }).catch(() => {})

  return NextResponse.json({ data }, { status: 201 })
}
