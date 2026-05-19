import fs from "node:fs/promises";
import path from "node:path";

const ejerciciosFaltantes = [
  "https://www.simplyfitness.com/es/pages/cable-crossover",
  "https://www.simplyfitness.com/es/pages/cable-rope-puschdown",
  "https://www.simplyfitness.com/es/pages/close-grip-bench-press",
  "https://www.simplyfitness.com/es/pages/kickback",
];

const archivo = path.join(
  process.cwd(),
  "src/data/importados/ejercicios-simplyfitness.json"
);

const carpetaImagenes = path.join(
  process.cwd(),
  "public/ejercicios-importados"
);

await fs.mkdir(carpetaImagenes, { recursive: true });

const ejerciciosActuales = JSON.parse(await fs.readFile(archivo, "utf8"));

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

async function descargarEjercicio(urlFuente) {
  const html = await fetch(urlFuente).then((r) => r.text());

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
    imagenUrl = `https://www.simplyfitness.com${imagenUrl}`;
  }

  let imagen = "";

  if (imagenUrl) {
    const respuestaImagen = await fetch(imagenUrl);

    if (respuestaImagen.ok) {
      const buffer = Buffer.from(await respuestaImagen.arrayBuffer());

      const nombreArchivo = `${id}.png`;

      await fs.writeFile(
        path.join(carpetaImagenes, nombreArchivo),
        buffer
      );

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

for (const url of ejerciciosFaltantes) {
  const yaExiste = ejerciciosActuales.some(
    (ejercicio) => ejercicio.urlFuente === url
  );

  if (yaExiste) {
    console.log("Ya existe:", url);
    continue;
  }

  const ejercicio = await descargarEjercicio(url);

  ejerciciosActuales.push(ejercicio);

  console.log("Agregado:", ejercicio.nombre);
}

await fs.writeFile(
  archivo,
  JSON.stringify(ejerciciosActuales, null, 2),
  "utf8"
);

console.log("LISTO");