import { AppLayout } from '@/app/layout-app'
import { QuickAddHours } from '@/components/dashboard/QuickAddHours'
import { TodaySummary } from '@/components/dashboard/TodaySummary'
import { DailyNote } from '@/components/dashboard/DailyNote'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Resumen del día */}
        <TodaySummary />

        {/* Acción principal */}
        <QuickAddHours />

        {/* Nota del día */}
        <DailyNote />

        {/* Actividad reciente */}
        <div>
          <h2 className="text-sm font-semibold text-pink-500 uppercase tracking-wide mb-3">
            Últimos registros
          </h2>
          <RecentActivity />
        </div>
      </div>
    </AppLayout>
  )
}
