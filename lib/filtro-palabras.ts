// ─── Normalización ────────────────────────────────────────────────────────

function normalizar(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    // leet speak: números y símbolos como letras
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/\$/g, "s")
    .replace(/@/g, "a")
    .replace(/!/g, "i");
}

// ─── Listas ───────────────────────────────────────────────────────────────

const PALABRAS: string[] = [
  // Insultos argentinos básicos
  "pelotudo", "pelotuda", "pelotudos", "pelotudas",
  "boludo", "boluda", "boludos", "boludas",
  "forro", "forra", "forros",
  "puta", "puto", "putas", "putos", "reputa", "reputo",
  "concha", "conchas", "conchuda", "conchudo",
  "mierda",
  "sorete", "soretes",
  "culo", "culos",
  "carajo",
  "hdp", "hptm",
  "cagon", "cagona", "cagones", "cagonas",
  "tarado", "tarada", "tarados", "taradas",
  "pajero", "pajera", "pajeros", "pajeras",
  "trolo", "trola", "trolos", "trolas",
  "verga", "vergas",
  "pinga", "pingas",
  "choto", "chota", "chotos", "chotas",
  "maricon", "maricones",
  "otario", "otaria", "otarios", "otarias",
  "cabron", "cabrona", "cabrones",
  "pendejo", "pendeja", "pendejos", "pendejas",
  "cretino", "cretina", "cretinos", "cretinas",
  "imbecil", "imbeciles",
  "estupido", "estupida", "estupidos", "estupidas",
  "idiota", "idiotas",
  "garca", "garcas",
  // coger y conjugaciones (exclusivamente sexual en Argentina)
  "coger", "coge", "coges", "cogen",
  "cogete", "cogela", "cogelo",
  "cogiendo", "cogido", "cogida", "cogidos", "cogidas",
  // garchar
  "garchar", "garcha", "garchan", "garchando", "garchado", "garchada",
  // culear
  "culear", "culea", "culean", "culeando", "culeado", "culeada",
  // joder
  "joder", "jode", "jodes", "joden", "jodete",
  // Discriminación / xenofobia argentina
  "bolita", "paragua", "peruca", "brasuca", "sudaca",
  "villero", "villera",
  "planero", "planera",
  // Amenazas directas
  "matalos", "matate",
];

const FRASES: string[] = [
  // Insultos compuestos
  "hijo de puta", "hija de puta",
  "la puta madre",
  "la concha de tu madre", "la concha de la lora",
  "la reconcha",
  "anda a cagar", "andate a la mierda",
  "a la mierda",
  "negro de mierda", "gordo de mierda",
  "mal parido", "mal parida",
  "tu mama", "tu vieja",
  "tomatela",
  "que te cog", "que lo cog",
  // Amenazas
  "te mato", "los mato",
  "te voy a matar", "los voy a matar",
  "te voy a buscar", "los voy a buscar",
  "te voy a encontrar",
  "voy a ir a tu casa", "voy a ir a buscarte",
  // Insultos políticos (partido + insulto = inapropiado en un reclamo vecinal)
  "kirchnerista de mierda", "peronista de mierda",
  "libertario de mierda", "radical de mierda",
  "macrista de mierda", "comunista de mierda",
  "socialista de mierda",
  // Discriminación
  "negro villero", "villero de mierda",
  "bolita de mierda", "paragua de mierda", "sudaca de mierda",
];

// Palabras comunes escritas al revés para evadir filtros
const INVERTIDAS: string[] = [
  "odulob",    // boludo
  "adulob",    // boluda
  "odulotep",  // pelotudo
  "adreim",    // mierda
  "atup",      // puta
  "otup",      // puto
  "oluc",      // culo
  "agrev",     // verga
  "agnip",     // pinga
  "atohc",     // chota
  "otohc",     // choto
  "oteroc",    // corete? → sorete reversed = "eteros" no... "sorete" → "eteros"... actually:
  // sorete reversed = e-t-e-r-o-s = "eteros" — skip
  // "forro" reversed = "orrof"
  "orrof",     // forro
];

// Nombres protegidos: si aparecen + un insulto, el texto es rechazado
const NOMBRES_PROTEGIDOS = ["frattini", "cristian"];

// Partidos políticos: su presencia junto a un insulto = inapropiado
const PARTIDOS_POLITICOS = [
  "kirchnerista", "kirchner",
  "peronista", "peronismo",
  "libertario", "libertad avanza",
  "radical", "radicales",
  "macrista", "macrismo",
  "socialista", "comunista",
];

