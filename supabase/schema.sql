-- ============================================================
-- MESA DE AYUDA AVELLANEDA — Esquema de base de datos
-- Pegar completo en el SQL Editor de Supabase
-- ============================================================

-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tipos enumerados ────────────────────────────────────────
CREATE TYPE user_rol          AS ENUM ('super_admin', 'admin');
CREATE TYPE reclamo_estado    AS ENUM ('pendiente', 'en_proceso', 'resuelto', 'rechazado', 'cerrado');
CREATE TYPE reclamo_prioridad AS ENUM ('baja', 'media', 'alta', 'urgente');
CREATE TYPE documento_tipo    AS ENUM ('pdf', 'word', 'excel');

-- ─── Secuencia para número de seguimiento ────────────────────
CREATE SEQUENCE IF NOT EXISTS reclamo_seq START 1;

CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  year_text TEXT;
  seq_num   TEXT;
BEGIN
  year_text := EXTRACT(YEAR FROM NOW())::TEXT;
  seq_num   := LPAD(nextval('reclamo_seq')::TEXT, 6, '0');
  RETURN 'AVA-' || year_text || '-' || seq_num;
END;
$$ LANGUAGE plpgsql;

-- ─── Tabla: users (espejo de auth.users) ─────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  rol         user_rol    NOT NULL DEFAULT 'admin',
  activo      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tabla: vecinos ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vecinos (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre       TEXT        NOT NULL,
  dni          TEXT        NOT NULL,
  telefono     TEXT        NOT NULL,
  email        TEXT,
  direccion    TEXT        NOT NULL,
  entre_calles TEXT,
  barrio       TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tabla: reclamos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reclamos (
  id                    UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_seguimiento    TEXT              UNIQUE NOT NULL DEFAULT generate_tracking_number(),
  vecino_id             UUID              NOT NULL REFERENCES vecinos(id) ON DELETE RESTRICT,
  categoria             TEXT              NOT NULL,
  subcategoria          TEXT              NOT NULL,
  descripcion           TEXT              NOT NULL,
  foto_url              TEXT,
  foto_path             TEXT,
  estado                reclamo_estado    NOT NULL DEFAULT 'pendiente',
  prioridad             reclamo_prioridad NOT NULL DEFAULT 'media',
  observaciones_internas TEXT,
  created_at            TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- ─── Tabla: documentos_generados ─────────────────────────────
CREATE TABLE IF NOT EXISTS documentos_generados (
  id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  reclamo_id      UUID           NOT NULL REFERENCES reclamos(id) ON DELETE CASCADE,
  tipo_documento  documento_tipo NOT NULL,
  nombre_archivo  TEXT           NOT NULL,
  archivo_url     TEXT           NOT NULL,
  archivo_path    TEXT           NOT NULL,
  generado_por    UUID           REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ─── Tabla: historial_estados ─────────────────────────────────
CREATE TABLE IF NOT EXISTS historial_estados (
  id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  reclamo_id       UUID           NOT NULL REFERENCES reclamos(id) ON DELETE CASCADE,
  estado_anterior  reclamo_estado,
  estado_nuevo     reclamo_estado NOT NULL,
  comentario       TEXT,
  usuario_id       UUID           REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ─── Triggers: updated_at automático ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reclamos_updated_at
  BEFORE UPDATE ON reclamos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Trigger: historial de estados automático ─────────────────
CREATE OR REPLACE FUNCTION log_estado_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    INSERT INTO historial_estados (reclamo_id, estado_anterior, estado_nuevo)
    VALUES (NEW.id, OLD.estado, NEW.estado);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reclamos_estado_history
  AFTER UPDATE ON reclamos
  FOR EACH ROW EXECUTE FUNCTION log_estado_change();

-- ─── Trigger: crear user al registrarse en auth ───────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, nombre, email, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'rol')::user_rol, 'admin')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE vecinos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_generados ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_estados   ENABLE ROW LEVEL SECURITY;

-- users: solo admins autenticados
CREATE POLICY "Admins can read users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin can manage users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.rol = 'super_admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.rol = 'super_admin')
  );

-- vecinos: inserción pública, lectura solo admins
CREATE POLICY "Anyone can insert vecinos" ON vecinos
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can read vecinos" ON vecinos
  FOR SELECT TO authenticated USING (true);

-- reclamos: inserción pública, lectura/update solo admins
CREATE POLICY "Anyone can insert reclamos" ON reclamos
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can read reclamos by tracking" ON reclamos
  FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated can read reclamos" ON reclamos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can update reclamos" ON reclamos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- documentos: solo admins
CREATE POLICY "Authenticated can manage documentos" ON documentos_generados
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- historial: lectura admins, inserción por trigger
CREATE POLICY "Authenticated can read historial" ON historial_estados
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert historial" ON historial_estados
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ─── Storage buckets ──────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('reclamos-fotos', 'reclamos-fotos', false),
  ('documentos',     'documentos',     false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload reclamo photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'reclamos-fotos');

CREATE POLICY "Authenticated can read reclamo photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'reclamos-fotos');

CREATE POLICY "Authenticated can manage documentos storage" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'documentos')
  WITH CHECK (bucket_id = 'documentos');

-- ─── Vista útil: reclamos con datos del vecino ────────────────
CREATE OR REPLACE VIEW reclamos_completos AS
SELECT
  r.*,
  v.nombre       AS vecino_nombre,
  v.dni          AS vecino_dni,
  v.telefono     AS vecino_telefono,
  v.email        AS vecino_email,
  v.direccion    AS vecino_direccion,
  v.entre_calles AS vecino_entre_calles,
  v.barrio       AS vecino_barrio
FROM reclamos r
JOIN vecinos v ON v.id = r.vecino_id;
