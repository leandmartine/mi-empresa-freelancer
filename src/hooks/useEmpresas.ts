'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Empresa, type EmpresaCreate } from '@/types/app'
import { toast } from 'sonner'
import { soundCreado, soundGuardado, soundEliminado } from '@/lib/sounds'

async function fetchEmpresas(): Promise<Empresa[]> {
  const res = await fetch('/api/empresas')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data ?? null
}

export function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: fetchEmpresas,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateEmpresa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: EmpresaCreate) => {
      const res = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data as Empresa
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empresas'] })
      soundCreado()
      toast.success('Empresa agregada 🏢')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateEmpresa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...body }: Partial<EmpresaCreate> & { id: string }) => {
      const res = await fetch(`/api/empresas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data as Empresa
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empresas'] })
      soundGuardado()
      toast.success('Empresa actualizada ✨')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteEmpresa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/empresas/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empresas'] })
      soundEliminado()
      toast.success('Empresa eliminada')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
