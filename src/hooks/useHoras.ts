'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type RegistroCreate, type RegistroUpdate, type RegistroHoras } from '@/types/app'
import { mesActual } from '@/lib/utils'
import { toast } from 'sonner'
import { celebrarPrimeraHora, celebrarHito, randomMotivacion, triggerMotivacion } from '@/components/shared/Celebrations'
import { soundHorasOk, soundGuardado, soundEliminado, soundCelebracion } from '@/lib/sounds'

async function fetchHoras(mes: string, empresa_id?: string, proyecto_id?: string): Promise<RegistroHoras[]> {
  const params = new URLSearchParams({ mes })
  if (empresa_id) params.set('empresa_id', empresa_id)
  if (proyecto_id) params.set('proyecto_id', proyecto_id)
  const res = await fetch(`/api/horas?${params.toString()}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data ?? null
}

export function useHoras(mes: string = mesActual(), empresa_id?: string, proyecto_id?: string) {
  return useQuery({
    queryKey: ['horas', mes, empresa_id, proyecto_id],
    queryFn: () => fetchHoras(mes, empresa_id, proyecto_id),
    staleTime: 0,
  })
}

export function useCreateHora() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: RegistroCreate) => {
      const res = await fetch('/api/horas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data as RegistroHoras
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['horas'] })
      await qc.invalidateQueries({ queryKey: ['metricas'] })

      // Obtener registros actuales del mes para calcular hitos
      const registros: RegistroHoras[] | undefined = qc.getQueryData(['horas', mesActual()])
      const total = (registros ?? []).reduce((acc, r) => acc + r.horas, 0)
      const count = (registros ?? []).length

      if (count === 1) {
        // Primera hora de la cuenta (real, no mock)
        soundCelebracion()
        celebrarPrimeraHora()
      } else {
        soundHorasOk()
        // Verificar hitos de horas
        celebrarHito(Math.round(total))

        // 1 de cada 4 veces, mostrar una frase motivacional sorpresa
        if (Math.random() < 0.25) {
          setTimeout(() => {
            const frase = randomMotivacion()
            triggerMotivacion(frase.title, frase.subtitle)
          }, 1200)
        }
      }
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUpdateHora() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...body }: RegistroUpdate & { id: string }) => {
      const res = await fetch(`/api/horas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data as RegistroHoras
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['horas'] })
      qc.invalidateQueries({ queryKey: ['metricas'] })
      soundGuardado()
      toast.success('Actualizado ✨')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteHora() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/horas/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['horas'] })
      qc.invalidateQueries({ queryKey: ['metricas'] })
      soundEliminado()
      toast.success('Eliminado')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
