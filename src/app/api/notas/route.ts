import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { hoy } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const fecha = searchParams.get('fecha') ?? hoy()

  const { data, error } = await supabase
    .from('notas_diarias')
    .select('*')
    .eq('user_id', user.id)
    .eq('fecha', fecha)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { fecha, contenido } = body

  if (!fecha || !contenido?.trim()) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // Upsert: una nota por día
  const { data, error } = await supabase
    .from('notas_diarias')
    .upsert(
      { user_id: user.id, fecha, contenido: contenido.trim(), updated_at: new Date().toISOString() },
      { onConflict: 'user_id,fecha' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
