"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Recorta al centro en proporción 3:4, escala a máx 1200px de alto, exporta JPEG 85%
function resizeToSplash(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const TARGET_RATIO = 3 / 4;
      const MAX_HEIGHT = 1200;

      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;

      // Center-crop al ratio 3:4
      let cropW: number, cropH: number, cropX: number, cropY: number;
      if (srcW / srcH > TARGET_RATIO) {
        cropH = srcH;
        cropW = srcH * TARGET_RATIO;
        cropX = (srcW - cropW) / 2;
        cropY = 0;
      } else {
        cropW = srcW;
        cropH = srcW / TARGET_RATIO;
        cropX = 0;
        cropY = (srcH - cropH) / 2;
      }

      const scale = Math.min(1, MAX_HEIGHT / cropH);
      const outW = Math.round(cropW * scale);
      const outH = Math.round(cropH * scale);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas no disponible")); return; }

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Error al procesar la imagen")); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          }));
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("No se pudo cargar la imagen")); };
    img.src = objectUrl;
  });
}

export default function SplashUploader({ currentUrl }: { currentUrl: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFile = async (file: File) => {
    setStatus(null);

    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "El archivo debe ser una imagen (JPG, PNG o WebP)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "La imagen no puede superar 5 MB." });
      return;
    }

    setProcessing(true);
    try {
      const resized = await resizeToSplash(file);
      const url = URL.createObjectURL(resized);
      setPreview(url);
      setSelectedFile(resized);
    } catch {
      setStatus({ type: "error", message: "No se pudo procesar la imagen. Intentá con otra." });
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setStatus(null);

    const form = new FormData();
    form.append("imagen", selectedFile);

    try {
      const res = await fetch("/api/admin/splash", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Error al subir la imagen" });
      } else {
        setStatus({ type: "success", message: "Imagen actualizada correctamente. Se verá en la próxima visita al sitio." });
        setPreview(null);
        setSelectedFile(null);
        router.refresh(); // 👈 cambio importante
      }
    } catch {
      setStatus({ type: "error", message: "Error de conexión. Intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    setStatus(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const displaySrc = preview ?? currentUrl;
  const isExternal = displaySrc.startsWith("http");

  return (
    <div className="space-y-6">
      {/* Imagen actual / previsualización */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
        <div className="flex-shrink-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            {preview ? "Nueva imagen (previsualización)" : "Imagen actual"}
          </p>
          <div className="relative w-[140px] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm sm:w-[160px]">
            {isExternal ? (
              <img src={displaySrc} alt="Splash actual" className="h-auto w-full" />
            ) : (
              <Image src={displaySrc} alt="Splash actual" width={320} height={450} className="h-auto w-full" />
            )}
            {preview && (
              <div className="absolute inset-x-0 bottom-0 bg-[#9333EA] py-1 text-center text-[0.6rem] font-bold uppercase tracking-widest text-white">
                Nueva
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 self-stretch">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Subir nueva imagen
          </p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !processing && inputRef.current?.click()}
            className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-colors ${
              processing
                ? "cursor-wait border-[#9333EA]/40 bg-[#f3eeff]"
                : dragging
                ? "border-[#9333EA] bg-[#f3eeff]"
                : "border-gray-200 bg-gray-50 hover:border-[#9333EA]/50 hover:bg-[#faf7ff]"
            }`}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">
                {processing ? "Procesando imagen…" : dragging ? "Soltá para seleccionar" : "Arrastrá o hacé clic para elegir"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {processing ? "Recortando a 3:4 y comprimiendo" : "JPG, PNG o WebP · Máx. 5 MB · Se recorta a proporción 3:4"}
              </p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {status && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${
          status.type === "success"
            ? "border-green-100 bg-green-50 text-green-700"
            : "border-red-100 bg-red-50 text-red-600"
        }`}>
          {status.message}
        </div>
      )}

      {(selectedFile || processing) && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || processing}
            className="rounded-xl bg-[#4C1182] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar imagen"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || processing}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}