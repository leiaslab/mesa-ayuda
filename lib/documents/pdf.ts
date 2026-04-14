// Generación de PDF — se ejecuta en el browser (client component)
// jspdf solo corre en contexto browser, no en Node.js sin polyfills

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReclamoCompleto, Database } from "@/types/database";
import { ESTADO_LABELS } from "@/types/database";

export async function generarPDF(
  reclamoId:        string,
  numeroSeguimiento: string,
  supabase:         SupabaseClient<Database>,
  userId:           string
): Promise<void> {
  // Importación dinámica para evitar SSR issues
  const { jsPDF }     = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  // Obtener datos del reclamo
  const { data: reclamo } = await supabase
    .from("reclamos_completos")
    .select("*")
    .eq("id", reclamoId)
    .single();

  if (!reclamo) throw new Error("Reclamo no encontrado");
  const r = reclamo as ReclamoCompleto;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W   = doc.internal.pageSize.getWidth();

  // ── Encabezado ──────────────────────────────────────────────
  doc.setFillColor(50, 16, 91); // #32105B
  doc.rect(0, 0, W, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BLOQUE LA LIBERTAD AVANZA AVELLANEDA", W / 2, 12, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Mesa de Ayuda Vecinal", W / 2, 19, { align: "center" });

  doc.setFontSize(9);
  doc.text(`Reclamo N° ${r.numero_seguimiento}`, W / 2, 26, { align: "center" });

  // ── Info del reclamo ─────────────────────────────────────────
  doc.setTextColor(50, 16, 91);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL RECLAMO", 15, 42);

  autoTable(doc, {
    startY: 46,
    head:   [],
    body:   [
      ["N° Seguimiento", r.numero_seguimiento],
      ["Estado",         ESTADO_LABELS[r.estado]],
      ["Categoría",      r.categoria],
      ["Subcategoría",   r.subcategoria],
      ["Fecha",          new Date(r.created_at).toLocaleDateString("es-AR")],
    ],
    theme:      "grid",
    styles:     { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45, fillColor: [243, 238, 255] } },
    margin:     { left: 15, right: 15 },
  });

  const y1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // ── Datos del vecino ─────────────────────────────────────────
  doc.setTextColor(50, 16, 91);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DATOS DEL VECINO", 15, y1);

  autoTable(doc, {
    startY: y1 + 4,
    head:   [],
    body:   [
      ["Nombre y apellido", r.vecino_nombre],
      ["DNI",               r.vecino_dni],
      ["Teléfono",          r.vecino_telefono],
      ["Email",             r.vecino_email ?? "—"],
      ["Dirección",         r.vecino_direccion],
      ["Entre calles",      r.vecino_entre_calles ?? "—"],
      ["Barrio",            r.vecino_barrio],
    ],
    theme:      "grid",
    styles:     { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45, fillColor: [243, 238, 255] } },
    margin:     { left: 15, right: 15 },
  });

  const y2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // ── Descripción ──────────────────────────────────────────────
  doc.setTextColor(50, 16, 91);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DESCRIPCIÓN DEL PROBLEMA", 15, y2);

  autoTable(doc, {
    startY: y2 + 4,
    head:   [],
    body:   [[r.descripcion]],
    theme:  "grid",
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { left: 15, right: 15 },
  });

  // ── Footer ───────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado el ${new Date().toLocaleString("es-AR")} — Bloque La Libertad Avanza Avellaneda`,
    W / 2,
    pageH - 8,
    { align: "center" }
  );

  // ── Guardar y subir ──────────────────────────────────────────
  const filename    = `${r.numero_seguimiento}_${Date.now()}.pdf`;
  const storagePath = `reclamos/${reclamoId}/${filename}`;

  const pdfBlob = doc.output("blob");

  const { error: uploadError } = await supabase.storage
    .from("documentos")
    .upload(storagePath, pdfBlob, { contentType: "application/pdf", upsert: false });

  if (uploadError) throw new Error("Error al subir el PDF");

  const { data: urlData } = supabase.storage
    .from("documentos")
    .getPublicUrl(storagePath);

  // Registrar en documentos_generados
  await supabase.from("documentos_generados").insert({
    reclamo_id:     reclamoId,
    tipo_documento: "pdf",
    nombre_archivo: filename,
    archivo_url:    urlData.publicUrl,
    archivo_path:   storagePath,
    generado_por:   userId || null,
  });

  // Descargar automáticamente
  doc.save(filename);
}
