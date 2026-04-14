'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/app/layout-app'
import { useEmpresas, useCreateEmpresa, useDeleteEmpresa } from '@/hooks/useEmpresas'
import { COLORES_SUGERIDOS, cn } from '@/lib/utils'
import { Plus, Trash2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EmpresasPage() {
  const { data: empresas = [], isLoading } = useEmpresas()
  const createEmpresa = useCreateEmpresa()
  const deleteEmpresa = useDeleteEmpresa()

  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState(COLORES_SUGERIDOS[0])
  const [rut, setRut] = useState('')
  const [tarifa, setTarifa] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return
    await createEmpresa.mutateAsync({
      nombre,
      color,
      rut_empresa: rut || undefined,
      tarifa_por_hora: tarifa ? parseFloat(tarifa) : undefined,
    })
    setNombre('')
    setRut('')
    setTarifa('')
    setColor(COLORES_SUGERIDOS[0])
    setShowForm(false)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Botón agregar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center gap-3 bg-white rounded-2xl border border-pink-200 border-dashed p-4 text-pink-400 hover:border-pink-400 hover:text-pink-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Agregar empresa</span>
        </motion.button>

        {/* Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-pink-800">Nueva empresa 🏢</h3>

                <div>
                  <label className="text-sm font-medium text-pink-700">Nombre *</label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre de la empresa"
                    required
                    className="mt-1 border-pink-200 rounded-xl bg-pink-50/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-pink-700">RUT (opcional)</label>
                  <Input
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="12.345.678-9"
                    className="mt-1 border-pink-200 rounded-xl bg-pink-50/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-pink-700">Tarifa/hora (opcional)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tarifa}
                    onChange={(e) => setTarifa(e.target.value)}
                    placeholder="Tarifa/hora (opcional)"
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border-pink-200 text-pink-400 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createEmpresa.isPending}
                    className="flex-1 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-pink-100" />
            ))}
          </div>
        ) : empresas.length === 0 ? (
          <div className="text-center py-16 text-pink-300">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No hay empresas aún</p>
            <p className="text-sm mt-1">Agregá tu primer cliente 👆</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {empresas.map((empresa, i) => (
                <motion.div
                  key={empresa.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md"
                    style={{ background: empresa.color + '25' }}
                  >
                    <div className="w-5 h-5 rounded-full" style={{ background: empresa.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-pink-800">{empresa.nombre}</p>
                    {empresa.rut_empresa && (
                      <p className="text-xs text-pink-400 mt-0.5">RUT: {empresa.rut_empresa}</p>
                    )}
                    {empresa.tarifa_por_hora != null && empresa.tarifa_por_hora > 0 && (
                      <p className="text-xs text-pink-400 mt-0.5">${empresa.tarifa_por_hora}/h</p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteEmpresa.mutate(empresa.id)}
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
