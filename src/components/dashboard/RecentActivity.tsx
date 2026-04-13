'use client'

import { motion } from 'framer-motion'
import { useHoras } from '@/hooks/useHoras'
import { mesActual, formatFecha, formatHoras } from '@/lib/utils'
import { Clock, Building2 } from 'lucide-react'

export function RecentActivity() {
  const { data: registros = [], isLoading } = useHoras(mesActual())

  const recent = registros.slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl p-3 animate-pulse border border-pink-100 h-16" />
        ))}
      </div>
    )
  }

  if (recent.length === 0) {
    return (
      <div className="text-center py-8 text-pink-300">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Aún no hay registros este mes</p>
        <p className="text-xs mt-1">¡Agregá tus primeras horas! 🌸</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {recent.map((registro, i) => (
        <motion.div
          key={registro.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-xl p-3 border border-pink-100 flex items-center gap-3 shadow-sm"
        >
          {/* Color de empresa */}
          <div
            className="w-2 h-10 rounded-full flex-shrink-0"
            style={{ background: registro.empresa?.color ?? '#fbcfe8' }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {registro.empresa && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: registro.empresa.color + '20',
                    color: registro.empresa.color,
                  }}
                >
                  {registro.empresa.nombre}
                </span>
              )}
              {registro.proyecto && (
                <span className="text-xs text-pink-400">{registro.proyecto.nombre}</span>
              )}
            </div>
            <p className="text-xs text-pink-300 mt-0.5 truncate">
              {registro.descripcion || formatFecha(registro.fecha)}
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="font-bold text-pink-600">{formatHoras(registro.horas)}</p>
            <p className="text-xs text-pink-300">{formatFecha(registro.fecha)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
