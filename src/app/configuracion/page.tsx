'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/app/layout-app'
import { useAuth } from '@/providers/AuthProvider'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Settings, RefreshCw, ExternalLink, User, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatFechaCompleta } from '@/lib/utils'

function SyncStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['sync-status'],
    queryFn: async () => {
      const res = await fetch('/api/sync/sheets')
      const json = await res.json()
      return json.data
    },
    refetchInterval: 30000,
  })

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/sync/sheets', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json
    },
    onSuccess: (d) => toast.success(`Sincronizado: ${d.records_synced} registros 🌸`),
    onError: (err: Error) => toast.error(err.message),
  })

  const qc = useQueryClient()

  if (isLoading) return <div className="animate-pulse h-16 bg-pink-50 rounded-xl" />

  const status = data?.status ?? 'never'
  const statusColors = {
    success: 'text-emerald-500 bg-emerald-50',
    error: 'text-rose-500 bg-rose-50',
    pending: 'text-amber-500 bg-amber-50',
    never: 'text-pink-300 bg-pink-50',
  }

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-emerald-400' : status === 'error' ? 'bg-rose-400' : 'bg-pink-300'}`} />
        {status === 'never' && 'Nunca sincronizado'}
        {status === 'success' && `Último sync: ${data?.last_sync ? formatFechaCompleta(data.last_sync.split('T')[0]) : ''}`}
        {status === 'error' && `Error: ${data?.error_message}`}
        {status === 'pending' && 'Sincronizando...'}
      </div>
      <Button
        onClick={async () => {
          await syncMutation.mutateAsync()
          qc.invalidateQueries({ queryKey: ['sync-status'] })
        }}
        disabled={syncMutation.isPending}
        className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl h-10"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
        {syncMutation.isPending ? 'Sincronizando...' : 'Sincronizar ahora'}
      </Button>
    </div>
  )
}

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const supabase = getSupabaseClient()
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('sheets_spreadsheet_id, full_name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.sheets_spreadsheet_id) setSpreadsheetId(data.sheets_spreadsheet_id)
        if (data?.full_name) setFullName(data.full_name)
      })
  }, [user, supabase])

  async function saveSpreadsheet() {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, sheets_spreadsheet_id: spreadsheetId.trim(), full_name: fullName })
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Configuración guardada 🌸')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-5">
        {/* Perfil */}
        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-pink-400" />
            <h2 className="font-semibold text-pink-800">Mi perfil</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-pink-700">Nombre</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="mt-1 border-pink-200 rounded-xl bg-pink-50/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-pink-700">Email</label>
              <Input
                value={user?.email ?? ''}
                disabled
                className="mt-1 border-pink-100 rounded-xl bg-pink-50/30 text-pink-400"
              />
            </div>
          </div>
        </div>

        {/* Google Sheets */}
        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-pink-400" />
            <h2 className="font-semibold text-pink-800">Google Sheets</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-3 text-sm text-pink-600">
              <p className="font-medium mb-1">¿Cómo conectar?</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-pink-500">
                <li>Creá una nueva hoja en Google Sheets</li>
                <li>Copiá el ID de la URL (la parte entre /d/ y /edit)</li>
                <li>Pegalo acá abajo y guardá</li>
                <li>
                  <a
                    href="https://docs.google.com/spreadsheets"
                    target="_blank"
                    rel="noreferrer"
                    className="underline flex items-center gap-1 inline-flex"
                  >
                    Ir a Google Sheets <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ol>
            </div>

            <div>
              <label className="text-sm font-medium text-pink-700">ID de la hoja</label>
              <Input
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                className="mt-1 border-pink-200 rounded-xl bg-pink-50/50 font-mono text-sm"
              />
            </div>

            <Button
              onClick={saveSpreadsheet}
              disabled={saving}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl h-10"
            >
              {saving ? 'Guardando...' : 'Guardar configuración'}
            </Button>

            {spreadsheetId && <SyncStatus />}
          </div>
        </div>

        {/* Información */}
        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-pink-400" />
            <h2 className="font-semibold text-pink-800">Información futura</h2>
          </div>
          <div className="space-y-2 text-sm text-pink-400">
            <p>🔜 RUT personal (pendiente)</p>
            <p>🔜 Nombre de empresa (pendiente)</p>
            <p>🔜 Facturación electrónica (cuando tengas RUT)</p>
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-rose-200 text-rose-400 hover:bg-rose-50 rounded-xl h-10"
        >
          Cerrar sesión
        </Button>
      </div>
    </AppLayout>
  )
}
