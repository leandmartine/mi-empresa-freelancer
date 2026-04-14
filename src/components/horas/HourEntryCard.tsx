'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Building2, FolderOpen, Pencil, Check, X, Plus, Minus } from 'lucide-react'
import { type RegistroHoras } from '@/types/app'
import { formatFecha, formatHoras } from '@/lib/utils'
import { useDeleteHora, useUpdateHora } from '@/hooks/useHoras'
import { useEmpresas } from '@/hooks/useEmpresas'
import { useProyectos } from '@/hooks/useProyectos'
import { haptic } from '@/lib/sounds'

interface Props {
  registro: RegistroHoras
}

export function HourEntryCard({ registro }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [horas, setHoras] = useState(registro.horas)
  const [editingHoras, setEditingHoras] = useState(false)
  const [horasInput, setHorasInput] = useState('')
  const [descripcion, setDescripcion] = useState(registro.descripcion ?? '')
  const [empresaId, setEmpresaId] = useState(registro.empresa_id ?? '')
  const [proyectoId, setProyectoId] = useState(registro.proyecto_id ?? '')
  const [fecha, setFecha] = useState(registro.fecha)
  const inputRef = useRef<HTMLInputElement>(null)

  const deleteHora = useDeleteHora()
  const updateHora = useUpdateHora()
  const { data: empresas = [] } = useEmpresas()
  const { data: proyectos = [] } = useProyectos(empresaId || undefined)

  async function handleDelete() {
    if (!confirmDelete) {
      haptic('light')
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    await deleteHora.mutateAsync(registro.id)
  }

  function startEdit() {
    setHoras(registro.horas)
    setDescripcion(registro.descripcion ?? '')
    setEmpresaId(registro.empresa_id ?? '')
    setProyectoId(registro.proyecto_id ?? '')
    setFecha(registro.fecha)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setEditingHoras(false)
  }

  async function saveEdit() {
    await updateHora.mutateAsync({
      id: registro.id,
      horas,
      fecha,
      descripcion: descripcion || null,
      empresa_id: empresaId || null,
      proyecto_id: proyectoId || null,
    })
    setEditing(false)
  }

  function adjustHoras(delta: number) {
    setHoras((h) => Math.round(Math.max(0.5, Math.min(24, h + delta)) * 2) / 2)
  }

  function startEditingHoras() {
    setHorasInput(String(horas))
    setEditingHoras(true)
    setTimeout(() => inputRef.current?.select(), 50)
  }

  function commitHorasEdit() {
    const parsed = parseFloat(horasInput.replace(',', '.'))
    if (!isNaN(parsed) && parsed > 0 && parsed <= 24) {
      setHoras(Math.round(parsed * 2) / 2)
    }
    setEditingHoras(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden"
    >
      {/* Vista normal */}
      <AnimatePresence mode="wait">
        {!editing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-1 min-h-[40px] rounded-full flex-shrink-0 mt-0.5 self-stretch"
                style={{ background: registro.empresa?.color ?? '#fbcfe8' }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {registro.empresa && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: registro.empresa.color + '15', color: registro.empresa.color }}
                    >
                      <Building2 className="w-3 h-3" />
                      {registro.empresa.nombre}
                    </span>
                  )}
                  {registro.proyecto && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: registro.proyecto.color + '15', color: registro.proyecto.color }}
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

              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <span className="text-xl font-bold text-pink-600">{formatHoras(registro.horas)}</span>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={startEdit}
                    className="p-1.5 rounded-lg text-pink-200 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleDelete}
                    disabled={deleteHora.isPending}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmDelete ? 'bg-rose-100 text-rose-500' : 'text-pink-200 hover:text-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {confirmDelete && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] text-rose-400"
                    >
                      Tap otra vez
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Vista de edición */
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-3 bg-pink-50/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Editando registro</span>
              <button onClick={cancelEdit} className="text-pink-300 hover:text-pink-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de horas */}
            <div className="bg-white rounded-xl p-3 flex items-center justify-center gap-4 border border-pink-100">
              <motion.button
                type="button" whileTap={{ scale: 0.85 }}
                onClick={() => adjustHoras(-0.5)}
                className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 border border-pink-100"
              >
                <Minus className="w-4 h-4" />
              </motion.button>

              <AnimatePresence mode="wait">
                {editingHoras ? (
                  <input
                    ref={inputRef}
                    type="number" min="0.5" max="24" step="0.5"
                    value={horasInput}
                    onChange={(e) => setHorasInput(e.target.value)}
                    onBlur={commitHorasEdit}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commitHorasEdit() }}
                    className="w-20 text-3xl font-bold text-pink-600 bg-transparent border-b-2 border-pink-400 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                ) : (
                  <button
                    type="button" onClick={startEditingHoras}
                    className="text-3xl font-bold text-pink-600 min-w-[60px] text-center cursor-text hover:text-pink-500 transition-colors"
                  >
                    {horas}h
                  </button>
                )}
              </AnimatePresence>

              <motion.button
                type="button" whileTap={{ scale: 0.85 }}
                onClick={() => adjustHoras(0.5)}
                className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 border border-pink-100"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Fecha */}
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full text-sm border border-pink-200 rounded-xl px-3 py-2 bg-white text-pink-800 focus:outline-none focus:border-pink-400"
            />

            {/* Empresa */}
            <select
              value={empresaId}
              onChange={(e) => { setEmpresaId(e.target.value); setProyectoId('') }}
              className="w-full text-sm border border-pink-200 rounded-xl px-3 py-2 bg-white text-pink-800 focus:outline-none focus:border-pink-400"
            >
              <option value="">Sin empresa</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>

            {/* Proyecto */}
            {proyectos.length > 0 && (
              <select
                value={proyectoId}
                onChange={(e) => setProyectoId(e.target.value)}
                className="w-full text-sm border border-pink-200 rounded-xl px-3 py-2 bg-white text-pink-800 focus:outline-none focus:border-pink-400"
              >
                <option value="">Sin proyecto</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            )}

            {/* Descripción */}
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción..."
              className="w-full text-sm border border-pink-200 rounded-xl px-3 py-2 bg-white text-pink-800 placeholder-pink-200 focus:outline-none focus:border-pink-400"
            />

            {/* Acciones */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={cancelEdit}
                className="flex-1 py-2 rounded-xl border border-pink-200 text-pink-400 text-sm font-medium hover:bg-pink-50 transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={saveEdit}
                disabled={updateHora.isPending}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 shadow-md shadow-pink-200/50"
              >
                <Check className="w-4 h-4" />
                {updateHora.isPending ? 'Guardando...' : 'Guardar'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
