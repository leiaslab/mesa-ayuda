type StoredReclamoPayload = {
  direccionProblema: string | null;
  descripcion: string;
};

const PROBLEM_ADDRESS_MARKER = "[[direccion_problema]]";

export function buildStoredReclamoDescription({
  direccionProblema,
  descripcion,
}: {
  direccionProblema: string;
  descripcion: string;
}) {
  return `${PROBLEM_ADDRESS_MARKER}${direccionProblema.trim()}\n\n${descripcion.trim()}`;
}

export function parseStoredReclamoDescription(
  value?: string | null
): StoredReclamoPayload {
  const rawValue = value?.trim() ?? "";

  if (!rawValue) {
    return {
      direccionProblema: null,
      descripcion: "",
    };
  }

  if (!rawValue.startsWith(PROBLEM_ADDRESS_MARKER)) {
    return {
      direccionProblema: null,
      descripcion: rawValue,
    };
  }

  const [, problemAddressBlock = "", descriptionBlock = ""] =
    rawValue.match(/^\[\[direccion_problema\]\](.+?)(?:\r?\n){2}([\s\S]*)$/) ?? ["", "", ""];

  return {
    direccionProblema: problemAddressBlock.trim() || null,
    descripcion: descriptionBlock.trim(),
  };
}

export function getReclamoDisplayData({
  descripcion,
  direccionDenunciante,
}: {
  descripcion?: string | null;
  direccionDenunciante: string;
}) {
  const parsed = parseStoredReclamoDescription(descripcion);

  return {
    descripcion: parsed.descripcion,
    direccionDenunciante,
    direccionProblema: parsed.direccionProblema ?? direccionDenunciante,
  };
}

export function buildSheetsDescription({
  descripcion,
  direccionDenunciante,
}: {
  descripcion: string;
  direccionDenunciante: string;
}) {
  return `Direccion del denunciante: ${direccionDenunciante.trim()}\n${descripcion.trim()}`;
}
