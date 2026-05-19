import fs from "node:fs/promises";
import path from "node:path";

const archivo = path.join(
  process.cwd(),
  "src/data/importados/ejercicios-simplyfitness.json"
);

const ejercicios = JSON.parse(await fs.readFile(archivo, "utf8"));

const palabrasAEliminar = [
  "recursos",
  "calculadora",
  "calculator",
  "gasto energetico",
  "tasa metabolica",
  "indice de masa corporal",
  "creador de planes",
  "comidas",
  "meal",
];

const filtrados = ejercicios.filter((ejercicio) => {
  const texto = `${ejercicio.nombre} ${ejercicio.urlFuente}`.toLowerCase();

  return !palabrasAEliminar.some((palabra) => texto.includes(palabra));
});

console.log(`Antes: ${ejercicios.length}`);
console.log(`Después: ${filtrados.length}`);
console.log(`Eliminados: ${ejercicios.length - filtrados.length}`);

await fs.writeFile(archivo, JSON.stringify(filtrados, null, 2), "utf8");

console.log("LISTO");