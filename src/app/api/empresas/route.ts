import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { isDevAuth } from '@/lib/supabase/auth-dev'
import { devEmpresas } from '@/lib/supabase/dev-store'

export async function GET(req: NextRequest) {
  if (isDevAuth(req)) {
    return NextResponse.json({ data: devEmpresas.list() })
  }

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('empresas').select('*').eq('user_id', user.id).eq('activa', true).order('nombre')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, color, rut_empresa } = body

  if (!nombre?.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })

  if (isDevAuth(req)) {
    const data = devEmpresas.create({ nombre: nombre.trim(), color: color ?? '#f472b6', rut_empresa })
    return NextResponse.json({ data }, { status: 201 })
  }

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('empresas')
    .insert({ user_id: user.id, nombre: nombre.trim(), color: color ?? '#f472b6', rut_empresa: rut_empresa || null })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
