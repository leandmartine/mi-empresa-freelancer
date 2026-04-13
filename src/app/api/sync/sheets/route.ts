import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { syncToGoogleSheets } from '@/lib/google-sheets/sync'
import { mesActual, rangoMes } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Obtener perfil con tokens de Google
  const { data: profile } = await supabase
    .from('profiles')
    .select('sheets_spreadsheet_id, sheets_token_data')
    .eq('id', user.id)
    .single()

  if (!profile?.sheets_spreadsheet_id || !profile?.sheets_token_data) {
    return NextResponse.json({ error: 'Google Sheets no configurado' }, { status: 400 })
  }

  const mes = mesActual()
  const { desde, hasta } = rangoMes(mes)

  // Obtener registros del mes actual
  const { data: registros, error: registrosError } = await supabase
    .from('registros_horas')
    .select('*, empresa:empresas(nombre), proyecto:proyectos(nombre)')
    .eq('user_id', user.id)
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha', { ascending: false })

  if (registrosError) {
    return NextResponse.json({ error: registrosError.message }, { status: 500 })
  }

  const records = (registros ?? []).map((r) => ({
    fecha: r.fecha,
    empresa_nombre: r.empresa?.nombre ?? '',
    proyecto_nombre: r.proyecto?.nombre ?? '',
    horas: r.horas,
    descripcion: r.descripcion,
  }))

  const result = await syncToGoogleSheets(
    profile.sheets_spreadsheet_id,
    profile.sheets_token_data as { access_token: string; refresh_token: string; expiry_date: number },
    records,
    mes
  )

  // Registrar en log
  await supabase.from('sync_log').insert({
    user_id: user.id,
    status: result.success ? 'success' : 'error',
    records_synced: result.records_synced,
    error_message: result.error ?? null,
  })

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true, records_synced: result.records_synced })
}

export async function GET() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data } = await supabase
    .from('sync_log')
    .select('*')
    .eq('user_id', user.id)
    .order('synced_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) {
    return NextResponse.json({ data: { last_sync: null, status: 'never', records_synced: 0, error_message: null } })
  }

  return NextResponse.json({
    data: {
      last_sync: data.synced_at,
      status: data.status,
      records_synced: data.records_synced,
      error_message: data.error_message,
    },
  })
}
