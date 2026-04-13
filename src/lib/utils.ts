import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea horas como "3h 30m" o "1.5h" */
export function formatHoras(horas: number): string {
  const h = Math.floor(horas)
  const m = Math.round((horas - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** Fecha en formato legible "13 de abril" */
export function formatFecha(fecha: string): string {
  return format(parseISO(fecha), "d 'de' MMMM", { locale: es })
}

/** Fecha completa "lunes 13 de abril de 2026" */
export function formatFechaCompleta(fecha: string): string {
  return format(parseISO(fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
}

/** "abril 2026" */
export function formatMes(mesYYYYMM: string): string {
  const date = parseISO(`${mesYYYYMM}-01`)
  return format(date, "MMMM yyyy", { locale: es })
}

/** Hoy en formato YYYY-MM-DD */
export function hoy(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/** Mes actual en formato YYYY-MM */
export function mesActual(): string {
  return format(new Date(), 'yyyy-MM')
}

/** Primer y último día del mes */
export function rangoMes(mes: string): { desde: string; hasta: string } {
  const date = parseISO(`${mes}-01`)
  return {
    desde: format(startOfMonth(date), 'yyyy-MM-dd'),
    hasta: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

/** Colores sugeridos para empresas/proyectos */
export const COLORES_SUGERIDOS = [
  '#f472b6', // pink-400
  '#fb7185', // rose-400
  '#a78bfa', // violet-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#60a5fa', // blue-400
  '#f97316', // orange-400
  '#a3e635', // lime-400
]

/** Genera un color de texto contrastante para un fondo dado */
export function colorTexto(hexBg: string): string {
  const r = parseInt(hexBg.slice(1, 3), 16)
  const g = parseInt(hexBg.slice(3, 5), 16)
  const b = parseInt(hexBg.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#3f1728' : '#ffffff'
}

/** Iniciales de un nombre */
export function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
