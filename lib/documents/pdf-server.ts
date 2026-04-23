import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { ReclamoCompleto } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export async function generarPDFReclamo(r: ReclamoCompleto): Promise<Buffer> {
  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const purple = rgb(0.298, 0.067, 0.51);
  const white = rgb(1, 1, 1);
  const gray = rgb(0.4, 0.4, 0.4);
  const lightPurple = rgb(0.953, 0.937, 1);

  page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: purple });
  page.drawText("BLOQUE LA LIBERTAD AVANZA AVELLANEDA", { x: 50, y: height - 25, size: 13, font: bold, color: white });
  page.drawText("Mesa de Ayuda Vecinal", { x: 50, y: height - 40, size: 10, font: regular, color: white });
  page.drawText(`Reclamo N° ${r.numero_seguimiento}`, { x: 50, y: height - 55, size: 9, font: regular, color: white });

  let y = height - 85;
  const drawSection = (title: string) => { page.drawText(title, { x: 50, y, size: 11, font: bold, color: purple }); y -= 18; };
  const drawRow = (label: string, value: string) => {
    page.drawRectangle({ x: 50, y: y - 4, width: 130, height: 18, color: lightPurple });
    page.drawRectangle({ x: 180, y: y - 4, width: 365, height: 18, color: rgb(0.98, 0.98, 0.98) });
    page.drawText(label, { x: 54, y, size: 9, font: bold, color: purple });
    page.drawText((value || "—").slice(0, 70), { x: 184, y, size: 9, font: regular, color: rgb(0.2, 0.2, 0.2) });
    y -= 20;
  };

  drawSection("DATOS DEL RECLAMO");
  drawRow("N° Seguimiento", r.numero_seguimiento);
  drawRow("Estado", r.estado);
  drawRow("Categoría", r.categoria);
  drawRow("Subcategoría", r.subcategoria);
  drawRow("Fecha", new Date(r.created_at).toLocaleDateString("es-AR"));
  y -= 10;

  drawSection("DATOS DEL VECINO");
  drawRow("Nombre", r.vecino_nombre);
  drawRow("DNI", r.vecino_dni);
  drawRow("Teléfono", r.vecino_telefono);
  drawRow("Email", r.vecino_email ?? "—");
  drawRow("Dir. denunciante", detalle.direccionDenunciante);
  drawRow("Dir. problema", detalle.direccionProblema);
  drawRow("Entre calles", r.vecino_entre_calles ?? "—");
  drawRow("Barrio", r.vecino_barrio);
  y -= 10;

  drawSection("DESCRIPCIÓN DEL PROBLEMA");
  let line = "";
  for (const word of detalle.descripcion.split(" ")) {
    if ((line + word).length > 80) {
      page.drawText(line.trim(), { x: 50, y, size: 9, font: regular, color: rgb(0.2, 0.2, 0.2) });
      y -= 14;
      line = `${word} `;
    } else {
      line += `${word} `;
    }
  }
  if (line.trim()) {
    page.drawText(line.trim(), { x: 50, y, size: 9, font: regular, color: rgb(0.2, 0.2, 0.2) });
  }

  page.drawText(`Generado el ${new Date().toLocaleString("es-AR")} — Bloque La Libertad Avanza Avellaneda`, { x: 50, y: 20, size: 7, font: regular, color: gray });
  return Buffer.from(await doc.save());
}
