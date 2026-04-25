import Link from "next/link";
import { requireRole } from "@/lib/security/auth";
import SuperadminResetButton from "./SuperadminResetButton";
import { createClient } from "@/lib/supabase/server";
import {
  AGE_RANGE_LABELS,
  type AgeRange,
  type ReclamoCompleto,
  type ReclamoEstado,
  type Sexo,
} from "@/types/database";

const SEXO_OPTIONS = [
  { value: "", label: "Todos los sexos" },
  { value: "femenino", label: "Femenino" },
  { value: "masculino", label: "Masculino" },
  { value: "otro", label: "Otro" },
  { value: "prefiero_no_decir", label: "Prefiero no decir" },
];

const AGE_OPTIONS: { value: AgeRange | ""; label: string }[] = [
  { value: "", label: "Todas las edades" },
  { value: "under_18", label: AGE_RANGE_LABELS.under_18 },
  { value: "18_29", label: AGE_RANGE_LABELS["18_29"] },
  { value: "30_44", label: AGE_RANGE_LABELS["30_44"] },
  { value: "45_59", label: AGE_RANGE_LABELS["45_59"] },
  { value: "60_plus", label: AGE_RANGE_LABELS["60_plus"] },
];

type SearchParams = {
  codigo?: string;
  dni?: string;
  nombre?: string;
  apellido?: string;
  barrio?: string;
  sexo?: Sexo;
  categoria?: string;
  estado?: ReclamoEstado;
  edad?: AgeRange;
  fecha_desde?: string;
  fecha_hasta?: string;
};

