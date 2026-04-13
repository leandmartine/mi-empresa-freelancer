'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Clock, BarChart2, Building2,
  Settings, LogOut, Sparkles, FolderOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/horas', label: 'Mis Horas', icon: Clock },
  { href: '/metricas', label: 'Métricas', icon: BarChart2 },
  { href: '/empresas', label: 'Empresas', icon: Building2 },
  { href: '/proyectos', label: 'Proyectos', icon: FolderOpen },
  { href: '/configuracion', label: 'Configuración', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('¡Hasta luego! 👋')
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-pink-100 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-pink-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-pink-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-pink-900 text-sm leading-tight">Mi Empresa</h1>
            <p className="text-pink-400 text-xs">Panel de trabajo</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 shadow-sm'
                    : 'text-pink-400 hover:bg-pink-50 hover:text-pink-600'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-pink-500' : '')} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 bg-pink-400 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-pink-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-pink-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
    </aside>
  )
}
