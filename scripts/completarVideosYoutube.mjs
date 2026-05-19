import fs from "node:fs/promises";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");
const env = await fs.readFile(envPath, "utf8");

const apiKey = env
  .split("\n")
  .find((line) => line.startsWith("YOUTUBE_API_KEY="))
  ?.split("=")[1]
  ?.trim();

if (!apiKey) {
  throw new Error("No se encontró YOUTUBE_API_KEY en .env");
}

const archivo = path.join(
  process.cwd(),
  "src/data/importados/ejercicios-simplyfitness.json"
);

const ejercicios = JSON.parse(await fs.readFile(archivo, "utf8"));

async function buscarVideo(nombre) {
  const busqueda = `${nombre} técnica ejercicio gimnasio`;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");

  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", busqueda);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("key", apiKey);

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(texto);
  }

  const data = await respuesta.json();

  return data.items?.[0]?.id?.videoId ?? "";
}

for (let i = 0; i < ejercicios.length; i++) {
  const ejercicio = ejercicios[i];

  if (ejercicio.youtubeId) {
    continue;
  }

  console.log(`[${i + 1}/${ejercicios.length}] Buscando: ${ejercicio.nombre}`);

  try {
    const youtubeId = await buscarVideo(ejercicio.nombre);

    ejercicio.youtubeId = youtubeId;

    console.log(`Video: ${youtubeId || "sin resultado"}`);

    await new Promise((resolve) => setTimeout(resolve, 250));
  } catch (error) {
    console.log(`Error buscando ${ejercicio.nombre}`);
    console.log(error.message);
    break;
  }
}

await fs.writeFile(archivo, JSON.stringify(ejercicios, null, 2), "utf8");

console.log("LISTO: videos guardados en el JSON");