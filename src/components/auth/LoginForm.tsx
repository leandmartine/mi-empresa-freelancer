'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { soundBienvenida } from '@/lib/sounds'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Dev bypass: cuenta de prueba hardcodeada
    if (
      process.env.NODE_ENV === 'development' &&
      email === 'mikagonz@gmail.com' &&
      password === '12345678'
    ) {
      document.cookie = 'dev-auth=true; path=/; max-age=86400'
      soundBienvenida()
      toast.success('¡Bienvenida Mika! 🌸')
      router.push('/dashboard')
      router.refresh()
      return
    }

    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos 💔')
      setShakeKey((k) => k + 1)
      setLoading(false)
      return
    }

    soundBienvenida()
    toast.success('¡Bienvenida! 🌸')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4">
      {/* Flores decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🌸', '🌷', '💐', '🌺', '✨'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${10 + i * 20}%`,
              top: `${5 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-200/50 p-8 border border-pink-100">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-lg shadow-pink-300/50 mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-pink-900">Mi Empresa</h1>
            <p className="text-pink-400 text-sm mt-1">Tu espacio de trabajo ✨</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-pink-800" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={loading}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-300 rounded-xl bg-pink-50/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-pink-800" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-300 rounded-xl bg-pink-50/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  key={shakeKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full rounded-xl h-12 text-base font-medium transition-all',
                'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600',
                'shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60',
                'text-white'
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Entrar <span>🌸</span>
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-pink-300 mt-6">
            Tu espacio seguro y privado 🔒
          </p>
        </div>
      </motion.div>
    </div>
  )
}
