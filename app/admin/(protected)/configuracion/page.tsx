import { requireRole } from "@/lib/security/auth";
import { PRIVATE_LOGIN_PATH } from "@/lib/config/internal";
import { isGoogleDriveEnabled } from "@/lib/google-drive";
import { isGoogleSheetsEnabled } from "@/lib/google-sheets";

export default async function ConfiguracionPage() {
  await requireRole("super_admin");

  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Configuración crítica</h1>
        <p className="mt-1 text-sm text-gray-400">
          Variables sensibles, seguridad y servicios internos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#4C1182]">Acceso privado</h2>
          <div className="mt-4 rounded-2xl border border-[#ebe1fb] bg-[#f7f2ff] p-4">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#9333EA]">
              Ruta de login
            </p>
            <p className="mt-2 font-mono text-lg font-extrabold text-[#4C1182]">
              {PRIVATE_LOGIN_PATH}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6c5b87]">
              Esta ruta no aparece en la home ni en el footer público.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#4C1182]">Backups y exportaciones</h2>
          <div className="mt-4 space-y-3">
            <StatusRow
              label="Google Drive"
              value={isGoogleDriveEnabled() ? "Configurado" : "Pendiente"}
              active={isGoogleDriveEnabled()}
            />
            <StatusRow
              label="Google Sheets"
              value={isGoogleSheetsEnabled() ? "Configurado" : "Pendiente"}
              active={isGoogleSheetsEnabled()}
            />
            <StatusRow
              label="Supabase Storage"
              value="Activo"
              active
            />
            <StatusRow
              label="Auditoría sensible"
              value="Activa"
              active
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-[#4C1182]">Notas de seguridad</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#6f6487] md:grid-cols-2">
            <p className="rounded-xl bg-gray-50 px-4 py-3">
              El rol de superadmin queda reservado exclusivamente al email definido en
              <code className="ml-1 rounded bg-white px-1.5 py-0.5 text-xs text-[#4C1182]">
                SUPERADMIN_EMAIL
              </code>
              .
            </p>
            <p className="rounded-xl bg-gray-50 px-4 py-3">
              Las exportaciones se generan del lado servidor y pueden replicarse a Google
              Drive sin exponer credenciales al cliente.
            </p>
            <p className="rounded-xl bg-gray-50 px-4 py-3">
              La home pública sigue sin mostrar login, links a admin ni accesos técnicos.
            </p>
            <p className="rounded-xl bg-gray-50 px-4 py-3">
              Intentos fallidos de acceso, cambios de estado y exportaciones quedan en
              auditoría.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span
        className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${
          active ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
