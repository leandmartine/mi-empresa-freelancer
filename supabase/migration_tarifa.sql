-- Agregar tarifa_por_hora a empresas
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS tarifa_por_hora NUMERIC(10,2) DEFAULT 0;

-- Agregar campos de perfil faltantes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nombre_empresa_propia TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS direccion TEXT;
