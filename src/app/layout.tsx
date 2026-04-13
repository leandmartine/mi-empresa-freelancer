import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { CelebrationProvider } from '@/components/shared/Celebrations'
import { EasterEgg } from '@/components/shared/EasterEgg'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})


export const metadata: Metadata = {
  title: 'Mi Empresa 🌸',
  description: 'Gestión de horas y proyectos para trabajadoras independientes',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mi Empresa',
  },
}

export const viewport: Viewport = {
  themeColor: '#ec4899',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <AuthProvider>
          <QueryProvider>
            {children}
            <CelebrationProvider />
            <EasterEgg />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#fff',
                  border: '1px solid #fbcfe8',
                  color: '#3f1728',
                },
              }}
            />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
