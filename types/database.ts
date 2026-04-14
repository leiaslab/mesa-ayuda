// ─── Enums ────────────────────────────────────────────────────
export type UserRol          = "super_admin" | "admin";
export type ReclamoEstado    = "pendiente" | "en_proceso" | "resuelto" | "rechazado" | "cerrado";
export type ReclamoPrioridad = "baja" | "media" | "alta" | "urgente";
export type DocumentoTipo    = "pdf" | "word" | "excel";

// ─── Tablas ───────────────────────────────────────────────────
export type User = {
  id:         string;
  nombre:     string;
  email:      string;
  rol:        UserRol;
  activo:     boolean;
  created_at: string;
  updated_at: string;
};

export type Vecino = {
  id:           string;
  nombre:       string;
  dni:          string;
  telefono:     string;
  email:        string | null;
  direccion:    string;
  entre_calles: string | null;
  barrio:       string;
  created_at:   string;
};

export type Reclamo = {
  id:                    string;
  numero_seguimiento:    string;
  vecino_id:             string;
  categoria:             string;
  subcategoria:          string;
  descripcion:           string;
  foto_url:              string | null;
  foto_path:             string | null;
  estado:                ReclamoEstado;
  prioridad:             ReclamoPrioridad;
  observaciones_internas: string | null;
  created_at:            string;
  updated_at:            string;
};

export type ReclamoCompleto = Reclamo & {
  vecino_nombre:       string;
  vecino_dni:          string;
  vecino_telefono:     string;
  vecino_email:        string | null;
  vecino_direccion:    string;
  vecino_entre_calles: string | null;
  vecino_barrio:       string;
};

export type DocumentoGenerado = {
  id:             string;
  reclamo_id:     string;
  tipo_documento: DocumentoTipo;
  nombre_archivo: string;
  archivo_url:    string;
  archivo_path:   string;
  generado_por:   string | null;
  created_at:     string;
};

export type HistorialEstado = {
  id:              string;
  reclamo_id:      string;
  estado_anterior: ReclamoEstado | null;
  estado_nuevo:    ReclamoEstado;
  comentario:      string | null;
  usuario_id:      string | null;
  created_at:      string;
};

// ─── Helpers de visualización ─────────────────────────────────
export const ESTADO_LABELS: Record<ReclamoEstado, string> = {
  pendiente:   "Pendiente",
  en_proceso:  "En proceso",
  resuelto:    "Resuelto",
  rechazado:   "Rechazado",
  cerrado:     "Cerrado",
};

export const ESTADO_COLORS: Record<ReclamoEstado, string> = {
  pendiente:  "bg-yellow-100 text-yellow-800",
  en_proceso: "bg-blue-100 text-blue-800",
  resuelto:   "bg-green-100 text-green-800",
  rechazado:  "bg-red-100 text-red-800",
  cerrado:    "bg-gray-100 text-gray-600",
};

export const PRIORIDAD_LABELS: Record<ReclamoPrioridad, string> = {
  baja:    "Baja",
  media:   "Media",
  alta:    "Alta",
  urgente: "Urgente",
};

export const PRIORIDAD_COLORS: Record<ReclamoPrioridad, string> = {
  baja:    "bg-gray-100 text-gray-600",
  media:   "bg-blue-100 text-blue-700",
  alta:    "bg-orange-100 text-orange-700",
  urgente: "bg-red-100 text-red-700",
};

// ─── Schema tipado para Supabase createClient<Database> ───────
export type Database = {
  public: {
    Tables: {
      users: {
        Row:           User;
        Insert:        Omit<User, "created_at" | "updated_at" | "activo"> & { created_at?: string; updated_at?: string; activo?: boolean };
        Update:        Partial<Omit<User, "id">>;
        Relationships: [];
      };
      vecinos: {
        Row:           Vecino;
        Insert:        Omit<Vecino, "id" | "created_at"> & { id?: string; created_at?: string };
        Update:        Partial<Omit<Vecino, "id">>;
        Relationships: [];
      };
      reclamos: {
        Row:    Reclamo;
        Insert: Omit<Reclamo, "id" | "numero_seguimiento" | "created_at" | "updated_at" | "estado" | "prioridad" | "observaciones_internas"> & {
          id?: string; numero_seguimiento?: string; created_at?: string; updated_at?: string;
          estado?: ReclamoEstado; prioridad?: ReclamoPrioridad; observaciones_internas?: string | null;
        };
        Update:        Partial<Omit<Reclamo, "id" | "numero_seguimiento" | "created_at">>;
        Relationships: [];
      };
      documentos_generados: {
        Row:           DocumentoGenerado;
        Insert:        Omit<DocumentoGenerado, "id" | "created_at"> & { id?: string; created_at?: string };
        Update:        Partial<Omit<DocumentoGenerado, "id">>;
        Relationships: [];
      };
      historial_estados: {
        Row:           HistorialEstado;
        Insert:        Omit<HistorialEstado, "id" | "created_at"> & { id?: string; created_at?: string };
        Update:        Partial<Omit<HistorialEstado, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: {
      reclamos_completos: {
        Row:           ReclamoCompleto;
        Relationships: [];
      };
    };
    Functions:       Record<string, never>;
    Enums: {
      user_rol:          UserRol;
      reclamo_estado:    ReclamoEstado;
      reclamo_prioridad: ReclamoPrioridad;
      documento_tipo:    DocumentoTipo;
    };
    CompositeTypes: Record<string, never>;
  };
};
