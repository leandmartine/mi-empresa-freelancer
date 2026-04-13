'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type RegistroCreate, type RegistroUpdate, type RegistroHoras } from '@/types/app'
import { mesActual } from '@/lib/utils'
import { toast } from 'sonner'

async function fetchHoras(mes: string): Promise<RegistroHoras[]> {
  const res = await fetch(`/api/horas?mes=${mes}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data ?? null
}

export function useHoras(mes: string = mesActual()) {
  return useQuery({
    queryKey: ['horas', mes],
    queryFn: () => fetchHoras(mes),
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['horas'] })
      qc.invalidateQueries({ queryKey: ['metricas'] })
      toast.success('¡Horas registradas! 🌸')
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
      toast.success('Eliminado')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
