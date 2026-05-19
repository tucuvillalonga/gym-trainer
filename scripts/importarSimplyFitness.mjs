import fs from "node:fs/promises";
import path from "node:path";

const archivo = path.join(
  process.cwd(),
  "src/data/importados/ejercicios-simplyfitness.json"
);

const carpetaImagenes = path.join(
  process.cwd(),
  "src/assets/ejercicios-importados"
);

await fs.mkdir(carpetaImagenes, {
  recursive: true,
});

const ejercicios = JSON.parse(
  await fs.readFile(
    archivo,
    "utf8"
  )
);

/* SOLO EJERCICIOS */

const palabrasEjercicio = [
  "press",
  "bench",
  "curl",
  "raise",
  "fly",
  "row",
  "pulldown",
  "pull-up",
  "push-up",
  "extension",
  "squat",
  "deadlift",
  "lunge",
  "dip",
  "crunch",
  "plank",
  "calf",
];

const ejerciciosFiltrados =
  ejercicios.filter(
    (ejercicio) =>
      ejercicio.urlFuente &&
      palabrasEjercicio.some(
        (palabra) =>
          ejercicio.urlFuente
            .toLowerCase()
            .includes(
              palabra
            )
      )
  );

console.log(
  `Ejercicios detectados: ${ejerciciosFiltrados.length}`
);

for (
  let i = 0;
  i <
  ejerciciosFiltrados.length;
  i++
) {
  const ejercicio =
    ejerciciosFiltrados[i];

  try {
    console.log(
      `[${i + 1}/${ejerciciosFiltrados.length}]`,
      ejercicio.nombre
    );

    const html =
      await fetch(
        ejercicio.urlFuente
      ).then((r) =>
        r.text()
      );

    const imagenes = [
      ...html.matchAll(
        /<img[^>]+src="([^"]+)"/gi
      ),
    ]
      .map(
        (m) => m[1]
      )
      .filter(
        (src) =>
          !src.includes(
            "logo"
          )
      )
      .filter(
        (src) =>
          src.includes(
            "cdn"
          )
      )
      .filter(
        (src) =>
          src.match(
            /\.(jpg|jpeg|png|webp)/i
          )
      );

    let imagen =
      imagenes[0];

    if (!imagen)
      continue;

    if (
      imagen.startsWith(
        "//"
      )
    ) {
      imagen =
        `https:${imagen}`;
    }

    if (
      imagen.startsWith(
        "/"
      )
    ) {
      imagen =
        `https://www.simplyfitness.com${imagen}`;
    }

    const respuesta =
      await fetch(
        imagen
      );

    if (
      !respuesta.ok
    )
      continue;

    const buffer =
      Buffer.from(
        await respuesta.arrayBuffer()
      );

    const extension =
      imagen
        .split(".")
        .pop()
        ?.split("?")[0] ||
      "jpg";

    const nombre =
      `${ejercicio.id}.${extension}`;

    await fs.writeFile(
      path.join(
        carpetaImagenes,
        nombre
      ),
      buffer
    );

    ejercicio.imagen =
      `/src/assets/ejercicios-importados/${nombre}`;

  } catch {
    console.log(
      "ERROR:",
      ejercicio.nombre
    );
  }
}

await fs.writeFile(
  archivo,
  JSON.stringify(
    ejerciciosFiltrados,
    null,
    2
  )
);

console.log(
  "LISTO 🚀"
);