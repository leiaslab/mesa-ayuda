import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const TIPOS_VALIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type MimeValido = (typeof TIPOS_VALIDOS)[number];

export async function POST(request: NextRequest) {
  try {
    const { foto_base64, foto_mime } = await request.json();

    if (!foto_base64 || !foto_mime) {
      return NextResponse.json({ error: "Faltan datos de la imagen" }, { status: 400 });
    }

    if (!TIPOS_VALIDOS.includes(foto_mime as MimeValido)) {
      return NextResponse.json({ error: "Tipo de imagen no soportado" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: foto_mime as MimeValido,
                data: foto_base64,
              },
            },
            {
              type: "text",
              text: '¿Esta imagen contiene contenido inapropiado, violento, sexual, ofensivo o que no corresponde a un reclamo vecinal (como calles, luminarias, basura, inundaciones, edificios, vehículos, animales, personas, documentos, etc.)? Respondé solo con JSON válido sin texto adicional: {"apropiada": true, "motivo": ""}',
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);

    if (!jsonMatch) {
      return NextResponse.json({ apropiada: true, motivo: "" });
    }

    const resultado = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      apropiada: Boolean(resultado.apropiada),
      motivo: String(resultado.motivo ?? ""),
    });
  } catch (err) {
    console.error("Error en POST /api/moderar-imagen:", err);
    // Fail open: if moderation errors, don't block the upload
    return NextResponse.json({ apropiada: true, motivo: "" });
  }
}
