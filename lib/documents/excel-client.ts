import type { ReclamoCompleto } from "@/types/database";
import { ESTADO_LABELS, PRIORIDAD_LABELS } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export async function generarExcelHCD(r: ReclamoCompleto): Promise<void> {
  const XLSX = await import("xlsx");

  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });

  const headers = [
    "N° Seguimiento",
    "Nombre vecino",
    "DNI",
    "Teléfono",
    "Email",
    "Dirección",
    "Barrio",
    "Categoría",
    "Subcategoría",
    "Descripción",
    "Estado",
    "Prioridad",
    "Fecha",
  ];

  const row = [
    r.numero_seguimiento,
    r.vecino_nombre,
    r.vecino_dni,
    r.vecino_telefono,
    r.vecino_email ?? "—",
    detalle.direccionProblema,
    r.vecino_barrio,
    r.categoria,
    r.subcategoria,
    detalle.descripcion,
    ESTADO_LABELS[r.estado],
    PRIORIDAD_LABELS[r.prioridad],
    new Date(r.created_at).toLocaleDateString("es-AR"),
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, row]);

  // Ancho de columnas proporcional al contenido
  ws["!cols"] = headers.map((h, i) => ({
    wch: Math.max(h.length, String(row[i] ?? "").length, 12),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reclamo");

  XLSX.writeFile(wb, `reclamo-${r.numero_seguimiento}.xlsx`);
}
