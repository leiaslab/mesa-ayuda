import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReclamoCompleto, Database } from "@/types/database";
import { ESTADO_LABELS } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export async function generarPDF(
  reclamoId: string,
  numeroSeguimiento: string,
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const { data: reclamo } = await supabase.from("reclamos_completos").select("*").eq("id", reclamoId).single();
  if (!reclamo) throw new Error("Reclamo no encontrado");

  const r = reclamo as ReclamoCompleto;
  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(76, 17, 130);
  doc.rect(0, 0, width, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BLOQUE LA LIBERTAD AVANZA AVELLANEDA", width / 2, 12, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Mesa de Ayuda Vecinal", width / 2, 19, { align: "center" });
  doc.setFontSize(9);
  doc.text(`Reclamo N° ${numeroSeguimiento}`, width / 2, 26, { align: "center" });

  doc.setTextColor(76, 17, 130);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL RECLAMO", 15, 42);
  autoTable(doc, { startY: 46, head: [], body: [["N° Seguimiento", r.numero_seguimiento], ["Estado", ESTADO_LABELS[r.estado]], ["Categoría", r.categoria], ["Subcategoría", r.subcategoria], ["Fecha", new Date(r.created_at).toLocaleDateString("es-AR")]], theme: "grid", styles: { fontSize: 9, cellPadding: 3 }, columnStyles: { 0: { fontStyle: "bold", cellWidth: 45, fillColor: [243, 238, 255] } }, margin: { left: 15, right: 15 } });

  const y1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DATOS DEL VECINO", 15, y1);
  autoTable(doc, { startY: y1 + 4, head: [], body: [["Nombre y apellido", r.vecino_nombre], ["DNI", r.vecino_dni], ["Teléfono", r.vecino_telefono], ["Email", r.vecino_email ?? "—"], ["Dir. denunciante", detalle.direccionDenunciante], ["Dir. problema", detalle.direccionProblema], ["Entre calles", r.vecino_entre_calles ?? "—"], ["Barrio", r.vecino_barrio]], theme: "grid", styles: { fontSize: 9, cellPadding: 3 }, columnStyles: { 0: { fontStyle: "bold", cellWidth: 45, fillColor: [243, 238, 255] } }, margin: { left: 15, right: 15 } });

  const y2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  doc.text("DESCRIPCIÓN DEL PROBLEMA", 15, y2);
  autoTable(doc, { startY: y2 + 4, head: [], body: [[detalle.descripcion]], theme: "grid", styles: { fontSize: 9, cellPadding: 4 }, margin: { left: 15, right: 15 } });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`Generado el ${new Date().toLocaleString("es-AR")} — Bloque La Libertad Avanza Avellaneda`, width / 2, pageHeight - 8, { align: "center" });

  const filename = `${r.numero_seguimiento}_${Date.now()}.pdf`;
  const storagePath = `reclamos/${reclamoId}/${filename}`;
  const pdfBlob = doc.output("blob");
  const { error: uploadError } = await supabase.storage.from("documentos").upload(storagePath, pdfBlob, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw new Error("Error al subir el PDF");

  const { data: urlData } = supabase.storage.from("documentos").getPublicUrl(storagePath);
  await supabase.from("documentos_generados").insert({ reclamo_id: reclamoId, tipo_documento: "pdf", nombre_archivo: filename, archivo_url: urlData.publicUrl, archivo_path: storagePath, generado_por: userId || null });
  doc.save(filename);
}