// Insultos graves usados para las verificaciones de nombre/partido
const INSULTOS_GRAVES = [
  "mierda", "puta", "puto", "pelotudo", "boludo", "imbecil",
  "idiota", "hdp", "sorete", "culo", "basura", "corrupto",
  "corrupcion", "ladron", "chorro", "delincuente",
  "muerte", "muerto", "matar", "matalos",
];

// Pre-normalizamos todas las listas para no repetir trabajo en cada llamada
const PALABRAS_N = PALABRAS.map(normalizar);
const FRASES_N = FRASES.map(normalizar);
const INVERTIDAS_N = INVERTIDAS.map(normalizar);
const INSULTOS_N = INSULTOS_GRAVES.map(normalizar);
const NOMBRES_N = NOMBRES_PROTEGIDOS.map(normalizar);
const PARTIDOS_N = PARTIDOS_POLITICOS.map(normalizar);

// ─── Transformaciones del texto ───────────────────────────────────────────

// "b o l u d o" → "boludo" (une runs de letras individuales separadas por espacio)
function colapsarLetrasEspaciadas(text: string): string {
  const tokens = text.split(" ");
  const out: string[] = [];
  let run = "";
  for (const t of tokens) {
    if (/^[a-z]$/.test(t)) {
      run += t;
    } else {
      if (run) { out.push(run); run = ""; }
      out.push(t);
    }
  }
  if (run) out.push(run);
  return out.join(" ");
}

// "b*o*l*u*d*o" o "b.o.l.u.d.o" → "boludo"
function eliminarCaractEspeciales(text: string): string {
  let prev = "";
  let cur = text;
  // Itera hasta que no haya más cambios (maneja cadenas largas como a*b*c*d)
  while (cur !== prev) {
    prev = cur;
    cur = cur.replace(/([a-z])[^a-z\s]([a-z])/g, "$1$2");
  }
  return cur;
}

// "puttttaaa" → "puta", "miiierda" → "mierda"
function deduplicarLetras(text: string): string {
  return text.replace(/(.)\1+/g, "$1");
}

// Genera múltiples vistas del texto para máxima cobertura
function generarVistas(texto: string): string[] {
  const norm = normalizar(texto);
  const espaciadas = colapsarLetrasEspaciadas(norm);
  const sinEsp = eliminarCaractEspeciales(norm);
  const dedup = deduplicarLetras(norm);
  const todo = deduplicarLetras(eliminarCaractEspeciales(espaciadas));
  return [norm, espaciadas, sinEsp, dedup, todo];
}

// ─── Verificadores auxiliares ─────────────────────────────────────────────

function tieneMatch(vista: string, patron: string): boolean {
  return new RegExp(`\\b${patron}\\b`).test(vista);
}

function tieneMatchEnTokens(vista: string, patron: string): boolean {
  return vista.split(/\s+/).some((t) => t.replace(/[^a-z]/g, "") === patron);
}

// ─── Función principal ────────────────────────────────────────────────────

export function contieneInapropiado(texto: string): boolean {
  if (!texto || !texto.trim()) return false;

  const vistas = generarVistas(texto);

  for (const vista of vistas) {
    // Palabras individuales con word boundary
    for (const p of PALABRAS_N) {
      if (tieneMatch(vista, p)) return true;
    }

    // Palabras al revés
    for (const inv of INVERTIDAS_N) {
      if (tieneMatch(vista, inv)) return true;
    }

    // Frases como substring
    for (const f of FRASES_N) {
      if (vista.includes(f)) return true;
    }

    // Per-token: detecta "p.u.t.a" o "b*o*l*u*d*o" (token = unidad sin espacios)
    for (const p of PALABRAS_N) {
      if (tieneMatchEnTokens(vista, p)) return true;
    }
  }

  // Verificación: nombre protegido + insulto grave
  const normBase = vistas[0];
  if (NOMBRES_N.some((n) => tieneMatch(normBase, n))) {
    if (INSULTOS_N.some((i) => tieneMatch(normBase, i))) return true;
    // También bloquear si el nombre aparece solo (evita insultos tipo "FRATTINI TOMATELA")
    for (const f of FRASES_N) {
      if (normBase.includes(f)) return true;
    }
  }

  // Verificación: partido político + insulto grave
  if (PARTIDOS_N.some((p) => normBase.includes(p))) {
    if (INSULTOS_N.some((i) => tieneMatch(normBase, i))) return true;
  }

  return false;
}
