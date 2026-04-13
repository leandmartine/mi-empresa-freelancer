'use client'

import { useQuery } from '@tanstack/react-query'
import { type MetricasMensuales } from '@/types/app'
import { mesActual } from '@/lib/utils'

async function fetchMetricas(mes: string): Promise<MetricasMensuales> {
  const res = await fetch(`/api/metricas?mes=${mes}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data
}

export function useMetricas(mes: string = mesActual()) {
  return useQuery({
    queryKey: ['metricas', mes],
    queryFn: () => fetchMetricas(mes),
    staleTime: 0,
  })
}
