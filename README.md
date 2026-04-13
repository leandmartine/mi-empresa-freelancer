# 🌸 Mi Empresa — Panel de gestión para freelancers

Sistema de autogestión de horas y proyectos diseñado para freelancers independientes. Permite registrar el tiempo trabajado por empresa y proyecto, ver métricas mensuales y mantener un respaldo automático en Google Sheets.

> Diseñado con foco total en UX mobile-first: simple, rápido y bonito.

---

## ¿Para qué sirve?

Si trabajás de forma independiente para varios clientes y necesitás llevar un registro claro de tus horas, este panel es para vos. Desde el celular o la computadora podés:

- Saber cuántas horas trabajaste hoy y en el mes
- Registrar horas con un par de toques
- Ver en qué empresa o proyecto invertiste más tiempo
- Tener todo respaldado automáticamente en una hoja de Google Sheets

---

## Funciones

### ⏱️ Registro de horas
- Selector táctil con botones **+** y **−** (incrementos de 0.5h)
- Tocás el número y podés escribir el valor directamente (ej: `9`)
- Asociás cada registro a una empresa y/o proyecto
- Agregás una nota o descripción de lo que hiciste
- Editás o eliminás cualquier registro existente

### 📊 Métricas
- Total de horas del mes
- Promedio de horas por día trabajado
- Gráfico de barras de horas por día
- Desglose por empresa (con barra de progreso)
- Desglose por proyecto
- Navegación entre meses

### 🏢 Gestión de empresas y proyectos
- Agregás tus clientes/empresas con nombre, color y RUT (opcional)
- Creás proyectos asociados a cada empresa
- Cada uno tiene un color para identificarlos visualmente

### 📝 Nota del día
- Un campo de texto libre por día
- Se guarda automáticamente mientras escribís (sin botón de guardar)

### 🔄 Sincronización con Google Sheets
- Respaldo automático cada vez que agregás horas
- Sincronización manual desde Configuración
- Genera una hoja por mes con todas las entradas y totales
- Encabezado con formato rosa ✨

### 🥚 Easter eggs
- Probá el **código Konami** en el teclado: `↑ ↑ ↓ ↓ ← → ← → B A`
- O **tres taps rápidos** en el logo desde el celular
- Hay más por descubrir...

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| TypeScript | Tipado |
| Tailwind CSS v4 | Estilos |
| Framer Motion | Animaciones |
| Shadcn/ui | Componentes UI |
| Supabase | Base de datos y autenticación |
| TanStack Query | Data fetching y caché |
| Recharts | Gráficos |
| Google Sheets API | Respaldo automático |
| Vercel | Deploy (URL gratuita) |

---

## Instalación y desarrollo local

### Requisitos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) para el deploy (gratis)

### 1. Clonar el repositorio

```bash
git clone https://github.com/leandmartine/mi-empresa-freelancer.git
cd mi-empresa-freelancer
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local` con tus claves de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Crear la base de datos

En el SQL Editor de Supabase, ejecutá el contenido de `supabase/schema.sql`.

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

> **Modo de prueba sin Supabase:** podés ingresar con `mikagonz@gmail.com` / `12345678` para explorar la app con datos en memoria (solo en desarrollo local).

---

## Deploy en Vercel

1. Importá el repositorio en [vercel.com](https://vercel.com)
2. Agregá las variables de entorno en el dashboard de Vercel
3. Deploy — obtenés una URL gratuita tipo `mi-empresa.vercel.app`
4. Actualizá `NEXT_PUBLIC_APP_URL` con esa URL

---

## Estructura del proyecto

```
src/
├── app/              # Páginas y API routes (Next.js App Router)
│   ├── dashboard/    # Pantalla principal
│   ├── horas/        # Registro y listado de horas
│   ├── metricas/     # Gráficos y estadísticas
│   ├── empresas/     # Gestión de clientes
│   ├── proyectos/    # Gestión de proyectos
│   ├── configuracion/# Perfil y Google Sheets
│   └── api/          # Endpoints REST
├── components/       # Componentes React
├── hooks/            # TanStack Query hooks
├── lib/              # Supabase, Google Sheets, utilidades
├── providers/        # Contextos de React
└── types/            # Tipos TypeScript
```

---

## Roadmap

- [ ] RUT personal y nombre de empresa propia
- [ ] Generación de facturas en PDF
- [ ] Facturación electrónica (SII Chile)
- [ ] Exportación de informes mensuales
- [ ] Modo oscuro
- [ ] PWA instalable en el celular

---

## Archivos de referencia

- [`PROYECTO.md`](./PROYECTO.md) — Arquitectura completa y decisiones técnicas
- [`PENDIENTES.md`](./PENDIENTES.md) — Tareas pendientes y configuraciones manuales
- [`supabase/schema.sql`](./supabase/schema.sql) — Schema de base de datos