export default async function SuperadminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireRole("super_admin");
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("reclamos_completos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);

  if (params.codigo) query = query.ilike("numero_seguimiento", `%${params.codigo}%`);
  if (params.dni) query = query.eq("vecino_dni", params.dni);
  if (params.nombre) query = query.ilike("vecino_nombre", `%${params.nombre}%`);
  if (params.apellido) query = query.ilike("vecino_apellido", `%${params.apellido}%`);
  if (params.barrio) query = query.ilike("vecino_barrio", `%${params.barrio}%`);
  if (params.sexo) query = query.eq("vecino_sexo", params.sexo);
  if (params.categoria) query = query.eq("categoria", params.categoria);
  if (params.estado) query = query.eq("estado", params.estado);
  if (params.fecha_desde) query = query.gte("created_at", `${params.fecha_desde}T00:00:00`);
  if (params.fecha_hasta) query = query.lte("created_at", `${params.fecha_hasta}T23:59:59`);

  if (params.edad) {
    const range = getBirthdateRange(params.edad);
    if (range.min) query = query.gte("vecino_fecha_nacimiento", range.min);
    if (range.max) query = query.lte("vecino_fecha_nacimiento", range.max);
  }

  const [{ data: reclamos, count }, { data: auditLogs }, { data: users }] = await Promise.all([
    query,
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("users").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9333EA]">
            Superadmin
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-[#4C1182]">
            Control total del sistema
          </h1>
          <p className="mt-2 max-w-[780px] text-sm leading-6 text-[#6f6487]">
            Vista avanzada de reclamos, auditoría, admins y exportaciones masivas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/usuarios" className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#4C1182]">
            Gestionar admins
          </Link>
          <Link href="/superadmin/auditoria" className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#4C1182]">
            Auditoría completa
          </Link>
          <Link href="/admin/contenidos" className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#4C1182]">
            Contenido editable
          </Link>
          <SuperadminResetButton />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Reclamos filtrados" value={String(count ?? 0)} />
        <MetricCard label="Auditoría reciente" value={String(auditLogs?.length ?? 0)} />
        <MetricCard label="Admins visibles" value={String(users?.length ?? 0)} />
        <MetricCard label="Exportaciones" value="Preparadas" />
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[#4C1182]">Filtros avanzados</h2>
        <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input name="codigo" defaultValue={params.codigo} placeholder="Código de reclamo" className={inputClassName()} />
          <input name="dni" defaultValue={params.dni} placeholder="DNI" className={inputClassName()} />
          <input name="nombre" defaultValue={params.nombre} placeholder="Nombre" className={inputClassName()} />
          <input name="apellido" defaultValue={params.apellido} placeholder="Apellido" className={inputClassName()} />
          <input name="barrio" defaultValue={params.barrio} placeholder="Barrio" className={inputClassName()} />
          <select name="sexo" defaultValue={params.sexo} className={inputClassName()}>
            {SEXO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select name="edad" defaultValue={params.edad} className={inputClassName()}>
            {AGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input name="categoria" defaultValue={params.categoria} placeholder="Categoría" className={inputClassName()} />
          <input name="estado" defaultValue={params.estado} placeholder="Estado" className={inputClassName()} />
          <input name="fecha_desde" defaultValue={params.fecha_desde} type="date" className={inputClassName()} />
          <input name="fecha_hasta" defaultValue={params.fecha_hasta} type="date" className={inputClassName()} />
          <div className="flex gap-2 xl:col-span-5">
            <button className="rounded-xl bg-[#4C1182] px-4 py-2 text-sm font-semibold text-white">
              Filtrar
            </button>
            <Link href="/superadmin" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
              Limpiar
            </Link>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-[#4C1182]">Base filtrada</h2>
          <form action="/api/exports" method="post">
            <input type="hidden" name="scope" value="filtered" />
            <input type="hidden" name="formato" value="excel" />
            <input type="hidden" name="filters" value={JSON.stringify(params)} />
            <button className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-[#4C1182]">
              Exportar Excel
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Código", "Nombre", "DNI", "Sexo", "Edad", "Barrio", "Categoría", "Estado", "Fecha"].map(
                  (heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(reclamos as ReclamoCompleto[] | null)?.map((reclamo) => (
                <tr key={reclamo.id}>
                  <td className="px-4 py-3 font-mono text-xs text-[#9333EA]">{reclamo.numero_seguimiento}</td>
                  <td className="px-4 py-3">{reclamo.vecino_nombre} {reclamo.vecino_apellido ?? ""}</td>
                  <td className="px-4 py-3">{reclamo.vecino_dni}</td>
                  <td className="px-4 py-3">{reclamo.vecino_sexo ?? "—"}</td>
                  <td className="px-4 py-3">{reclamo.edad ?? "—"}</td>
                  <td className="px-4 py-3">{reclamo.vecino_barrio}</td>
                  <td className="px-4 py-3">{reclamo.categoria}</td>
                  <td className="px-4 py-3">{reclamo.estado}</td>
                  <td className="px-4 py-3">
                    {new Date(reclamo.created_at).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              )) ?? null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#4C1182]">Auditoría reciente</h2>
          <div className="mt-4 space-y-3">
            {auditLogs?.map((log) => (
              <div key={log.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-sm font-semibold text-[#4C1182]">{log.accion}</p>
                <p className="text-xs text-gray-500">
                  {log.entidad} · {new Date(log.created_at).toLocaleString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#4C1182]">Configuración crítica</h2>
          <div className="mt-4 space-y-3 text-sm text-[#6f6487]">
            <p>Superadmin único controlado por variable de entorno `SUPERADMIN_EMAIL`.</p>
            <p>Google Drive preparado para backups y exportaciones si cargás las credenciales.</p>
            <p>La home pública sigue sin mostrar login ni accesos internos visibles.</p>
          </div>
        </section>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[#4C1182]">{value}</p>
    </div>
  );
}

function inputClassName() {
  return "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9333EA]";
}

function getBirthdateRange(range: AgeRange) {
  const now = new Date();

  const toDate = (yearsAgo: number) => {
    const date = new Date(now);
    date.setFullYear(now.getFullYear() - yearsAgo);
    return date.toISOString().slice(0, 10);
  };

  switch (range) {
    case "under_18":
      return { min: toDate(18), max: null };
    case "18_29":
      return { min: toDate(29), max: toDate(18) };
    case "30_44":
      return { min: toDate(44), max: toDate(30) };
    case "45_59":
      return { min: toDate(59), max: toDate(45) };
    case "60_plus":
      return { min: null, max: toDate(60) };
  }
}
