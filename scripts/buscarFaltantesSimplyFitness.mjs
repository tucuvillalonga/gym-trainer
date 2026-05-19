import fs from "node:fs/promises";
import path from "node:path";

const URL_BASE = "https://www.simplyfitness.com";

const paginasCategorias = [
  "https://www.simplyfitness.com/es/pages/chest-exercise-guides",
  "https://www.simplyfitness.com/es/pages/back-exercise-guides",
  "https://www.simplyfitness.com/es/pages/shoulders-exercise-guides",
  "https://www.simplyfitness.com/es/pages/biceps-exercise-guides",
  "https://www.simplyfitness.com/es/pages/triceps-exercise-guides",
  "https://www.simplyfitness.com/es/pages/legs-exercise-guides",
];

const archivoJson = path.join(
  process.cwd(),
  "src/data/importados/ejercicios-simplyfitness.json"
);

const carpetaImagenes = path.join(
  process.cwd(),
  "public/ejercicios-importados"
);

await fs.mkdir(carpetaImagenes, { recursive: true });

const ejerciciosActuales = JSON.parse(await fs.readFile(archivoJson, "utf8"));

function limpiarTexto(texto) {
  return texto.replace(/\s+/g, " ").trim();
}

function crearSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizarUrl(href) {
  if (href.startsWith("http")) return href;
  return `${URL_BASE}${href}`;
}

async function obtenerHtml(url) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error descargando ${url}: ${respuesta.status}`);
  }

  return respuesta.text();
}

async function descargarEjercicio(urlFuente) {
  const html = await obtenerHtml(urlFuente);

  const titulo =
    html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "") ??
    urlFuente.split("/").pop();

  const nombre = limpiarTexto(titulo);
  const id = crearSlug(nombre);

  const imagenes = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)]
    .map((m) => m[1])
    .filter((src) => !src.includes("logo"))
    .filter((src) => src.includes("cdn"))
    .filter((src) => src.match(/\.(jpg|jpeg|png|webp)/i));

  let imagenUrl = imagenes[0] ?? "";

  if (imagenUrl.startsWith("//")) {
    imagenUrl = `https:${imagenUrl}`;
  }

  if (imagenUrl.startsWith("/")) {
    imagenUrl = `${URL_BASE}${imagenUrl}`;
  }

  let imagen = "";

  if (imagenUrl) {
    const respuestaImagen = await fetch(imagenUrl);

    if (respuestaImagen.ok) {
      const buffer = Buffer.from(await respuestaImagen.arrayBuffer());
      const nombreArchivo = `${id}.png`;

      await fs.writeFile(path.join(carpetaImagenes, nombreArchivo), buffer);

      imagen = `/ejercicios-importados/${nombreArchivo}`;
    }
  }

  return {
    id,
    nombre,
    grupoMuscular: "Sin clasificar",
    musculoPrincipal: "sinClasificar",
    dificultad: "Sin definir",
    urlFuente,
    imagen,
    descripcion: "",
    checklist: [],
    erroresComunes: [],
    mapaDeEnfoque: [],
    youtubeId: "",
  };
}

const urlsActuales = new Set(
  ejerciciosActuales.map((ejercicio) => ejercicio.urlFuente)
);

const urlsEncontradas = new Set();

for (const pagina of paginasCategorias) {
  console.log("Leyendo categoría:", pagina);

  const html = await obtenerHtml(pagina);

  const links = [...html.matchAll(/<a[^>]+href="([^"]+)"/gi)]
    .map((m) => normalizarUrl(m[1]))
    .filter((url) => url.includes("/es/pages/"))
    .filter((url) => !url.includes("exercise-guides"))
    .filter((url) => !url.includes("program"))
    .filter((url) => !url.includes("privacy"))
    .filter((url) => !url.includes("refund"))
    .filter((url) => !url.includes("contact"))
    .filter((url) => !url.includes("calculator"))
    .filter((url) => !url.includes("calculadora"))
    .filter((url) => !url.includes("meal"))
    .filter((url) => !url.includes("creator"))
    .filter((url) => !url.includes("resources"))
    .filter((url) => !url.includes("recursos"));

  for (const link of links) {
    urlsEncontradas.add(link);
  }
}

const faltantes = [...urlsEncontradas].filter((url) => !urlsActuales.has(url));

console.log(`Encontrados en categorías: ${urlsEncontradas.size}`);
console.log(`Faltantes detectados: ${faltantes.length}`);

for (let i = 0; i < faltantes.length; i++) {
  const url = faltantes[i];

  try {
    console.log(`[${i + 1}/${faltantes.length}] Agregando ${url}`);

    const ejercicio = await descargarEjercicio(url);

    ejerciciosActuales.push(ejercicio);

    console.log("Agregado:", ejercicio.nombre);
  } catch (error) {
    console.log("Error agregando:", url);
    console.log(error.message);
  }
}

await fs.writeFile(
  archivoJson,
  JSON.stringify(ejerciciosActuales, null, 2),
  "utf8"
);

console.log("LISTO");