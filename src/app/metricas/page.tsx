'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/app/layout-app'
import { useMetricas } from '@/hooks/useMetricas'
import { formatMes, mesActual, formatHoras } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Calendar } from 'lucide-react'
import { format, subMonths, addMonths, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

function MetricCard({ label, value, icon: Icon, color }: {
  label: string
  value: string
  icon: React.ElementType
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ background: color + '20' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs font-medium text-pink-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-pink-800">{value}</p>
    </motion.div>
  )
}

export default function MetricasPage() {
  const [mes, setMes] = useState(mesActual())
  const { data: metricas, isLoading } = useMetricas(mes)

  function prevMes() {
    setMes(format(subMonths(parseISO(`${mes}-01`), 1), 'yyyy-MM'))
  }
  function nextMes() {
    const next = format(addMonths(parseISO(`${mes}-01`), 1), 'yyyy-MM')
    if (next <= mesActual()) setMes(next)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Selector de mes */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4 flex items-center justify-between shadow-sm">
          <button onClick={prevMes} className="p-2 rounded-xl hover:bg-pink-50 text-pink-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="font-semibold text-pink-800 capitalize">{formatMes(mes)}</p>
          <button
            onClick={nextMes}
            disabled={mes >= mesActual()}
            className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-pink-100" />
            ))}
          </div>
        ) : !metricas || metricas.total_horas === 0 ? (
          <div className="text-center py-16 text-pink-300">
            <div className="text-5xl mb-3">📊</div>
            <p className="font-medium">Sin datos en {formatMes(mes)}</p>
          </div>
        ) : (
          <>
            {/* Cards de resumen */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard
                label="Total horas"
                value={formatHoras(metricas.total_horas)}
                icon={Clock}
                color="#ec4899"
              />
              <MetricCard
                label="Promedio/día"
                value={formatHoras(metricas.promedio_diario)}
                icon={TrendingUp}
                color="#fb7185"
              />
              <MetricCard
                label="Registros"
                value={String(metricas.num_registros)}
                icon={Calendar}
                color="#a78bfa"
              />
            </div>

            {/* Gráfico de barras por día */}
            {metricas.por_dia.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-pink-700 mb-4">Horas por día</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={metricas.por_dia} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="fecha"
                      tickFormatter={(v) => format(parseISO(v), 'd', { locale: es })}
                      tick={{ fontSize: 11, fill: '#f9a8d4' }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#f9a8d4' }} />
                    <Tooltip
                      formatter={(v: number) => [formatHoras(v), 'Horas']}
                      labelFormatter={(l) => format(parseISO(l as string), "d 'de' MMMM", { locale: es })}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #fbcfe8', fontSize: 12 }}
                    />
                    <Bar dataKey="total_horas" radius={[6, 6, 0, 0]}>
                      {metricas.por_dia.map((_, i) => (
                        <Cell key={i} fill={i % 2 === 0 ? '#f472b6' : '#fb7185'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Por empresa */}
            {metricas.por_empresa.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-pink-700 mb-3">Por empresa</h3>
                <div className="space-y-3">
                  {metricas.por_empresa.map((e) => {
                    const pct = Math.round((e.total_horas / metricas.total_horas) * 100)
                    return (
                      <div key={e.empresa_id}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: e.empresa_color }} />
                            <span className="text-sm font-medium text-pink-800">{e.empresa_nombre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-pink-400">{pct}%</span>
                            <span className="text-sm font-bold text-pink-600">{formatHoras(e.total_horas)}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-pink-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: e.empresa_color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Por proyecto */}
            {metricas.por_proyecto.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-pink-700 mb-3">Por proyecto</h3>
                <div className="space-y-2">
                  {metricas.por_proyecto.map((p) => (
                    <div key={p.proyecto_id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.proyecto_color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-pink-800 truncate">{p.proyecto_nombre}</p>
                        {p.empresa_nombre && (
                          <p className="text-xs text-pink-300 truncate">{p.empresa_nombre}</p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-pink-600 flex-shrink-0">{formatHoras(p.total_horas)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
