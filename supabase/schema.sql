-- ═══════════════════════════════════════════════════════════════════════════
-- Schema para "Mi Empresa" - Sistema de gestión de horas freelancer
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensiones ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tabla: profiles ──────────────────────────────────────────────────────────
-- Extiende auth.users de Supabase. Se crea automáticamente al registrarse.
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name             TEXT,
  rut                   TEXT,
  email                 TEXT,
  avatar_url            TEXT,
  sheets_spreadsheet_id TEXT,
  sheets_token_data     JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven su propio perfil"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger para crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Tabla: empresas ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.empresas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#f472b6',
  rut_empresa TEXT,
  activa      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven sus empresas"
  ON public.empresas FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_empresas_user ON public.empresas(user_id);

-- ─── Tabla: proyectos ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.proyectos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  empresa_id  UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  color       TEXT NOT NULL DEFAULT '#fbcfe8',
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven sus proyectos"
  ON public.proyectos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_proyectos_user ON public.proyectos(user_id);
CREATE INDEX idx_proyectos_empresa ON public.proyectos(empresa_id);

-- ─── Tabla: registros_horas ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.registros_horas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  empresa_id    UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
  proyecto_id   UUID REFERENCES public.proyectos(id) ON DELETE SET NULL,
  fecha         DATE NOT NULL DEFAULT CURRENT_DATE,
  horas         NUMERIC(5,2) NOT NULL CHECK (horas > 0 AND horas <= 24),
  descripcion   TEXT,
  synced_sheets BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.registros_horas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven sus registros"
  ON public.registros_horas FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_registros_user_fecha ON public.registros_horas(user_id, fecha DESC);
CREATE INDEX idx_registros_empresa ON public.registros_horas(empresa_id);
CREATE INDEX idx_registros_proyecto ON public.registros_horas(proyecto_id);

-- ─── Tabla: notas_diarias ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notas_diarias (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fecha      DATE NOT NULL DEFAULT CURRENT_DATE,
  contenido  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, fecha)
);

ALTER TABLE public.notas_diarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven sus notas"
  ON public.notas_diarias FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Tabla: sync_log ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sync_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status         TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  records_synced INTEGER DEFAULT 0,
  error_message  TEXT,
  synced_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios solo ven su historial de sync"
  ON public.sync_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Vista: métricas mensuales (opcional, para queries rápidas) ───────────────
CREATE OR REPLACE VIEW public.v_metricas_mensuales AS
SELECT
  user_id,
  DATE_TRUNC('month', fecha) AS mes,
  empresa_id,
  proyecto_id,
  SUM(horas)  AS total_horas,
  COUNT(*)    AS num_registros,
  AVG(horas)  AS promedio_diario
FROM public.registros_horas
GROUP BY user_id, mes, empresa_id, proyecto_id;
