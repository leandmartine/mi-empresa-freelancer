import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const empresa_id = searchParams.get('empresa_id')

  let query = supabase
    .from('proyectos')
    .select('*, empresa:empresas(id, nombre, color)')
    .eq('user_id', user.id)
    .eq('activo', true)
    .order('nombre')

  if (empresa_id) query = query.eq('empresa_id', empresa_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, color, empresa_id, descripcion } = body

  if (!nombre?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('proyectos')
    .insert({
      user_id: user.id,
      nombre: nombre.trim(),
      color: color ?? '#fbcfe8',
      empresa_id: empresa_id || null,
      descripcion: descripcion || null,
    })
    .select('*, empresa:empresas(id, nombre, color)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
