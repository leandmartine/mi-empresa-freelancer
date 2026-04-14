'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Minus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useCreateHora } from '@/hooks/useHoras'
import { useEmpresas } from '@/hooks/useEmpresas'
import { useProyectos } from '@/hooks/useProyectos'
import { hoy, cn } from '@/lib/utils'
import { haptic } from '@/lib/sounds'

const schema = z.object({
  fecha: z.string(),
  horas: z.number().min(0.5).max(24),
  empresa_id: z.string().optional(),
  proyecto_id: z.string().optional(),
  descripcion: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function QuickAddHours() {
  const [open, setOpen] = useState(false)
  const [editingHoras, setEditingHoras] = useState(false)
  const [horasInput, setHorasInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: empresas = [] } = useEmpresas()
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('')
  const { data: proyectos = [] } = useProyectos(selectedEmpresa || undefined)
  const createHora = useCreateHora()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fecha: hoy(), horas: 1 },
  })

  const horas = watch('horas')

  function adjustHoras(delta: number) {
    const newVal = Math.max(0.5, Math.min(24, (horas ?? 1) + delta))
    setValue('horas', Math.round(newVal * 2) / 2)
  }

  function startEditing() {
    setHorasInput(String(horas ?? 1))
    setEditingHoras(true)
    setTimeout(() => {
      inputRef.current?.select()
    }, 50)
  }

  function commitEdit() {
    const parsed = parseFloat(horasInput.replace(',', '.'))
    if (!isNaN(parsed) && parsed > 0 && parsed <= 24) {
      setValue('horas', Math.round(parsed * 2) / 2)
    }
    setEditingHoras(false)
  }

  function handleInputKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingHoras(false)
  }

  async function onSubmit(data: FormData) {
    await createHora.mutateAsync({
      ...data,
      empresa_id: data.empresa_id || null,
      proyecto_id: data.proyecto_id || null,
    })
    haptic('medium')
    reset({ fecha: hoy(), horas: 1 })
    setSelectedEmpresa('')
    setOpen(false)
  }

  return (
    <>
      {/* Botón principal */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-pink-300/40"
      >
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Plus className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-semibold">Agregar horas</p>
          <p className="text-pink-100 text-sm">Registrar tiempo trabajado</p>
        </div>
      </motion.button>

      {/* Modal / Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />

            {/* Sheet desde abajo en mobile, modal centrado en desktop */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
            >
              <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl shadow-pink-200/50 border border-pink-100">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 md:hidden">
                  <div className="w-12 h-1 bg-pink-200 rounded-full" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-pink-900">Registrar horas ⏱️</h2>
                    <button onClick={() => setOpen(false)} className="text-pink-300 hover:text-pink-500">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Selector de horas grande y táctil */}
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 text-center">
                      <label className="text-xs font-medium text-pink-500 uppercase tracking-wide">Horas trabajadas</label>
                      <div className="flex items-center justify-center gap-6 mt-3">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.85 }}
                          onClick={() => adjustHoras(-0.5)}
                          className="w-12 h-12 bg-white rounded-2xl shadow-md shadow-pink-200/50 flex items-center justify-center text-pink-500 border border-pink-100"
                        >
                          <Minus className="w-5 h-5" />
                        </motion.button>

                        <AnimatePresence mode="wait">
                          {editingHoras ? (
                            <motion.div
                              key="input"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              className="flex items-baseline gap-1 min-w-[80px] justify-center"
                            >
                              <input
                                ref={inputRef}
                                type="number"
                                min="0.5"
                                max="24"
                                step="0.5"
                                value={horasInput}
                                onChange={(e) => setHorasInput(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={handleInputKey}
                                className="w-24 text-5xl font-bold text-pink-600 bg-transparent border-b-2 border-pink-400 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="text-xl font-normal text-pink-400">h</span>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="display"
                              type="button"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={startEditing}
                              title="Tocá para editar"
                              className="flex items-baseline gap-1 min-w-[80px] justify-center cursor-text group"
                            >
                              <span className="text-5xl font-bold text-pink-600 group-hover:text-pink-500 transition-colors">
                                {horas}
                              </span>
                              <span className="text-xl font-normal text-pink-400">h</span>
                            </motion.button>
                          )}
                        </AnimatePresence>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.85 }}
                          onClick={() => adjustHoras(0.5)}
                          className="w-12 h-12 bg-white rounded-2xl shadow-md shadow-pink-200/50 flex items-center justify-center text-pink-500 border border-pink-100"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Fecha */}
                    <div>
                      <label className="text-sm font-medium text-pink-800">Fecha</label>
                      <Input
                        type="date"
                        {...register('fecha')}
                        className="mt-1 border-pink-200 focus:border-pink-400 rounded-xl bg-pink-50/50"
                      />
                    </div>

                    {/* Empresa */}
                    <div>
                      <label className="text-sm font-medium text-pink-800">Empresa</label>
                      <Select
                        onValueChange={(v) => {
                          setValue('empresa_id', v)
                          setSelectedEmpresa(v)
                          setValue('proyecto_id', undefined)
                        }}
                      >
                        <SelectTrigger className="mt-1 border-pink-200 rounded-xl bg-pink-50/50">
                          <SelectValue placeholder="Seleccionar empresa..." />
                        </SelectTrigger>
                        <SelectContent>
                          {empresas.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ background: e.color }} />
                                {e.nombre}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Proyecto */}
                    {proyectos.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-pink-800">Proyecto</label>
                        <Select onValueChange={(v) => setValue('proyecto_id', v)}>
                          <SelectTrigger className="mt-1 border-pink-200 rounded-xl bg-pink-50/50">
                            <SelectValue placeholder="Seleccionar proyecto..." />
                          </SelectTrigger>
                          <SelectContent>
                            {proyectos.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                                  {p.nombre}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Descripción */}
                    <div>
                      <label className="text-sm font-medium text-pink-800">Nota del día</label>
                      <Input
                        {...register('descripcion')}
                        placeholder="¿Qué hiciste hoy? 💭"
                        className="mt-1 border-pink-200 focus:border-pink-400 rounded-xl bg-pink-50/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createHora.isPending}
                      className={cn(
                        'w-full rounded-xl h-12 bg-gradient-to-r from-pink-400 to-rose-500',
                        'hover:from-pink-500 hover:to-rose-600 text-white font-medium',
                        'shadow-lg shadow-pink-300/40'
                      )}
                    >
                      {createHora.isPending ? 'Guardando...' : 'Guardar horas 🌸'}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
