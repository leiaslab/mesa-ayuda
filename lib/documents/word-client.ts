import {
  AlignmentType,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
  WidthType,
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
  let especifico =
    "la problemática planteada afecta directamente la calidad de vida de los vecinos del municipio.";

  if (/luminaria|alumbrado|luz/.test(cat))
    especifico =
      "el alumbrado público es un servicio esencial que garantiza la seguridad de los vecinos en el espacio público.";
  else if (/bache|calzada|calle|vial|asfalto|vereda/.test(cat))
    especifico =
      "el mantenimiento de calles y veredas es responsabilidad del municipio y hace a la seguridad vial de los vecinos.";
  else if (/cloaca|agua|desag|saneamiento/.test(cat))
    especifico =
      "el acceso al agua potable y el correcto funcionamiento del sistema de desagüe son servicios esenciales para la salud pública.";
  else if (/basura|residuo|limpieza|higiene/.test(cat))
    especifico =
      "la recolección de residuos es un servicio esencial que hace a la higiene y salubridad del municipio.";
  else if (/inundaci[oó]n|pluvial/.test(cat))
    especifico =
      "el correcto funcionamiento del sistema pluvial es esencial para prevenir daños materiales y riesgos para la salud de los vecinos.";
  else if (/inseguridad|seguridad/.test(cat))
    especifico =
      "la seguridad pública es un derecho fundamental de los vecinos y una obligación del Estado municipal.";

  return [
    "Que el presente reclamo fue debidamente recibido y registrado por el sistema de Mesa de Ayuda Vecinal.",
    "Que es función del Honorable Concejo Deliberante de Avellaneda elevar al Departamento Ejecutivo las problemáticas que afectan a los vecinos del municipio.",
    `Que ${especifico}`,
    "Que las autoridades municipales competentes deben dar respuesta oportuna al presente reclamo.",
    "Que el vecino tiene derecho a recibir una respuesta concreta y en tiempo razonable sobre el estado de su solicitud.",
  ];
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

function spacer(lines = 1) {
  return Array.from(
    { length: lines },
    () => new Paragraph({ children: [new TextRun({ text: "" })] })
  );
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
        spacing: { after: 80 },
        children: [
          new ImageRun({
            data: logoData,
            transformation: { width: 72, height: 72 },
            type: "png",
          }),
        ],
      })
    : null;

  const doc = new Document({
    styles: { default: { document: { run: { font: "Times New Roman", size: 22 } } } },
    sections: [
      {
        properties: {
          page: { margin: { top: 900, bottom: 900, left: 1200, right: 1200 } },
        },
        children: [
          // Logo
          ...(logoParagraph ? [logoParagraph] : []),

          // Título principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Honorable Concejo Deliberante de Avellaneda",
                bold: true,
                size: 24,
              }),
            ],
          }),

          // Año header italic
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({ text: ANIO_HEADER, italics: true, size: 18, color: "333333" }),
            ],
          }),

          // Fecha alineada a la derecha
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
            children: [new TextRun({ text: `Avellaneda, ${fecha}`, size: 22 })],
          }),

          // VISTO
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({ text: "VISTO: ", bold: true, size: 22 }),
              new TextRun({
                text: `${detalle.descripcion} en ${detalle.direccionProblema}, barrio ${r.vecino_barrio}.`,
                size: 22,
              }),
            ],
          }),

          // CONSIDERANDO título
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
                children: [new TextRun({ text: `• ${bullet}`, size: 22 })],
              })
          ),

          ...spacer(3),

          // PROYECTO DE COMUNICACIÓN
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "PROYECTO DE COMUNICACIÓN", bold: true, size: 22 }),
            ],
          }),

          // Párrafo final
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text:
                  `El Bloque La Libertad Avanza Avellaneda se dirige al Honorable Departamento Ejecutivo ` +
                  `de la Municipalidad de Avellaneda solicitando intervenga a la brevedad posible en el ` +
                  `siguiente reclamo vecinal correspondiente a la categoría "${r.categoria}" — "${r.subcategoria}": ` +
                  `${detalle.descripcion} ` +
                  `El reclamo fue presentado por el/la vecino/a ${r.vecino_nombre} ` +
                  `(DNI ${r.vecino_dni}), con domicilio en ${detalle.direccionDenunciante}, Barrio ${r.vecino_barrio}. ` +
                  `El presente fue registrado bajo el N° de seguimiento ${r.numero_seguimiento}. ` +
                  `Se solicita dar respuesta oportuna y comunicar las acciones tomadas al respecto.`,
                size: 22,
              }),
            ],
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
