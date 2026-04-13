'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/app/layout-app'
import { HourEntryCard } from '@/components/horas/HourEntryCard'
import { QuickAddHours } from '@/components/dashboard/QuickAddHours'
import { useHoras } from '@/hooks/useHoras'
import { formatMes, mesActual, formatHoras } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, subMonths, addMonths, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export default function HorasPage() {
  const [mes, setMes] = useState(mesActual())
  const { data: registros = [], isLoading } = useHoras(mes)

  // Agrupar por día
  const grouped = registros.reduce((acc, r) => {
    if (!acc[r.fecha]) acc[r.fecha] = []
    acc[r.fecha].push(r)
    return acc
  }, {} as Record<string, typeof registros>)

  const diasOrdenados = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
  const totalMes = registros.reduce((acc, r) => acc + r.horas, 0)

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
          <button onClick={prevMes} className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-pink-800 capitalize">{formatMes(mes)}</p>
            <p className="text-sm text-pink-400">{formatHoras(totalMes)} registradas</p>
          </div>
          <button
            onClick={nextMes}
            disabled={mes >= mesActual()}
            className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Agregar horas */}
        <QuickAddHours />

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-pink-100" />
            ))}
          </div>
        ) : diasOrdenados.length === 0 ? (
          <div className="text-center py-16 text-pink-300">
            <div className="text-5xl mb-3">🌸</div>
            <p className="font-medium">No hay registros en {formatMes(mes)}</p>
            <p className="text-sm mt-1">Agregá tus primeras horas ↑</p>
          </div>
        ) : (
          <AnimatePresence>
            {diasOrdenados.map((fecha) => {
              const dayRegistros = grouped[fecha]
              const dayTotal = dayRegistros.reduce((acc, r) => acc + r.horas, 0)
              const dayLabel = format(parseISO(fecha), "EEEE d 'de' MMMM", { locale: es })

              return (
                <div key={fecha} className="space-y-2">
                  {/* Encabezado del día */}
                  <div className="flex items-center justify-between px-1">
                    <p className="text-sm font-semibold text-pink-600 capitalize">{dayLabel}</p>
                    <span className="text-sm font-bold text-pink-500">{formatHoras(dayTotal)}</span>
                  </div>

                  {dayRegistros.map((r) => (
                    <HourEntryCard key={r.id} registro={r} />
                  ))}
                </div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  )
}
