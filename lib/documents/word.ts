import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { ReclamoCompleto } from "@/types/database";
import { ESTADO_LABELS } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export async function generarWord(r: ReclamoCompleto): Promise<Buffer> {
  const fecha = new Date(r.created_at).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });

  const makeRow = (label: string, value: string) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: "F3EEFF" },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: value || "—", size: 20 })] })],
        }),
      ],
    });

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
    sections: [{
      children: [
        new Paragraph({ text: "BLOQUE LA LIBERTAD AVANZA AVELLANEDA", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "Mesa de Ayuda Vecinal — Reclamo Formal", bold: true, size: 22, color: "6011E8" })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
        new Paragraph({ children: [new TextRun({ text: "N° de Seguimiento: ", bold: true, size: 24 }), new TextRun({ text: r.numero_seguimiento, bold: true, size: 24, color: "32105B" })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
        new Paragraph({ text: "PROYECTO DE COMUNICACIÓN", heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: "VISTO: ", bold: true }), new TextRun({ text: `El reclamo presentado por el vecino ${r.vecino_nombre}, DNI ${r.vecino_dni}, con fecha ${fecha}, correspondiente a la categoría ${r.categoria} — ${r.subcategoria}.` })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: "CONSIDERANDO: ", bold: true }), new TextRun({ text: "Que es deber del Bloque La Libertad Avanza Avellaneda gestionar y dar respuesta oportuna a los reclamos vecinales; que el presente reclamo fue debidamente registrado en el sistema de Mesa de Ayuda con número de seguimiento correspondiente." })], spacing: { after: 200 } }),
        new Paragraph({ children: [new TextRun({ text: "DETALLE DEL PROBLEMA: ", bold: true }), new TextRun({ text: detalle.descripcion })], spacing: { after: 400 } }),
        new Paragraph({ text: "DATOS DEL RECLAMO", heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" } }, rows: [makeRow("N° Seguimiento", r.numero_seguimiento), makeRow("Estado", ESTADO_LABELS[r.estado]), makeRow("Categoría", r.categoria), makeRow("Subcategoría", r.subcategoria), makeRow("Fecha", fecha)] }),
        new Paragraph({ text: "", spacing: { after: 300 } }),
        new Paragraph({ text: "DATOS DEL VECINO", heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" } }, rows: [makeRow("Nombre y apellido", r.vecino_nombre), makeRow("DNI", r.vecino_dni), makeRow("Teléfono", r.vecino_telefono), makeRow("Email", r.vecino_email ?? "—"), makeRow("Dir. denunciante", detalle.direccionDenunciante), makeRow("Dir. problema", detalle.direccionProblema), makeRow("Entre calles", r.vecino_entre_calles ?? "—"), makeRow("Barrio", r.vecino_barrio)] }),
        new Paragraph({ text: "", spacing: { after: 600 } }),
        new Paragraph({ children: [new TextRun({ text: "Cristian Frattini", bold: true, size: 24 })], alignment: AlignmentType.LEFT }),
        new Paragraph({ children: [new TextRun({ text: "Coordinador local y Presidente del Bloque de Concejales", size: 20, color: "6B7280" })] }),
        new Paragraph({ children: [new TextRun({ text: "Bloque La Libertad Avanza Avellaneda", size: 20, color: "6B7280" })] }),
      ],
    }],
  });

  return Packer.toBuffer(doc);
}
