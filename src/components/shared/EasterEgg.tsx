'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

function randomPink() {
  const pinks = ['🌸', '🌺', '🌷', '💐', '✨', '🦋', '🎀', '💖', '💝', '🌹']
  return pinks[Math.floor(Math.random() * pinks.length)]
}

export function EasterEgg() {
  const [keys, setKeys] = useState<string[]>([])
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; emoji: string }>>([])
  const [message, setMessage] = useState(false)

  const triggerEasterEgg = useCallback(() => {
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      emoji: randomPink(),
    }))
    setConfetti(pieces)
    setMessage(true)
    setTimeout(() => {
      setConfetti([])
      setMessage(false)
    }, 4000)
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      setKeys((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length)
        if (next.join(',') === KONAMI.join(',')) {
          triggerEasterEgg()
          return []
        }
        return next
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [triggerEasterEgg])

  // Easter egg: triple tap en logo (mobile)
  useEffect(() => {
    let tapCount = 0
    let tapTimer: ReturnType<typeof setTimeout>

    function handleTripleTap(e: TouchEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-easter-egg]')) return
      tapCount++
      clearTimeout(tapTimer)
      tapTimer = setTimeout(() => { tapCount = 0 }, 500)
      if (tapCount >= 3) {
        triggerEasterEgg()
        tapCount = 0
      }
    }

    window.addEventListener('touchend', handleTripleTap)
    return () => window.removeEventListener('touchend', handleTripleTap)
  }, [triggerEasterEgg])

  return (
    <AnimatePresence>
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute text-2xl"
              style={{ left: `${piece.x}%`, top: '-5%' }}
              initial={{ y: '-10%', rotate: 0, opacity: 1 }}
              animate={{
                y: '110vh',
                rotate: Math.random() > 0.5 ? 360 : -360,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 1,
                ease: 'easeIn',
              }}
            >
              {piece.emoji}
            </motion.div>
          ))}

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-2xl shadow-pink-200 border border-pink-200 text-center"
            >
              <div className="text-4xl mb-2">🌸</div>
              <p className="text-pink-700 font-bold text-lg">¡Easter egg encontrado!</p>
              <p className="text-pink-400 text-sm mt-1">Sos una crack 💖</p>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
