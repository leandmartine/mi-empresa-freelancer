'use client'

import { motion } from 'framer-motion'
import { useHoras } from '@/hooks/useHoras'
import { mesActual, hoy, formatHoras } from '@/lib/utils'
import { Clock, TrendingUp } from 'lucide-react'

interface Props {
  mes?: string
}

export function TodaySummary() {
  return <MonthlySummary mes={mesActual()} />
}

export function MonthlySummary({ mes = mesActual() }: Props) {
  const { data: registros = [], isLoading } = useHoras(mes)

  const hoyStr = hoy()
  const registrosHoy = registros.filter((r) => r.fecha === hoyStr)
  const horasHoy = registrosHoy.reduce((acc, r) => acc + r.horas, 0)
  const horasMes = registros.reduce((acc, r) => acc + r.horas, 0)
  const isCurrentMonth = mes === mesActual()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-pink-100 h-24" />
        ))}
      </div>
    )
  }

  if (horasMes === 0 && !isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-4 text-white shadow-lg shadow-pink-300/30 col-span-2"
        >
          <p className="text-pink-100 text-sm mb-1">No hay registros en este mes. ¡Agregá tus horas! ✨</p>
          <p className="text-lg font-bold">0h</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Horas hoy (solo si es el mes actual) */}
      {isCurrentMonth ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-4 text-white shadow-lg shadow-pink-300/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-pink-100" />
            <span className="text-xs font-medium text-pink-100">Hoy</span>
          </div>
          <motion.p
            key={horasHoy}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
          >
            {horasHoy > 0 ? formatHoras(horasHoy) : '—'}
          </motion.p>
          <p className="text-pink-100 text-xs mt-1">
            {registrosHoy.length} {registrosHoy.length === 1 ? 'registro' : 'registros'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-4 text-white shadow-lg shadow-pink-300/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-pink-100" />
            <span className="text-xs font-medium text-pink-100">Registros</span>
          </div>
          <motion.p
            key={registros.length}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
          >
            {registros.length}
          </motion.p>
          <p className="text-pink-100 text-xs mt-1">en el mes</p>
        </motion.div>
      )}

      {/* Horas del mes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-medium text-pink-400">
            {isCurrentMonth ? 'Este mes' : 'Total mes'}
          </span>
        </div>
        <motion.p
          key={horasMes}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-pink-700"
        >
          {horasMes > 0 ? formatHoras(horasMes) : '—'}
        </motion.p>
        <p className="text-pink-300 text-xs mt-1">
          {registros.length} {registros.length === 1 ? 'registro' : 'registros'}
        </p>
      </motion.div>
    </div>
  )
}
