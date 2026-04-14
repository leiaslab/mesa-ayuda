// Generación de Excel (.xlsx) — se ejecuta server-side en API routes

import ExcelJS from "exceljs";
import type { ReclamoCompleto } from "@/types/database";
import { ESTADO_LABELS, PRIORIDAD_LABELS } from "@/types/database";

export async function generarExcel(reclamos: ReclamoCompleto[]): Promise<Buffer> {
  const workbook  = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reclamos", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  // Metadata
  workbook.creator  = "Bloque La Libertad Avanza Avellaneda";
  workbook.subject  = "Reclamos Vecinales";
  workbook.created  = new Date();

  // ── Columnas ──────────────────────────────────────────────────
  worksheet.columns = [
    { header: "N° Seguimiento",  key: "numero_seguimiento", width: 22 },
    { header: "Estado",          key: "estado",             width: 14 },
    { header: "Prioridad",       key: "prioridad",          width: 12 },
    { header: "Categoría",       key: "categoria",          width: 16 },
    { header: "Subcategoría",    key: "subcategoria",       width: 18 },
    { header: "Nombre",          key: "vecino_nombre",      width: 24 },
    { header: "DNI",             key: "vecino_dni",         width: 12 },
    { header: "Teléfono",        key: "vecino_telefono",    width: 16 },
    { header: "Email",           key: "vecino_email",       width: 24 },
    { header: "Dirección",       key: "vecino_direccion",   width: 28 },
    { header: "Entre calles",    key: "vecino_entre_calles", width: 22 },
    { header: "Barrio",          key: "vecino_barrio",      width: 18 },
    { header: "Descripción",     key: "descripcion",        width: 50 },
    { header: "Fecha",           key: "created_at",         width: 16 },
    { header: "Actualizado",     key: "updated_at",         width: 16 },
  ];

  // ── Estilo de header ──────────────────────────────────────────
  const headerRow = worksheet.getRow(1);
  headerRow.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
  headerRow.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF32105B" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height    = 22;

  // ── Datos ─────────────────────────────────────────────────────
  const estadoColors: Record<string, string> = {
    pendiente:  "FFFEF3C7",
    en_proceso: "FFDBEAFE",
    resuelto:   "FFDCFCE7",
    rechazado:  "FFFEE2E2",
    cerrado:    "FFF3F4F6",
  };

  reclamos.forEach((r, i) => {
    const row = worksheet.addRow({
      numero_seguimiento:  r.numero_seguimiento,
      estado:              ESTADO_LABELS[r.estado],
      prioridad:           PRIORIDAD_LABELS[r.prioridad],
      categoria:           r.categoria,
      subcategoria:        r.subcategoria,
      vecino_nombre:       r.vecino_nombre,
      vecino_dni:          r.vecino_dni,
      vecino_telefono:     r.vecino_telefono,
      vecino_email:        r.vecino_email ?? "",
      vecino_direccion:    r.vecino_direccion,
      vecino_entre_calles: r.vecino_entre_calles ?? "",
      vecino_barrio:       r.vecino_barrio,
      descripcion:         r.descripcion,
      created_at:          new Date(r.created_at).toLocaleDateString("es-AR"),
      updated_at:          new Date(r.updated_at).toLocaleDateString("es-AR"),
    });

    // Alternating row color + estado color en columna estado
    const bgColor = i % 2 === 0 ? "FFFFFFFF" : "FFF9F5FF";
    row.eachCell((cell) => {
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.font      = { size: 9 };
    });

    // Colorear celda de estado
    const estadoCell = row.getCell("estado");
    estadoCell.fill = {
      type: "pattern", pattern: "solid",
      fgColor: { argb: estadoColors[r.estado] ?? "FFFFFFFF" },
    };
    estadoCell.font = { bold: true, size: 9 };

    row.height = 18;
  });

  // ── Bordes ────────────────────────────────────────────────────
  const borderStyle: ExcelJS.Border = { style: "thin", color: { argb: "FFE5E7EB" } };
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: borderStyle, bottom: borderStyle,
        left: borderStyle, right: borderStyle,
      };
    });
  });

  // ── Filtros automáticos ───────────────────────────────────────
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to:   { row: 1, column: worksheet.columns.length },
  };

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
