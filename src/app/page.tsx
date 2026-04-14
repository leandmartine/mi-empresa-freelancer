'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const BYMIK_URL = process.env.NEXT_PUBLIC_BYMIK_URL ?? 'http://localhost:3001'

const PROJECTS = [
  {
    id: 'empresa',
    name: 'Mi Empresa',
    subtitle: 'Gestión de horas y proyectos',
    href: '/dashboard',
    external: false,
    bg: 'from-pink-400 to-rose-500',
    border: 'border-pink-200',
    accent: '#ec4899',
    preview: (
      <div className="absolute inset-0 flex flex-col gap-2 p-4 opacity-30">
        <div className="h-3 w-24 bg-pink-300 rounded-full" />
        <div className="h-2 w-36 bg-pink-200 rounded-full" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-pink-200 rounded-xl" />
          ))}
        </div>
        <div className="h-20 bg-pink-100 rounded-xl mt-1" />
      </div>
    ),
    icon: '🌸',
    textColor: 'text-pink-900',
    subtitleColor: 'text-pink-500',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-700',
  },
  {
    id: 'bymik',
    name: 'ByMik',
    subtitle: 'Gestión de pedidos y cosméticos',
    href: BYMIK_URL,
    external: true,
    bg: 'from-neutral-800 to-black',
    border: 'border-neutral-200',
    accent: '#0a0a0a',
    preview: (
      <div className="absolute inset-0 flex flex-col gap-2 p-4 opacity-20">
        <div className="h-3 w-16 bg-neutral-400 rounded-full" />
        <div className="h-2 w-28 bg-neutral-300 rounded-full" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-neutral-200 rounded-xl" />
          ))}
        </div>
        <div className="h-20 bg-neutral-100 rounded-xl mt-1" />
      </div>
    ),
    icon: '🖤',
    textColor: 'text-neutral-900',
    subtitleColor: 'text-neutral-500',
    badgeBg: 'bg-neutral-100',
    badgeText: 'text-neutral-600',
  },
]

export default function HubPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(project: typeof PROJECTS[0]) {
    setSelected(project.id)
    setTimeout(() => {
      if (project.external) {
        window.location.href = project.href
      } else {
        router.push(project.href)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
      {/* Flores decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🌸', '🖤', '✨', '💅', '🌷'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10 select-none"
            style={{ left: `${5 + i * 22}%`, top: `${8 + (i % 3) * 25}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 z-10"
      >
        <h1 className="text-3xl font-bold text-neutral-900">Panel de trabajo ✨</h1>
        <p className="text-neutral-400 mt-2">¿Con qué proyecto arrancamos hoy?</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-5 w-full max-w-2xl z-10">
        {PROJECTS.map((project, i) => (
          <motion.button
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            onClick={() => handleSelect(project)}
            disabled={selected !== null}
            className="relative flex-1 h-64 rounded-3xl border overflow-hidden cursor-pointer group text-left"
            style={{ borderColor: 'transparent' }}
            whileHover={{ scale: selected ? 1 : 1.02 }}
            whileTap={{ scale: selected ? 1 : 0.98 }}
          >
            {/* Fondo blanco base */}
            <div className="absolute inset-0 bg-white" />

            {/* Preview del app (visible en hover) */}
            <div className="absolute inset-0 overflow-hidden">
              {project.preview}
            </div>

            {/* Blur overlay — desaparece en hover para revelar preview */}
            <motion.div
              className="absolute inset-0 backdrop-blur-sm bg-white/70 group-hover:bg-white/10 group-hover:backdrop-blur-[2px] transition-all duration-500"
            />

            {/* Gradient de color en hover */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${project.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
            />

            {/* Border de color en hover */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-current transition-all duration-300"
              style={{ color: project.accent, opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />

            {/* Contenido */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <div className={`text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 origin-left`}>
                  {project.icon}
                </div>
                <h2 className={`text-xl font-bold ${project.textColor} leading-tight`}>{project.name}</h2>
                <p className={`text-sm ${project.subtitleColor} mt-1`}>{project.subtitle}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${project.badgeBg} ${project.badgeText}`}>
                  Abrir →
                </span>
              </div>
            </div>

            {/* Selección animada */}
            <AnimatePresence>
              {selected === project.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-br ${project.bg} flex items-center justify-center z-20 rounded-3xl`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="text-white text-5xl"
                  >
                    {project.icon}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

    </div>
  )
}
