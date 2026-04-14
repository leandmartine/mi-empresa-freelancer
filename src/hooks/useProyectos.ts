'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Proyecto, type ProyectoCreate } from '@/types/app'
import { toast } from 'sonner'
import { soundCreado, soundGuardado, soundEliminado } from '@/lib/sounds'

async function fetchProyectos(empresa_id?: string): Promise<Proyecto[]> {
  const url = empresa_id ? `/api/proyectos?empresa_id=${empresa_id}` : '/api/proyectos'
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data ?? null
}

export function useProyectos(empresa_id?: string) {
  return useQuery({
    queryKey: ['proyectos', empresa_id],
    queryFn: () => fetchProyectos(empresa_id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: ProyectoCreate) => {
      const res = await fetch('/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data as Proyecto
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      soundCreado()
      toast.success('Proyecto creado 📁')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...body }: Partial<ProyectoCreate> & { id: string }) => {
      const res = await fetch(`/api/proyectos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data as Proyecto
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      soundGuardado()
      toast.success('Proyecto actualizado ✨')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteProyecto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/proyectos/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      soundEliminado()
      toast.success('Proyecto eliminado')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
