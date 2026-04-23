import type { ReclamoCompleto } from "@/types/database";
import { ESTADO_LABELS, PRIORIDAD_LABELS } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export async function generarExcelHCD(r: ReclamoCompleto): Promise<void> {
  const XLSX = await import("xlsx");

  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });

  const fecha = new Date(r.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const datos: [string, string][] = [
    ["N° Seguimiento", r.numero_seguimiento],
    ["Estado", ESTADO_LABELS[r.estado]],
    ["Prioridad", PRIORIDAD_LABELS[r.prioridad]],
    ["Categoría", r.categoria],
    ["Subcategoría", r.subcategoria],
    ["Descripción", detalle.descripcion],
    ["Dirección del problema", detalle.direccionProblema],
    ["Nombre vecino/a", r.vecino_nombre],
    ["DNI", r.vecino_dni],
    ["Teléfono", r.vecino_telefono],
    ["Email", r.vecino_email ?? "—"],
    ["Dirección denunciante", detalle.direccionDenunciante],
    ["Entre calles", r.vecino_entre_calles ?? "—"],
    ["Barrio", r.vecino_barrio],
    ["Fecha del reclamo", fecha],
    ["Observaciones internas", r.observaciones_internas ?? "—"],
  ];

  const ws = XLSX.utils.aoa_to_sheet([
    ["Honorable Concejo Deliberante de Avellaneda — Mesa de Ayuda Vecinal"],
    [`Reclamo N° ${r.numero_seguimiento}`],
    [],
    ["Campo", "Valor"],
    ...datos,
  ]);

  // Ancho de columnas
  ws["!cols"] = [{ wch: 28 }, { wch: 60 }];

  // Merge título (A1:B1) y subtítulo (A2:B2)
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reclamo");

  XLSX.writeFile(wb, `Reclamo_${r.numero_seguimiento}.xlsx`);
}
