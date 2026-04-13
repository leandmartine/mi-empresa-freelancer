'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Confetti engine (usado por easter egg y celebraciones) ───────────────────

const EMOJIS = ['🌸', '🌷', '💐', '🌺', '✨', '🦋', '🎀', '💖', '💝', '🌹', '⭐', '🎉']

interface ToastMessage {
  id: number
  title: string
  subtitle: string
}

// Singleton global para mostrar toasts de celebración desde cualquier lugar
let showCelebrationFn: ((title: string, subtitle: string) => void) | null = null

export function registerCelebration(fn: (title: string, subtitle: string) => void) {
  showCelebrationFn = fn
}

export function triggerConfetti(title: string, subtitle: string) {
  showCelebrationFn?.(title, subtitle)
}

// ─── Frases motivacionales ────────────────────────────────────────────────────

const FRASES_MOTIVACION = [
  { title: '¡Vas increíble! 🌟', subtitle: 'Cada hora que registrás es un paso más hacia tus metas.' },
  { title: '¡Crack total! 💪', subtitle: 'Mirá todo lo que lograste. Orgullosa de vos.' },
  { title: '¡Sigue así! 🌸', subtitle: 'El esfuerzo que ponés cada día vale muchísimo.' },
  { title: '¡Sos una máquina! ⚡', subtitle: 'Trabajás duro y se nota. Que orgullo.' },
  { title: '¡Tremenda! 🎀', subtitle: 'No cualquiera se anima a ser independiente. Vos sí.' },
  { title: '¡Lo estás rompiendo! 🔥', subtitle: 'Registrar tus horas es el primer paso al éxito.' },
  { title: '¡Que lideresa! 👑', subtitle: 'Tu constancia es lo que te hace destacar.' },
  { title: '¡Imparable! 🚀', subtitle: 'Cada día que usás esto, estás un paso adelante.' },
  { title: '¡Hermosa y exitosa! 💅', subtitle: 'Combinación perfecta. Seguí así.' },
  { title: '¡Orgullosa de vos! 💖', subtitle: 'Emprender sola no es fácil, y vos lo hacés con estilo.' },
]

export function randomMotivacion() {
  return FRASES_MOTIVACION[Math.floor(Math.random() * FRASES_MOTIVACION.length)]
}

// ─── Celebraciones por hitos ──────────────────────────────────────────────────

export function celebrarPrimeraHora() {
  triggerConfetti('¡Primera hora registrada! 🎉', '¡Arrancaste tu camino como freelancer! 🌸')
}

export function celebrarHito(totalHoras: number) {
  const hitos: Record<number, { title: string; subtitle: string }> = {
    10:  { title: '¡10 horas este mes! 🌟', subtitle: 'Arrancaste con todo. Seguí así.' },
    25:  { title: '¡25 horas! 💪', subtitle: 'Un cuarto de camino recorrido. ¡Imparable!' },
    50:  { title: '¡50 horas! 🔥', subtitle: 'La mitad del mes trabajada. ¡Sos una máquina!' },
    100: { title: '¡100 horas! 👑', subtitle: 'Triple dígito. Nivel: leyenda.' },
    160: { title: '¡160 horas! 🚀', subtitle: 'Mes completo de trabajo. Extraordinario.' },
  }
  const hito = hitos[Math.round(totalHoras)]
  if (hito) triggerConfetti(hito.title, hito.subtitle)
}

// ─── Componente principal (montar una sola vez en el layout) ─────────────────

export function CelebrationProvider() {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; emoji: string }>>([])

  const show = useCallback((title: string, subtitle: string) => {
    const id = Date.now()

    // Confetti
    const pieces = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }))
    setConfettiPieces(pieces)
    setTimeout(() => setConfettiPieces([]), 3500)

    // Toast
    setMessages((prev) => [...prev, { id, title, subtitle }])
    setTimeout(() => setMessages((prev) => prev.filter((m) => m.id !== id)), 4000)
  }, [])

  useEffect(() => {
    registerCelebration(show)
    return () => { showCelebrationFn = null }
  }, [show])

  // Motivación periódica: aparece 1 vez cada ~20 minutos si la app está abierta
  useEffect(() => {
    const INTERVAL = 20 * 60 * 1000
    const jitter = Math.random() * 5 * 60 * 1000 // ±5 min de variación
    const timer = setTimeout(() => {
      const frase = randomMotivacion()
      show(frase.title, frase.subtitle)
    }, INTERVAL + jitter)
    return () => clearTimeout(timer)
  }, [show])

  return (
    <>
      {/* Confetti */}
      <AnimatePresence>
        {confettiPieces.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute text-2xl select-none"
                style={{ left: `${piece.x}%`, top: '-5%' }}
                initial={{ y: '-10%', rotate: 0, opacity: 1 }}
                animate={{
                  y: '110vh',
                  rotate: Math.random() > 0.5 ? 360 : -360,
                  opacity: [1, 1, 1, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  delay: Math.random() * 0.8,
                  ease: 'easeIn',
                }}
              >
                {piece.emoji}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Toast de celebración */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl shadow-pink-200/60 border border-pink-100 text-center"
            >
              <p className="font-bold text-pink-800 text-base leading-tight">{msg.title}</p>
              <p className="text-pink-500 text-sm mt-0.5">{msg.subtitle}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
