'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EMOJIS = ['🌸', '🌷', '💐', '🌺', '✨', '🦋', '🎀', '💖', '💝', '🌹', '⭐', '🎉']

interface ToastMsg { id: number; title: string; subtitle: string }

// ─── Singletons globales ──────────────────────────────────────────────────────

let showCelebrationFn: ((t: string, s: string) => void) | null = null
let showMotivacionFn:  ((t: string, s: string) => void) | null = null

export function registerCelebration(fn: typeof showCelebrationFn) { showCelebrationFn = fn }
export function registerMotivacion(fn: typeof showMotivacionFn)   { showMotivacionFn  = fn }

/** Confetti + toast centrado — para hitos reales y easter egg */
export function triggerConfetti(title: string, subtitle: string) {
  showCelebrationFn?.(title, subtitle)
}

/** Toast sutil en esquina — para motivación periódica */
export function triggerMotivacion(title: string, subtitle: string) {
  showMotivacionFn?.(title, subtitle)
}

// ─── Frases motivacionales en rioplatense ─────────────────────────────────────

const FRASES_MOTIVACION = [
  { title: '¡Qué capa que sos! 💪',      subtitle: 'Mirá todo lo que estás logrando. Orgullo total.' },
  { title: '¡Bárbara! 🌟',               subtitle: 'Cada hora que registrás te acerca más a tus metas.' },
  { title: '¡Dale que va! 🚀',            subtitle: 'El esfuerzo que ponés todos los días vale un montón.' },
  { title: '¡Fenómena! ✨',              subtitle: 'No cualquiera se anima a trabajar de forma independiente. Vos sí.' },
  { title: '¡Sos una máquina! ⚡',       subtitle: 'Trabajás duro y se nota. Qué orgullo.' },
  { title: '¡Lo estás rompiendo! 🔥',    subtitle: 'Registrar tus horas es el primer paso al éxito.' },
  { title: '¡Qué lideresa! 👑',          subtitle: 'Tu constancia es lo que te hace destacar.' },
  { title: '¡Imparable! 🌸',             subtitle: 'Cada día que usás esto, vas un paso más adelante.' },
  { title: '¡Hermosa y exitosa! 💅',     subtitle: 'Combinación perfecta. Seguí así.' },
  { title: '¡Che, qué bien! 💖',         subtitle: 'Emprender sola no es fácil, y vos lo hacés con estilo.' },
  { title: '¡Buenísima! 🎀',             subtitle: 'Mirá vos todo lo que construiste. Un orgullo.' },
  { title: '¡Qué figura! 🌺',            subtitle: 'Independiente y con todo. Así se hace.' },
]

export function randomMotivacion() {
  return FRASES_MOTIVACION[Math.floor(Math.random() * FRASES_MOTIVACION.length)]
}

// ─── Celebraciones por hitos ──────────────────────────────────────────────────

export function celebrarPrimeraHora() {
  triggerConfetti('¡Primera hora registrada! 🎉', '¡Arrancaste tu camino como independiente! 🌸')
}

export function celebrarHito(totalHoras: number) {
  const hitos: Record<number, { title: string; subtitle: string }> = {
    10:  { title: '¡10 horas este mes! 🌟',  subtitle: 'Arrancaste con todo. ¡Dale que va!' },
    25:  { title: '¡25 horas! 💪',            subtitle: 'Un cuarto del camino. ¡Imparable, che!' },
    50:  { title: '¡50 horas! 🔥',            subtitle: 'Mitad de mes trabajada. ¡Sos una máquina!' },
    100: { title: '¡100 horas! 👑',           subtitle: 'Triple dígito. Nivel: leyenda uruguaya.' },
    160: { title: '¡160 horas! 🚀',           subtitle: 'Mes redondo. Qué fenómena.' },
  }
  const hito = hitos[Math.round(totalHoras)]
  if (hito) triggerConfetti(hito.title, hito.subtitle)
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CelebrationProvider() {
  const [celebrations, setCelebrations] = useState<ToastMsg[]>([])
  const [motivaciones, setMotivaciones]  = useState<ToastMsg[]>([])
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; emoji: string }>>([])

  // Celebración completa: confetti + toast centrado
  const showCelebration = useCallback((title: string, subtitle: string) => {
    const id = Date.now()
    const pieces = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }))
    setConfettiPieces(pieces)
    setTimeout(() => setConfettiPieces([]), 3500)
    setCelebrations((prev) => [...prev, { id, title, subtitle }])
    setTimeout(() => setCelebrations((prev) => prev.filter((m) => m.id !== id)), 4000)
  }, [])

  // Motivación suave: toast pequeño en esquina, sin confetti
  const showMotivacion = useCallback((title: string, subtitle: string) => {
    const id = Date.now()
    setMotivaciones((prev) => [...prev, { id, title, subtitle }])
    setTimeout(() => setMotivaciones((prev) => prev.filter((m) => m.id !== id)), 5000)
  }, [])

  useEffect(() => {
    registerCelebration(showCelebration)
    registerMotivacion(showMotivacion)
    return () => { showCelebrationFn = null; showMotivacionFn = null }
  }, [showCelebration, showMotivacion])

  // Motivación periódica cada ~20 min — solo toast suave, sin confetti
  useEffect(() => {
    const INTERVAL = 20 * 60 * 1000
    const jitter = Math.random() * 5 * 60 * 1000
    const timer = setTimeout(() => {
      const frase = randomMotivacion()
      showMotivacion(frase.title, frase.subtitle)
    }, INTERVAL + jitter)
    return () => clearTimeout(timer)
  }, [showMotivacion])

  return (
    <>
      {/* Confetti — solo para celebraciones reales */}
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

      {/* Toast centrado — celebraciones con confetti */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {celebrations.map((msg) => (
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

      {/* Toast esquina inferior derecha — motivación suave, no invasiva */}
      <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[9997] flex flex-col gap-2 max-w-[240px] pointer-events-none">
        <AnimatePresence>
          {motivaciones.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg shadow-pink-100/60 border border-pink-100"
            >
              <p className="font-semibold text-pink-800 text-sm leading-tight">{msg.title}</p>
              <p className="text-pink-400 text-xs mt-0.5 leading-snug">{msg.subtitle}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
