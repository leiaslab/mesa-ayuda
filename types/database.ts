export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRol = "super_admin" | "admin";
export type ReclamoEstado =
  | "pendiente"
  | "en_proceso"
  | "resuelto"
  | "rechazado"
  | "cerrado";
export type ReclamoPrioridad = "baja" | "media" | "alta" | "urgente";
export type DocumentoTipo = "pdf" | "word" | "excel";
export type Sexo = "femenino" | "masculino" | "otro" | "prefiero_no_decir";
export type AgeRange = "under_18" | "18_29" | "30_44" | "45_59" | "60_plus";

export type User = {
  id: string;
  nombre: string;
  email: string;
  rol: UserRol;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = User;

export type Vecino = {
  id: string;
  nombre: string;
  apellido: string | null;
  dni: string;
  fecha_nacimiento: string | null;
  sexo: Sexo | null;
  telefono: string;
  email: string | null;
  direccion: string;
  entre_calles: string | null;
  barrio: string;
  created_at: string;
};

export type Reclamo = {
  id: string;
  numero_seguimiento: string;
  vecino_id: string;
  categoria: string;
  subcategoria: string;
  descripcion: string;
  foto_url: string | null;
  foto_path: string | null;
  estado: ReclamoEstado;
  prioridad: ReclamoPrioridad;
  observaciones_internas: string | null;
  asignado_a: string | null;
  created_at: string;
  updated_at: string;
};

export type ReclamoCompleto = Reclamo & {
  codigo_reclamo: string;
  vecino_nombre: string;
  vecino_apellido: string | null;
  vecino_dni: string;
  vecino_fecha_nacimiento: string | null;
  vecino_sexo: Sexo | null;
  vecino_telefono: string;
  vecino_email: string | null;
  vecino_direccion: string;
  vecino_entre_calles: string | null;
  vecino_barrio: string;
  edad: number | null;
};

export type DocumentoGenerado = {
  id: string;
  reclamo_id: string;
  tipo_documento: DocumentoTipo;
  nombre_archivo: string;
  archivo_url: string;
  archivo_path: string;
  generado_por: string | null;
  created_at: string;
};

export type HistorialEstado = {
  id: string;
  reclamo_id: string;
  estado_anterior: ReclamoEstado | null;
  estado_nuevo: ReclamoEstado;
  comentario: string | null;
  usuario_id: string | null;
  created_at: string;
};

export type SiteContent = {
  id: string;
  section_key: string;
  label: string;
  value_text: string | null;
  value_json: Json | null;
  editable: boolean;
  updated_at: string;
  updated_by: string | null;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  detalle: Json | null;
  created_at: string;
  ip: string | null;
  user_agent: string | null;
};

export type ExportJob = {
  id: string;
  tipo: string;
  formato: DocumentoTipo;
  filtro_json: Json | null;
  url_archivo: string | null;
  created_by: string | null;
  created_at: string;
};

export const ESTADO_LABELS: Record<ReclamoEstado, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
  rechazado: "Rechazado",
  cerrado: "Cerrado",
};

export const ESTADO_COLORS: Record<ReclamoEstado, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_proceso: "bg-blue-100 text-blue-800",
  resuelto: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
  cerrado: "bg-gray-100 text-gray-600",
};

export const PRIORIDAD_LABELS: Record<ReclamoPrioridad, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  urgente: "Urgente",
};

export const PRIORIDAD_COLORS: Record<ReclamoPrioridad, string> = {
  baja: "bg-gray-100 text-gray-600",
  media: "bg-blue-100 text-blue-700",
  alta: "bg-orange-100 text-orange-700",
  urgente: "bg-red-100 text-red-700",
};

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  under_18: "Menor de 18",
  "18_29": "18 a 29",
  "30_44": "30 a 44",
  "45_59": "45 a 59",
  "60_plus": "60+",
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at" | "updated_at" | "activo"> & {
          created_at?: string;
          updated_at?: string;
          activo?: boolean;
        };
        Update: Partial<Omit<User, "id">>;
        Relationships: [];
      };
      vecinos: {
        Row: Vecino;
        Insert: Omit<Vecino, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Vecino, "id">>;
        Relationships: [];
      };
      reclamos: {
        Row: Reclamo;
        Insert: Omit<
          Reclamo,
          | "id"
          | "numero_seguimiento"
          | "created_at"
          | "updated_at"
          | "estado"
          | "prioridad"
          | "observaciones_internas"
          | "asignado_a"
        > & {
          id?: string;
          numero_seguimiento?: string;
          created_at?: string;
          updated_at?: string;
          estado?: ReclamoEstado;
          prioridad?: ReclamoPrioridad;
          observaciones_internas?: string | null;
          asignado_a?: string | null;
        };
        Update: Partial<Omit<Reclamo, "id" | "numero_seguimiento" | "created_at">>;
        Relationships: [];
      };
      documentos_generados: {
        Row: DocumentoGenerado;
        Insert: Omit<DocumentoGenerado, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DocumentoGenerado, "id">>;
        Relationships: [];
      };
      historial_estados: {
        Row: HistorialEstado;
        Insert: Omit<HistorialEstado, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<HistorialEstado, "id" | "created_at">>;
        Relationships: [];
      };
      site_content: {
        Row: SiteContent;
        Insert: Omit<SiteContent, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SiteContent, "id">>;
        Relationships: [];
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      export_jobs: {
        Row: ExportJob;
        Insert: Omit<ExportJob, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ExportJob, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: {
      reclamos_completos: {
        Row: ReclamoCompleto;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_rol: UserRol;
      reclamo_estado: ReclamoEstado;
      reclamo_prioridad: ReclamoPrioridad;
      documento_tipo: DocumentoTipo;
    };
    CompositeTypes: Record<string, never>;
  };
};
