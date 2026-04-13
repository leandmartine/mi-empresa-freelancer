'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Building2, FolderOpen } from 'lucide-react'
import { type RegistroHoras } from '@/types/app'
import { formatFecha, formatHoras } from '@/lib/utils'
import { useDeleteHora } from '@/hooks/useHoras'

interface Props {
  registro: RegistroHoras
}

export function HourEntryCard({ registro }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteHora = useDeleteHora()

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    await deleteHora.mutateAsync(registro.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Barra de color */}
        <div
          className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0 mt-0.5"
          style={{ background: registro.empresa?.color ?? '#fbcfe8' }}
        />

        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {registro.empresa && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: registro.empresa.color + '15',
                  color: registro.empresa.color,
                }}
              >
                <Building2 className="w-3 h-3" />
                {registro.empresa.nombre}
              </span>
            )}
            {registro.proyecto && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: registro.proyecto.color + '15',
                  color: registro.proyecto.color,
                }}
              >
                <FolderOpen className="w-3 h-3" />
                {registro.proyecto.nombre}
              </span>
            )}
          </div>

          {registro.descripcion && (
            <p className="text-sm text-pink-700 leading-relaxed">{registro.descripcion}</p>
          )}

          <p className="text-xs text-pink-300 mt-1">{formatFecha(registro.fecha)}</p>
        </div>

        {/* Horas + eliminar */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className="text-xl font-bold text-pink-600">{formatHoras(registro.horas)}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleDelete}
            disabled={deleteHora.isPending}
            className={`p-1.5 rounded-lg transition-colors ${
              confirmDelete
                ? 'bg-rose-100 text-rose-500'
                : 'text-pink-200 hover:text-rose-400 hover:bg-rose-50'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          <AnimatePresence>
            {confirmDelete && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-rose-400 text-right"
              >
                Tap otra vez
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
