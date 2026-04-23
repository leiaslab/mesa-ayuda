import type { ReclamoCompleto } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

const ANIO_HEADER =
  "Año de los Derechos Humanos por la Memoria, la Verdad y la Justicia.\n" +
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
    especifico.push("Que el alumbrado público es un servicio esencial que garantiza la seguridad de los vecinos");
  else if (/bache|calzada|calle|vial|asfalto/.test(cat))
    especifico.push("Que el mantenimiento de calles y calzadas es responsabilidad del Departamento Ejecutivo Municipal");
  else if (/basura|residuo|limpieza|higiene/.test(cat))
    especifico.push("Que la recolección de residuos y la higiene urbana son servicios fundamentales para la salud pública");
  else if (/cloaca|agua|desag|saneamiento/.test(cat))
    especifico.push("Que el acceso a los servicios de agua potable y saneamiento cloacal es un derecho básico");
  else if (/arbol|verde|plaza|espacio/.test(cat))
    especifico.push("Que el cuidado del arbolado público y los espacios verdes hace al bienestar de la comunidad");

  return [
    "Que el reclamo fue debidamente registrado en el sistema de Mesa de Ayuda Vecinal",
    "Que es función del H.C.D. elevar al Departamento Ejecutivo las problemáticas vecinales",
    ...especifico,
    "Que las autoridades competentes deben dar respuesta oportuna al presente reclamo",
  ];
}

async function fetchLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/hcd-logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generarPDFHCD(r: ReclamoCompleto): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const marginL = 20;
  const marginR = 20;
  const textW = W - marginL - marginR;
  let y = 15;

  // Logo
  const logoDataUrl = await fetchLogoDataUrl();
  if (logoDataUrl) {
    const logoSize = 28;
    doc.addImage(logoDataUrl, "PNG", (W - logoSize) / 2, y, logoSize, logoSize);
    y += logoSize + 4;
  } else {
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.setTextColor(30, 60, 120);
    doc.text("Honorable Concejo Deliberante de Avellaneda", W / 2, y + 6, { align: "center" });
    y += 14;
  }

  // Año header (italic, centrado)
  doc.setFontSize(8);
  doc.setFont("times", "italic");
  doc.setTextColor(60, 60, 60);
  const headerLines = doc.splitTextToSize(ANIO_HEADER, textW);
  doc.text(headerLines, W / 2, y, { align: "center" });
  y += headerLines.length * 5 + 6;

  // Fecha
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(`Avellaneda, ${fechaEspanol()}`, marginL, y);
  y += 10;

  // VISTO
  doc.setFont("times", "bold");
  doc.text("VISTO:", marginL, y);
  doc.setFont("times", "normal");
  const vistoText = ` ${detalle.descripcion} en ${detalle.direccionProblema}, barrio ${r.vecino_barrio}.`;
  const vistoLines = doc.splitTextToSize(vistoText, textW - 14);
  doc.text(vistoLines, marginL + 14, y);
  y += vistoLines.length * 5 + 6;

  // CONSIDERANDO
  doc.setFont("times", "bold");
  doc.text("CONSIDERANDO:", marginL, y);
  y += 6;
  doc.setFont("times", "normal");
  const considerandos = generarConsiderando(r.categoria);
  for (const bullet of considerandos) {
    const lines = doc.splitTextToSize(`• ${bullet}.`, textW - 6);
    doc.text(lines, marginL + 4, y);
    y += lines.length * 5 + 2;
  }
  y += 6;

  // PROYECTO DE COMUNICACIÓN
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("PROYECTO DE COMUNICACIÓN", marginL, y);
  y += 8;

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const proyectoText =
    `El Bloque La Libertad Avanza Avellaneda se dirige al Honorable Departamento Ejecutivo ` +
    `de la Municipalidad de Avellaneda solicitando intervenga a la brevedad en el reclamo ` +
    `correspondiente a la categoría "${r.categoria}" — "${r.subcategoria}": ${detalle.descripcion} ` +
    `Presentado por ${r.vecino_nombre} (DNI ${r.vecino_dni}), domiciliado/a en ` +
    `${detalle.direccionDenunciante}, Barrio ${r.vecino_barrio}. ` +
    `N° de seguimiento: ${r.numero_seguimiento}. ` +
    `Se solicita dar respuesta oportuna y comunicar las acciones tomadas.`;
  const proyectoLines = doc.splitTextToSize(proyectoText, textW);
  doc.text(proyectoLines, marginL, y);
  y += proyectoLines.length * 5 + 10;

  // Tabla resumen
  autoTable(doc, {
    startY: y,
    head: [["Campo", "Valor"]],
    body: [
      ["N° Seguimiento", r.numero_seguimiento],
      ["Categoría", `${r.categoria} — ${r.subcategoria}`],
      ["Vecino", `${r.vecino_nombre} — DNI ${r.vecino_dni}`],
      ["Dirección", detalle.direccionProblema],
      ["Barrio", r.vecino_barrio],
      ["Teléfono", r.vecino_telefono],
      ["Fecha", new Date(r.created_at).toLocaleDateString("es-AR")],
    ],
    theme: "grid",
    headStyles: { fillColor: [30, 60, 120], textColor: 255, fontSize: 9, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 3, font: "times" },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45, fillColor: [232, 237, 245] } },
    margin: { left: marginL, right: marginR },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;

  // Firma
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("Cristian Frattini", marginL, finalY);
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("Presidente del Bloque — La Libertad Avanza Avellaneda", marginL, finalY + 5);
  doc.text("Honorable Concejo Deliberante de Avellaneda", marginL, finalY + 10);

  // Footer
  const pH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text(
    `Generado el ${new Date().toLocaleString("es-AR")} — Sistema Mesa de Ayuda`,
    W / 2,
    pH - 8,
    { align: "center" }
  );

  doc.save(`Proyecto_${r.numero_seguimiento}.pdf`);
}
