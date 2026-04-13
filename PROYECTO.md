# 🌸 Mi Empresa — Sistema de Gestión Independiente

## ¿Qué es esto?
Panel de autogestión para una trabajadora independiente.
Permite registrar horas por empresa/proyecto, ver métricas mensuales,
escribir notas diarias y sincronizar todo automáticamente con Google Sheets.

---

## Stack tecnológico

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Framework | Next.js 14 (App Router) | SSR + API Routes en un solo repo |
| Estilos | Tailwind CSS v4 | Rápido, responsive, sin boilerplate |
| Animaciones | Framer Motion | Suaves, táctiles, amigables |
| Componentes | Shadcn/ui | Accesibles y personalizables |
| Base de datos | Supabase (PostgreSQL) | Gratis, Auth incluida, RLS |
| Data fetching | TanStack Query | Cache automático, mutaciones optimistas |
| Formularios | React Hook Form + Zod | Validación simple y tipada |
| Gráficos | Recharts | Liviano y responsive |
| Backup | Google Sheets API | Sync automático post-registro |
| Deploy | Vercel (free tier) | URL gratuita tipo proyecto.vercel.app |

---

## Arquitectura de carpetas

```
src/
├── app/
│   ├── layout.tsx              # Root layout con providers
│   ├── page.tsx                # Redirect → /dashboard
│   ├── login/                  # Página de login
│   ├── dashboard/              # Pantalla principal
│   ├── horas/                  # Listado y gestión de horas
│   ├── metricas/               # Gráficos y estadísticas
│   ├── empresas/               # CRUD de empresas/clientes
│   ├── proyectos/              # CRUD de proyectos
│   ├── configuracion/          # Perfil, Google Sheets, etc.
│   └── api/                    # API Routes (serverless)
│       ├── horas/
│       ├── empresas/
│       ├── proyectos/
│       ├── notas/
│       ├── metricas/
│       └── sync/sheets/
├── components/
│   ├── auth/                   # LoginForm
│   ├── layout/                 # Sidebar, BottomNav, TopBar
│   ├── dashboard/              # QuickAddHours, TodaySummary, etc.
│   ├── horas/                  # HourEntryCard
│   └── shared/                 # EasterEgg, etc.
├── hooks/                      # TanStack Query hooks
├── lib/
│   ├── supabase/               # Clientes browser y server
│   ├── google-sheets/          # Lógica de sincronización
│   └── utils.ts                # Helpers
├── providers/                  # QueryProvider, AuthProvider
├── types/                      # TypeScript types
└── middleware.ts               # Protección de rutas
```

---

## Base de datos (Supabase)

### Tablas principales
- **profiles** — Perfil del usuario (RUT, nombre, token Google)
- **empresas** — Clientes/empresas con color y RUT
- **proyectos** — Proyectos asociados a empresas
- **registros_horas** — Registro de horas trabajadas (tabla core)
- **notas_diarias** — Una nota por día (autosave)
- **sync_log** — Historial de sincronizaciones con Sheets

### Seguridad
Todas las tablas tienen Row Level Security (RLS) activado.
Cada usuario solo puede ver y editar sus propios datos.

---

## Flujo de autenticación

1. Usuario entra a `/dashboard`
2. Middleware detecta que no hay sesión → redirige a `/login`
3. Usuario ingresa email + contraseña
4. Supabase valida y establece cookies de sesión (httpOnly)
5. Middleware permite el acceso a rutas protegidas
6. Al cerrar sesión, se eliminan las cookies y redirige a `/login`

---

## Sincronización con Google Sheets

### Flujo automático (sin OAuth en MVP)
1. Usuario crea cuenta de servicio en Google Cloud Console
2. Comparte la hoja con el email de la cuenta de servicio
3. Descarga el JSON de credenciales
4. Lo sube en Configuración → Google Sheets

### Lo que se sincroniza
- Una hoja por mes (ej: "2026-04") con todos los registros
- Formato: Fecha | Empresa | Proyecto | Horas | Descripción
- Fila de TOTAL al final
- Formato rosa en el encabezado ✨

### Cuándo sincroniza
- Automáticamente después de cada registro nuevo
- Manualmente con el botón "Sincronizar ahora" en Configuración

---

## Easter eggs 🥚

1. **Konami Code** (↑↑↓↓←→←→BA): lluvia de flores en pantalla
2. **Triple tap** en el logo (mobile): misma animación
3. **Más por descubrir**... (agregar con el tiempo)

---

## Variables de entorno requeridas

```bash
# Supabase (obligatorio)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Sheets (opcional para sync)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# URL de la app
NEXT_PUBLIC_APP_URL=
```

---

## Comandos útiles

```bash
npm run dev        # Desarrollo local en localhost:3000
npm run build      # Build de producción
npm run lint       # Linter
```

---

## Deploy en Vercel

1. Push del repo a GitHub
2. Importar proyecto en vercel.com
3. Agregar variables de entorno en el dashboard de Vercel
4. Deploy automático en cada push a main

URL resultante: `https://mi-empresa-XXXX.vercel.app`

---

## Roadmap futuro

- [ ] RUT personal en perfil
- [ ] Nombre de empresa propia
- [ ] Generación de facturas PDF
- [ ] Integración facturación electrónica (SII Chile)
- [ ] Exportación de informes a PDF
- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] PWA instalable en el celular
