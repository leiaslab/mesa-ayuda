import type { ReclamoEstado, ReclamoPrioridad } from "@/types/database";
import { ESTADO_LABELS, ESTADO_COLORS, PRIORIDAD_LABELS, PRIORIDAD_COLORS } from "@/types/database";

export function StatusBadge({ estado }: { estado: ReclamoEstado }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${ESTADO_COLORS[estado]}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {ESTADO_LABELS[estado]}
    </span>
  );
}

export function PrioridadBadge({ prioridad }: { prioridad: ReclamoPrioridad }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${PRIORIDAD_COLORS[prioridad]}`}
    >
      {PRIORIDAD_LABELS[prioridad]}
    </span>
  );
}
