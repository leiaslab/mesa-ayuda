const PALABRAS: string[] = [
  "pelotudo", "pelotuda", "pelotudos", "pelotudas",
  "boludo", "boluda", "boludos", "boludas",
  "forro", "forra", "forros",
  "puta", "puto", "putas", "putos",
  "concha", "conchas", "conchuda", "conchudo",
  "mierda",
  "sorete", "soretes",
  "culo", "culos",
  "carajo",
  "hdp",
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
  // coger y conjugaciones (en Argentina tiene exclusivamente significado sexual)
  "coger", "coge", "coges", "cogen", "cogete", "cogela", "cogelo",
  "cogiendo", "cogido", "cogida", "cogidos", "cogidas",
  // garchar y conjugaciones
  "garchar", "garcha", "garchan", "garchando", "garchado", "garchada",
  // culear y conjugaciones
  "culear", "culea", "culean", "culeando", "culeado", "culeada",
  // joder
  "joder", "jode", "jodes", "joden", "jodete",
  // put* adicionales
  "reputa", "reputo",
  "hptm",
];

const FRASES: string[] = [
  "hijo de puta",
  "hija de puta",
  "la puta madre",
  "la concha de tu madre",
  "la concha de la lora",
  "la reconcha",
  "anda a cagar",
  "andate a la mierda",
  "a la mierda",
  "negro de mierda",
  "gordo de mierda",
  "mal parido",
  "mal parida",
  "tu mama",
  "tu vieja",
  "tomatela",
  "andate a la",
  "que te cog",
  "que lo cog",
];

function normalizar(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    // leet speak
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

// Extracts joined strings from runs of single-character tokens (detects "p u t a" style evasion)
function runsDeLetras(tokens: string[]): string[] {
  const resultado: string[] = [];
  let actual = "";
  for (const t of tokens) {
    if (t.length === 1) {
      actual += t;
    } else {
      if (actual.length > 1) resultado.push(actual);
      actual = "";
    }
  }
  if (actual.length > 1) resultado.push(actual);
  return resultado;
}

export function contieneInapropiado(texto: string): boolean {
  const norm = normalizar(texto);
  const tokens = norm.split(/\s+/).filter(Boolean);
  // Per-token: strip non-alpha from each whitespace token (catches "p.u.t.a", "p*u*t*a")
  const colapsados = tokens.map((t) => t.replace(/[^a-z]/g, ""));
  const runs = runsDeLetras(colapsados);

  for (const palabra of PALABRAS) {
    const p = normalizar(palabra);
    // 1. Word boundary in normalized text (standard writing)
    if (new RegExp(`\\b${p}\\b`).test(norm)) return true;
    // 2. Per-token exact match (chars with dots/symbols between them)
    if (colapsados.includes(p)) return true;
    // 3. Spaced-out letters: "p u t a" → run "puta"
    if (runs.some((r) => r.includes(p))) return true;
  }

  for (const frase of FRASES) {
    const f = normalizar(frase);
    // Phrase in normal text
    if (norm.includes(f)) return true;
    // Phrase written letter by letter with spaces
    const fColapsa = f.replace(/\s/g, "");
    if (runs.some((r) => r.includes(fColapsa))) return true;
  }

  return false;
}
