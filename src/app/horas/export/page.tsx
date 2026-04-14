'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useHoras } from '@/hooks/useHoras'
import { mesActual, formatHoras, formatMes } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

function ExportContent() {
  const searchParams = useSearchParams()
  const mes = searchParams.get('mes') ?? mesActual()
  const { data: registros = [], isLoading } = useHoras(mes)

  const totalMes = registros.reduce((acc, r) => acc + r.horas, 0)

  // Totales por empresa
  const porEmpresa = registros.reduce((acc, r) => {
    const key = r.empresa_id ?? '__sin_empresa__'
    const nombre = r.empresa?.nombre ?? 'Sin empresa'
    if (!acc[key]) acc[key] = { nombre, total: 0 }
    acc[key].total += r.horas
    return acc
  }, {} as Record<string, { nombre: string; total: number }>)

  if (isLoading) {
    return (
      <div className="p-8 text-center text-pink-400">Cargando registros...</div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pink-900">Registro de Horas</h1>
          <p className="text-pink-500 capitalize mt-1">{formatMes(mes)}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl text-sm font-medium shadow-md shadow-pink-200/50"
        >
          Imprimir / PDF
        </button>
      </div>

      {/* Resumen */}
      <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
        <p className="text-sm font-semibold text-pink-700 mb-3">Resumen por empresa</p>
        <div className="space-y-2">
          {Object.entries(porEmpresa).map(([key, { nombre, total }]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-pink-800">{nombre}</span>
              <span className="font-bold text-pink-600">{formatHoras(total)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm font-bold border-t border-pink-200 mt-3 pt-3">
          <span className="text-pink-900">Total del mes</span>
          <span className="text-pink-600">{formatHoras(totalMes)}</span>
        </div>
      </div>

      {/* Tabla de registros */}
      {registros.length === 0 ? (
        <div className="text-center py-12 text-pink-300">
          <p>No hay registros para este mes</p>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-pink-700 mb-3">Detalle de registros</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-pink-200">
                <th className="text-left py-2 px-3 text-pink-600 font-semibold">Fecha</th>
                <th className="text-left py-2 px-3 text-pink-600 font-semibold">Empresa</th>
                <th className="text-left py-2 px-3 text-pink-600 font-semibold">Proyecto</th>
                <th className="text-left py-2 px-3 text-pink-600 font-semibold">Descripción</th>
                <th className="text-right py-2 px-3 text-pink-600 font-semibold">Horas</th>
              </tr>
            </thead>
            <tbody>
              {[...registros]
                .sort((a, b) => a.fecha.localeCompare(b.fecha))
                .map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-pink-100 ${i % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'}`}
                  >
                    <td className="py-2 px-3 text-pink-700">
                      {format(parseISO(r.fecha), "d MMM", { locale: es })}
                    </td>
                    <td className="py-2 px-3 text-pink-800">{r.empresa?.nombre ?? '—'}</td>
                    <td className="py-2 px-3 text-pink-600">{r.proyecto?.nombre ?? '—'}</td>
                    <td className="py-2 px-3 text-pink-500 max-w-[200px] truncate">{r.descripcion ?? '—'}</td>
                    <td className="py-2 px-3 text-right font-bold text-pink-600">{formatHoras(r.horas)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-pink-200">
                <td colSpan={4} className="py-2 px-3 font-bold text-pink-900">Total</td>
                <td className="py-2 px-3 text-right font-bold text-pink-600">{formatHoras(totalMes)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <p className="text-xs text-pink-300 text-center no-print">
        Generado con Mi Empresa 🌸
      </p>
    </div>
  )
}

export default function ExportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="p-8 text-center text-pink-400">Cargando...</div>}>
        <ExportContent />
      </Suspense>
    </div>
  )
}
