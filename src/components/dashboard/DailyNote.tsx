'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoy } from '@/lib/utils'
import { Pencil, Check } from 'lucide-react'

export function DailyNote() {
  const qc = useQueryClient()
  const fecha = hoy()
  const [texto, setTexto] = useState('')
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()

  const { data } = useQuery({
    queryKey: ['nota', fecha],
    queryFn: async () => {
      const res = await fetch(`/api/notas?fecha=${fecha}`)
      const json = await res.json()
      return json.data
    },
  })

  useEffect(() => {
    if (data?.contenido) setTexto(data.contenido)
  }, [data])

  const saveMutation = useMutation({
    mutationFn: async (contenido: string) => {
      const res = await fetch('/api/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, contenido }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nota', fecha] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTexto(e.target.value)
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (e.target.value.trim()) {
        saveMutation.mutate(e.target.value)
      }
    }, 1000)
  }

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-pink-800">Nota del día</span>
        </div>
        <motion.div
          animate={{ opacity: saved ? 1 : 0, scale: saved ? 1 : 0.8 }}
          className="flex items-center gap-1 text-xs text-emerald-500"
        >
          <Check className="w-3 h-3" />
          Guardado
        </motion.div>
      </div>
      <textarea
        value={texto}
        onChange={handleChange}
        placeholder="¿Cómo fue el día? ¿Qué lograste? ¿Alguna idea? 💭"
        className="w-full px-4 pb-4 text-sm text-pink-800 placeholder-pink-200 resize-none focus:outline-none bg-transparent"
        rows={4}
      />
    </div>
  )
}
