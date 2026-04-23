import {
  AlignmentType,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
  WidthType,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  ShadingType,
} from "docx";
import type { ReclamoCompleto } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

const ANIO_HEADER =
  "Año de los Derechos Humanos por la Memoria, la Verdad y la Justicia. " +
  "A 50 años de la última Dictadura Cívico – Militar";

function fechaEspanol(date = new Date()): string {
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function generarConsiderando(categoria: string): string[] {
  const cat = categoria.toLowerCase();
  const especifico: string[] = [];

  if (/luminaria|alumbrado|luz/.test(cat))
    especifico.push(
      "Que el alumbrado público es un servicio esencial que garantiza la seguridad de los vecinos en el espacio público"
    );
  else if (/bache|calzada|calle|vial|asfalto/.test(cat))
    especifico.push(
      "Que el mantenimiento de calles y calzadas es responsabilidad del Departamento Ejecutivo Municipal y hace a la seguridad vial y peatonal"
    );
  else if (/basura|residuo|limpieza|higiene/.test(cat))
    especifico.push(
      "Que la recolección de residuos y la higiene urbana son servicios fundamentales para la salud pública de la comunidad"
    );
  else if (/cloaca|agua|desag|saneamiento/.test(cat))
    especifico.push(
      "Que el acceso a los servicios de agua potable y saneamiento cloacal es un derecho básico de los vecinos del municipio"
    );
  else if (/arbol|verde|plaza|espacio/.test(cat))
    especifico.push(
      "Que el cuidado del arbolado público y los espacios verdes hace al bienestar y calidad de vida de la comunidad"
    );
  else if (/transito|trafico|señal|semaforo/.test(cat))
    especifico.push(
      "Que la regulación del tránsito y el correcto señalamiento vial son indispensables para la seguridad de los vecinos"
    );

  return [
    "Que el presente reclamo fue debidamente recibido y registrado por el sistema de Mesa de Ayuda Vecinal",
    "Que es función del Honorable Concejo Deliberante de Avellaneda elevar al Departamento Ejecutivo las problemáticas que afectan a los vecinos del municipio",
    ...especifico,
    "Que las autoridades municipales competentes deben dar respuesta oportuna al presente reclamo",
    "Que el vecino tiene derecho a recibir una respuesta concreta y en tiempo razonable sobre el estado de su solicitud",
  ];
}

function makeRow(label: string, value: string) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: "E8EDF5" },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: value || "—", size: 20 })] })],
      }),
    ],
  });
}

function tableBorders() {
  const b = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
}

async function fetchLogo(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch("/hcd-logo.png");
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function generarWordHCD(r: ReclamoCompleto): Promise<void> {
  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });

  const fecha = fechaEspanol();
  const considerandos = generarConsiderando(r.categoria);
  const logoData = await fetchLogo();

  const logoParagraph = logoData
    ? new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new ImageRun({
            data: logoData,
            transformation: { width: 90, height: 90 },
            type: "png",
          }),
        ],
      })
    : new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "Honorable Concejo Deliberante de Avellaneda", bold: true, size: 24 })],
      });

  const doc = new Document({
    styles: { default: { document: { run: { font: "Times New Roman", size: 22 } } } },
    sections: [
      {
        properties: {
          page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 } },
        },
        children: [
          // Logo
          logoParagraph,

          // Año header (italic, centered)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [new TextRun({ text: ANIO_HEADER, italics: true, size: 18, color: "333333" })],
          }),

          // Fecha
          new Paragraph({
            spacing: { after: 240 },
            children: [new TextRun({ text: `Avellaneda, ${fecha}`, size: 22 })],
          }),

          // VISTO
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: "VISTO:", bold: true, size: 22 }),
              new TextRun({
                text: ` ${detalle.descripcion} en ${detalle.direccionProblema}, barrio ${r.vecino_barrio}.`,
                size: 22,
              }),
            ],
          }),

          // CONSIDERANDO title
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: "CONSIDERANDO:", bold: true, size: 22 })],
          }),

          // Bullets
          ...considerandos.map(
            (bullet) =>
              new Paragraph({
                spacing: { after: 80 },
                indent: { left: 360 },
                children: [new TextRun({ text: `• Que ${bullet.replace(/^Que /, "")}.`, size: 22 })],
              })
          ),

          new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "" })] }),

          // Proyecto de Comunicación
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "PROYECTO DE COMUNICACIÓN", bold: true, size: 24, allCaps: true }),
            ],
          }),

          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text:
                  `El Bloque La Libertad Avanza Avellaneda se dirige al Honorable Departamento Ejecutivo ` +
                  `de la Municipalidad de Avellaneda solicitando intervenga a la brevedad posible en el ` +
                  `siguiente reclamo vecinal correspondiente a la categoría "${r.categoria}" — "${r.subcategoria}": ` +
                  `${detalle.descripcion} El reclamo fue presentado por el/la vecino/a ${r.vecino_nombre} ` +
                  `(DNI ${r.vecino_dni}), con domicilio en ${detalle.direccionDenunciante}, Barrio ${r.vecino_barrio}. ` +
                  `El presente fue registrado bajo el N° de seguimiento ${r.numero_seguimiento}. ` +
                  `Se solicita dar respuesta oportuna y comunicar las acciones tomadas al respecto.`,
                size: 22,
              }),
            ],
          }),

          // Datos del reclamo (tabla resumen)
          new Paragraph({
            spacing: { after: 160, before: 240 },
            children: [new TextRun({ text: "Datos del reclamo", bold: true, size: 22 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders(),
            rows: [
              makeRow("N° Seguimiento", r.numero_seguimiento),
              makeRow("Categoría", `${r.categoria} — ${r.subcategoria}`),
              makeRow("Vecino", `${r.vecino_nombre} — DNI ${r.vecino_dni}`),
              makeRow("Dirección", detalle.direccionProblema),
              makeRow("Barrio", r.vecino_barrio),
              makeRow("Teléfono", r.vecino_telefono),
              makeRow("Fecha", new Date(r.created_at).toLocaleDateString("es-AR")),
            ],
          }),

          new Paragraph({ spacing: { before: 480, after: 120 }, children: [new TextRun({ text: "" })] }),

          // Firma
          new Paragraph({
            children: [new TextRun({ text: "Cristian Frattini", bold: true, size: 22 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Presidente del Bloque — La Libertad Avanza Avellaneda", size: 20, color: "555555" })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Honorable Concejo Deliberante de Avellaneda", size: 20, color: "555555" })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Proyecto_${r.numero_seguimiento}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
