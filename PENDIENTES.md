# Pendientes — Mi Empresa

## Configuraciones manuales

### 1. Supabase ✅
- [x] Proyecto creado → `ozwciusfikwtauqebzjd`
- [x] Schema ejecutado (`supabase/schema.sql`)
- [ ] Ejecutar `supabase/migration_tarifa.sql` en el SQL Editor ← PENDIENTE
- [x] Usuario creado en Authentication > Users

### 2. Vercel ✅
- [x] Proyecto importado
- [x] Variables de entorno configuradas
- [x] `NEXT_PUBLIC_APP_URL=https://mikagonz.site`
- [x] `NEXT_PUBLIC_BYMIK_URL=https://bymik.mikagonz.site`
- [x] Google OAuth configurado

### 3. Google Sheets ✅
- [x] OAuth 2.0 configurado
- [x] Redirect URI en producción

---

## ✅ Completado

### Base
- [x] Estructura base del proyecto (Next.js + TypeScript)
- [x] Sistema de diseño (Tailwind CSS, colores rosas)
- [x] Autenticación con Supabase
- [x] Schema de base de datos completo con RLS
- [x] CRUD de empresas (con tarifa por hora)
- [x] CRUD de proyectos
- [x] Registro de horas (crear, editar, eliminar)
- [x] Filtrar horas por empresa/proyecto
- [x] Notas diarias con autosave
- [x] Métricas mensuales con gráficos e ingresos estimados
- [x] Integración con Google Sheets
- [x] Página de configuración (perfil completo: RUT, empresa, dirección, avatar)

### UX / Técnico
- [x] Navegación responsive (sidebar desktop, bottom nav mobile)
- [x] Safe-area para iPhone
- [x] Animaciones de transición de páginas (Framer Motion)
- [x] Feedback háptico en mobile
- [x] Cursor personalizado 🌸 en desktop
- [x] Empty state mejorado en dashboard
- [x] Easter eggs (Konami code + triple tap + 7-taps secreto)
- [x] Auth callback route para Supabase
- [x] Error Boundary global
- [x] PWA instalable (manifest + iconos)

### Features
- [x] Vista de horas por mes (navegación prev/next en dashboard y horas)
- [x] Exportar mes a PDF (vista de impresión)
- [x] Ingresos estimados en métricas (horas × tarifa)
- [x] Perfil completo: RUT, nombre empresa propia, dirección, foto

## 🔲 Futuro
- [ ] Exportar métricas a PDF
- [ ] Tarifa por hora por proyecto (actualmente solo por empresa)
- [ ] Historial de facturas emitidas
- [ ] API del SII para facturación electrónica
- [ ] Rate limiting en API routes
- [ ] Tests básicos
- [ ] Caché offline con Service Worker
