'use client'

import { useState } from 'react'
import { AppLayout } from '@/app/layout-app'
import { QuickAddHours } from '@/components/dashboard/QuickAddHours'
import { MonthlySummary } from '@/components/dashboard/TodaySummary'
import { DailyNote } from '@/components/dashboard/DailyNote'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { mesActual, formatMes } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, subMonths, addMonths, parseISO } from 'date-fns'

export default function DashboardPage() {
  const [mes, setMes] = useState(mesActual())

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
        {/* Navegación de mes */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4 flex items-center justify-between shadow-sm">
          <button onClick={prevMes} className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="font-semibold text-pink-800 capitalize">{formatMes(mes)}</p>
          <button
            onClick={nextMes}
            disabled={mes >= mesActual()}
            className="p-2 rounded-xl hover:bg-pink-50 text-pink-400 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen del mes */}
        <MonthlySummary mes={mes} />

        {/* Acción principal */}
        <QuickAddHours />

        {/* Nota del día */}
        <DailyNote />

        {/* Actividad reciente */}
        <div>
          <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-3">
            Últimos registros
          </h2>
          <RecentActivity mes={mes} />
        </div>
      </div>
    </AppLayout>
  )
}
