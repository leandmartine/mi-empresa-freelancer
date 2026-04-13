# 📋 Pendientes — Mi Empresa

## 🔴 Configuraciones manuales (OBLIGATORIAS para que funcione)

### 1. Crear proyecto en Supabase
- [ ] Ir a https://supabase.com y crear cuenta (gratis)
- [ ] Crear nuevo proyecto (elegir región más cercana: São Paulo o US East)
- [ ] Copiar las claves API: `Project URL`, `anon key`, `service_role key`
- [ ] Ejecutar el SQL de `supabase/schema.sql` en el SQL Editor de Supabase
- [ ] En Authentication → Providers → Email: habilitar "Email signups"
- [ ] Crear el usuario manualmente en Authentication → Users → Add user
  - Email: el email de tu novia
  - Password: la contraseña que ella quiera
- [ ] Pegar las claves en `.env.local`

### 2. Deploy en Vercel
- [ ] Crear cuenta en https://vercel.com (gratis, con GitHub)
- [ ] Importar el repositorio desde GitHub
- [ ] Agregar las variables de entorno en Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL` → poner la URL que te da Vercel después del primer deploy
- [ ] Hacer el primer deploy (botón "Deploy" en Vercel)
- [ ] La URL será algo como `https://mi-empresa-xxxx.vercel.app`

### 3. Configurar Google Sheets (opcional pero recomendado)
- [ ] Ir a https://console.cloud.google.com
- [ ] Crear proyecto nuevo → habilitar "Google Sheets API"
- [ ] Crear credenciales tipo "OAuth 2.0 Client ID" (tipo Web Application)
- [ ] Agregar como "Authorized redirect URI": `https://TU_APP.vercel.app/api/sync/sheets/connect`
- [ ] Copiar Client ID y Client Secret al `.env.local` y a Vercel
- [ ] Actualizar `GOOGLE_REDIRECT_URI` en Vercel con la URL real

---

## 🟡 Pendientes de desarrollo (próximas iteraciones)

### MVP — Por completar
- [ ] Verificar que el build pasa sin errores (`npm run build`)
- [ ] Probar el flujo completo: login → agregar horas → ver métricas
- [ ] Testear en mobile (Chrome DevTools → iPhone SE y iPhone 14)
- [ ] Configurar el safe-area para los bordes en iPhone (bottom-safe)
- [ ] Agregar el auth callback route para Supabase (`/api/auth/callback`)

### UX / Diseño
- [ ] Agregar animación de entrada a la página (page transitions con Framer Motion)
- [ ] Mejorar el empty state del dashboard cuando no hay datos
- [ ] Agregar feedback háptico en mobile (navigator.vibrate)
- [ ] Cursor personalizado con 🌸 en desktop (solo si le gusta)
- [ ] Agregar un tercer easter egg sorpresa

### Features
- [ ] Edición de registros de horas (actualmente solo se pueden eliminar)
- [ ] Filtrar horas por empresa/proyecto en la vista de horas
- [ ] Vista de horas de meses anteriores en el dashboard
- [ ] Exportar mes a PDF
- [ ] Agregar campo "tarifa por hora" a empresas para calcular ingresos
- [ ] Resumen de ingresos estimados en métricas

### Perfil (cuando tenga los datos)
- [ ] Campo RUT personal
- [ ] Campo nombre de empresa propia
- [ ] Campo dirección
- [ ] Foto de perfil

### Facturación (futuro, cuando tenga RUT)
- [ ] Investigar API del SII (Chile) para facturación electrónica
- [ ] Template de boleta/factura en PDF con react-pdf
- [ ] Historial de facturas emitidas

### Técnico
- [ ] Agregar manejo de errores global con Error Boundary
- [ ] PWA: agregar `manifest.json` y service worker para instalar en celular
- [ ] Caché offline básico con Service Worker
- [ ] Rate limiting en las API routes
- [ ] Tests básicos con Jest + Testing Library

---

## ✅ Completado

- [x] Estructura base del proyecto (Next.js 14 + TypeScript)
- [x] Sistema de diseño (Tailwind CSS, colores rosas)
- [x] Autenticación con Supabase (login, logout, middleware)
- [x] Schema de base de datos completo con RLS
- [x] CRUD de empresas
- [x] CRUD de proyectos
- [x] Registro de horas (crear, eliminar, listar)
- [x] Notas diarias con autosave
- [x] Métricas mensuales con gráficos (Recharts)
- [x] Navegación responsive (sidebar desktop, bottom nav mobile)
- [x] Easter eggs (Konami code + triple tap)
- [x] Integración base con Google Sheets
- [x] Página de configuración
- [x] PROYECTO.md con documentación completa
- [x] Repositorio en GitHub
