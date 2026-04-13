'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Clock, BarChart2, Building2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/horas', label: 'Horas', icon: Clock },
  { href: '/metricas', label: 'Métricas', icon: BarChart2 },
  { href: '/empresas', label: 'Empresas', icon: Building2 },
  { href: '/configuracion', label: 'Config', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/90 backdrop-blur-md border-t border-pink-100 shadow-lg shadow-pink-100/50">
        <div className="flex items-center justify-around px-2 pb-safe">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 py-3 px-3 min-w-[60px] relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    'p-1.5 rounded-xl transition-colors',
                    isActive ? 'bg-pink-100' : ''
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-pink-500' : 'text-pink-300'
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-pink-600' : 'text-pink-300'
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
