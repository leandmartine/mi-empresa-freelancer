'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/app/layout-app'
import { useProyectos, useCreateProyecto, useDeleteProyecto } from '@/hooks/useProyectos'
import { useEmpresas } from '@/hooks/useEmpresas'
import { COLORES_SUGERIDOS, cn } from '@/lib/utils'
import { Plus, Trash2, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProyectosPage() {
  const { data: proyectos = [], isLoading } = useProyectos()
  const { data: empresas = [] } = useEmpresas()
  const createProyecto = useCreateProyecto()
  const deleteProyecto = useDeleteProyecto()

  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState(COLORES_SUGERIDOS[1])
  const [empresaId, setEmpresaId] = useState('')
  const [descripcion, setDescripcion] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return
    await createProyecto.mutateAsync({
      nombre,
      color,
      empresa_id: empresaId || null,
      descripcion: descripcion || null,
    })
    setNombre('')
    setDescripcion('')
    setEmpresaId('')
    setColor(COLORES_SUGERIDOS[1])
    setShowForm(false)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center gap-3 bg-white rounded-2xl border border-pink-200 border-dashed p-4 text-pink-400 hover:border-pink-400 hover:text-pink-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Agregar proyecto</span>
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-pink-800">Nuevo proyecto 📁</h3>

                <div>
                  <label className="text-sm font-medium text-pink-700">Nombre *</label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del proyecto"
                    required
                    className="mt-1 border-pink-200 rounded-xl bg-pink-50/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-pink-700">Empresa (opcional)</label>
                  <Select onValueChange={setEmpresaId}>
                    <SelectTrigger className="mt-1 border-pink-200 rounded-xl bg-pink-50/50">
                      <SelectValue placeholder="Asociar a una empresa..." />
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

                <div>
                  <label className="text-sm font-medium text-pink-700">Descripción (opcional)</label>
                  <Input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="¿De qué trata este proyecto?"
                    className="mt-1 border-pink-200 rounded-xl bg-pink-50/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-pink-700">Color</label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {COLORES_SUGERIDOS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-transform',
                          color === c ? 'scale-125 ring-2 ring-offset-2 ring-pink-400' : 'hover:scale-110'
                        )}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-pink-200 text-pink-400 rounded-xl">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createProyecto.isPending} className="flex-1 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl">
                    Guardar
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-pink-100" />
            ))}
          </div>
        ) : proyectos.length === 0 ? (
          <div className="text-center py-16 text-pink-300">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No hay proyectos aún</p>
            <p className="text-sm mt-1">Agregá tu primer proyecto 👆</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {proyectos.map((proyecto, i) => (
                <motion.div
                  key={proyecto.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: proyecto.color + '20' }}
                  >
                    <FolderOpen className="w-5 h-5" style={{ color: proyecto.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-pink-800">{proyecto.nombre}</p>
                    {proyecto.empresa && (
                      <span
                        className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mt-1"
                        style={{ background: proyecto.empresa.color + '15', color: proyecto.empresa.color }}
                      >
                        {proyecto.empresa.nombre}
                      </span>
                    )}
                    {proyecto.descripcion && (
                      <p className="text-xs text-pink-400 mt-0.5 truncate">{proyecto.descripcion}</p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteProyecto.mutate(proyecto.id)}
                    className="p-2 text-pink-200 hover:text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
