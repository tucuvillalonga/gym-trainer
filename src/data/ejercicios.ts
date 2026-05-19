import type { Ejercicio } from "../types/ejercicio";
import ejerciciosImportados from "./importados/ejercicios-simplyfitness.json";

function clasificarEjercicio(nombre: string, url: string, id: string) {
  const texto = `${nombre} ${url}`.toLowerCase();

    if (id === "elevacion-de-piernas") {
    return {
        grupoMuscular: "Core",
        musculoPrincipal: "abdominales" as const,

        mapaDeEnfoque: [
        {
            region: "abdominales" as const,
            nivel: "principal" as const,
        },
        {
            region: "oblicuos" as const,
            nivel: "secundario" as const,
        },
        ],
    };
    }

// Press francés → Triceps
if (
  texto.includes("press frances") ||
  texto.includes("press francés") ||
  texto.includes("french press")
) {
  return {
    grupoMuscular: "Triceps",

    musculoPrincipal: "triceps" as const,

    mapaDeEnfoque: [
      {
        region: "triceps" as const,
        nivel: "principal" as const,
      },

      {
        region: "deltoides" as const,
        nivel: "indirecto" as const,
      },
    ],
  };
}

// Elevaciones de rodilla → Core
if (
  texto.includes("elevaciones de rodilla") ||
  texto.includes("elevacion de rodilla") ||
  texto.includes("elevación de rodilla") ||
  texto.includes("knee raise")
) {
  return {
    grupoMuscular: "Core",

    musculoPrincipal: "abdominales" as const,

    mapaDeEnfoque: [
      {
        region: "abdominales" as const,
        nivel: "principal" as const,
      },

      {
        region: "oblicuos" as const,
        nivel: "secundario" as const,
      },
    ],
  };
}

// Remo alto → Hombros
if (
  texto.includes("upright row") ||
  texto.includes("remo alto")
) {
  return {
    grupoMuscular: "Hombros",

    musculoPrincipal: "deltoides" as const,

    mapaDeEnfoque: [
      {
        region: "deltoides" as const,
        nivel: "principal" as const,
      },

      {
        region: "trapecios" as const,
        nivel: "secundario" as const,
      },

      {
        region: "biceps" as const,
        nivel: "indirecto" as const,
      },
    ],
  };
}
  // REGLAS ESPECIALES (prioridad alta)

// Elevacion de piernas → Core
if (
  (
    texto.includes("leg raise") ||
    texto.includes("leg raises") ||
    texto.includes("elevacion de piernas") ||
    texto.includes("elevaciones de piernas") ||
    texto.includes("hanging leg") ||
    texto.includes("knee raise") ||
    texto.includes("knee raises")
  ) &&

  !texto.includes("press") &&
  !texto.includes("curl")
) {
  return {
    grupoMuscular: "Core",

    musculoPrincipal: "abdominales" as const,

    mapaDeEnfoque: [
      {
        region: "abdominales" as const,
        nivel: "principal" as const,
      },

      {
        region: "oblicuos" as const,
        nivel: "secundario" as const,
      },
    ],
  };
}

// Fondos en banco → Triceps
if (
  texto.includes("bench dip") ||
  texto.includes("fondos en banco")
) {
  return {
    grupoMuscular: "Triceps",

    musculoPrincipal: "triceps" as const,

    mapaDeEnfoque: [
      {
        region: "triceps" as const,
        nivel: "principal" as const,
      },

      {
        region: "pectoral" as const,
        nivel: "secundario" as const,
      },

      {
        region: "deltoides" as const,
        nivel: "indirecto" as const,
      },
    ],
  };
}

// Cruces inversos → Hombros
if (
  texto.includes("reverse fly") ||
  texto.includes("rear delt") ||
  texto.includes("cruces inversos")
) {
  return {
    grupoMuscular: "Hombros",

    musculoPrincipal: "deltoides" as const,

    mapaDeEnfoque: [
      {
        region: "deltoides" as const,
        nivel: "principal" as const,
      },

      {
        region: "trapecios" as const,
        nivel: "secundario" as const,
      },

      {
        region: "dorsales" as const,
        nivel: "indirecto" as const,
      },
    ],
  };
}

  // CORE (primero para que tenga prioridad)
  if (
    texto.includes("abdominal") ||
    texto.includes("abs") ||
    texto.includes("crunch") ||
    texto.includes("plank") ||
    texto.includes("knee raise") ||
    texto.includes("leg raise") ||
    texto.includes("sit-up") ||
    texto.includes("cable crunch") ||
    texto.includes("rope crunch") ||
    texto.includes("hanging leg") ||
    texto.includes("mountain climber") ||
    texto.includes("toe touch")
  ) {
    return {
      grupoMuscular: "Core",
      musculoPrincipal: "abdominales" as const,

      mapaDeEnfoque: [
        {
          region: "abdominales" as const,
          nivel: "principal" as const,
        },

        {
          region: "oblicuos" as const,
          nivel: "secundario" as const,
        },
      ],
    };
  }
// Hombros (casos faltantes)
if (
  texto.includes("lateral raise") ||
  texto.includes("front raise") ||
  texto.includes("elevacion lateral") ||
  texto.includes("elevaciones frontales") ||
  texto.includes("elevacion frontal") ||
  texto.includes("posterior shoulder") ||
  texto.includes("reverse pec deck") ||
  texto.includes("pajaro") ||
  texto.includes("rear delt") ||
  texto.includes("press militar") ||
  texto.includes("military press") ||
  texto.includes("shoulder press")
) {
  return {
    grupoMuscular: "Hombros",

    musculoPrincipal: "deltoides" as const,

    mapaDeEnfoque: [
      {
        region: "deltoides" as const,
        nivel: "principal" as const,
      },

      {
        region: "trapecios" as const,
        nivel: "secundario" as const,
      },

      {
        region: "triceps" as const,
        nivel: "secundario" as const,
      },
    ],
  };
}

// Press banca maquina → Pecho
if (
  texto.includes("chest press") ||
  texto.includes("press de banca en maquina") ||
  texto.includes("machine bench press")
) {
  return {
    grupoMuscular: "Pecho",

    musculoPrincipal: "pectoral" as const,

    mapaDeEnfoque: [
      {
        region: "pectoral" as const,
        nivel: "principal" as const,
      },

      {
        region: "triceps" as const,
        nivel: "secundario" as const,
      },

      {
        region: "deltoides" as const,
        nivel: "secundario" as const,
      },
    ],
  };
}

// Press de banca en máquina sentado → Pecho
if (
  texto.includes("press de banca en maquina") ||
  texto.includes("press de banca en máquina")
) {
  return {
    grupoMuscular: "Pecho",
    musculoPrincipal: "pectoral" as const,
    mapaDeEnfoque: [
      { region: "pectoral" as const, nivel: "principal" as const },
      { region: "triceps" as const, nivel: "secundario" as const },
      { region: "deltoides" as const, nivel: "secundario" as const },
    ],
  };
}

// Elevaciones laterales/frontales/posteriores → Hombros
if (
  texto.includes("elevacion lateral") ||
  texto.includes("elevación lateral") ||
  texto.includes("elevaciones laterales") ||
  texto.includes("elevacion frontal") ||
  texto.includes("elevación frontal") ||
  texto.includes("elevaciones frontales") ||
  texto.includes("elevaciones posteriores para hombros") ||
  texto.includes("pajaro") ||
  texto.includes("pájaro")
) {
  return {
    grupoMuscular: "Hombros",
    musculoPrincipal: "deltoides" as const,
    mapaDeEnfoque: [
      { region: "deltoides" as const, nivel: "principal" as const },
      { region: "trapecios" as const, nivel: "secundario" as const },
      { region: "triceps" as const, nivel: "indirecto" as const },
    ],
  };
}

  // PECHO
  if (
    texto.includes("bench") ||
    texto.includes("fly") ||
    texto.includes("push-up")
  ) {
    return {
      grupoMuscular: "Pecho",
      musculoPrincipal: "pectoral" as const,

      mapaDeEnfoque: [
        { region: "pectoral" as const, nivel: "principal" as const },
        { region: "triceps" as const, nivel: "secundario" as const },
        { region: "deltoides" as const, nivel: "secundario" as const },
      ],
    };
  }

  // ESPALDA
  if (
    texto.includes("row") ||
    texto.includes("pulldown") ||
    texto.includes("pull-up")
  ) {
    return {
      grupoMuscular: "Espalda",
      musculoPrincipal: "dorsales" as const,

      mapaDeEnfoque: [
        { region: "dorsales" as const, nivel: "principal" as const },
        { region: "biceps" as const, nivel: "secundario" as const },
        { region: "trapecios" as const, nivel: "secundario" as const },
      ],
    };
  }

  // HOMBROS
  if (
    (
      texto.includes("shoulder") ||
      texto.includes("lateral raise") ||
      texto.includes("front raise") ||
      texto.includes("rear delt") ||
      texto.includes("upright row") ||
      texto.includes("military")
    ) &&

    !texto.includes("leg") &&
    !texto.includes("hip") &&
    !texto.includes("calf") &&
    !texto.includes("glute")
  ) {
    return {
      grupoMuscular: "Hombros",

      musculoPrincipal: "deltoides" as const,

      mapaDeEnfoque: [
        {
          region: "deltoides" as const,
          nivel: "principal" as const,
        },

        {
          region: "trapecios" as const,
          nivel: "secundario" as const,
        },

        {
          region: "triceps" as const,
          nivel: "indirecto" as const,
        },
      ],
    };
  }

  // BICEPS
  if (
    (texto.includes("curl") ||
      texto.includes("bicep")) &&

    !texto.includes("leg") &&
    !texto.includes("hamstring") &&
    !texto.includes("femoral")
  ) {
    return {
      grupoMuscular: "Biceps",

      musculoPrincipal: "biceps" as const,

      mapaDeEnfoque: [
        {
          region: "biceps" as const,
          nivel: "principal" as const,
        },
      ],
    };
  }

  // TRICEPS
  if (
    texto.includes("tricep") ||
    texto.includes("triceps") ||
    texto.includes("dip") ||
    texto.includes("skull")
  ) {
    return {
      grupoMuscular: "Triceps",

      musculoPrincipal: "triceps" as const,

      mapaDeEnfoque: [
        {
          region: "triceps" as const,
          nivel: "principal" as const,
        },

        {
          region: "pectoral" as const,
          nivel: "secundario" as const,
        },
      ],
    };
  }

  // PIERNAS
  if (
    texto.includes("squat") ||
    texto.includes("deadlift") ||
    texto.includes("lunge") ||
    texto.includes("leg") ||
    texto.includes("calf") ||
    texto.includes("hamstring") ||
    texto.includes("femoral") ||
    texto.includes("hip") ||
    texto.includes("glute")
  ) {
    return {
      grupoMuscular: "Piernas",

      musculoPrincipal: "cuadriceps" as const,

      mapaDeEnfoque: [
        {
          region: "cuadriceps" as const,
          nivel: "principal" as const,
        },

        {
          region: "gluteos" as const,
          nivel: "secundario" as const,
        },

        {
          region: "isquiotibiales" as const,
          nivel: "secundario" as const,
        },
      ],
    };
  }

  return {
    grupoMuscular: "Otros",
    musculoPrincipal: "abdominales" as const,
    mapaDeEnfoque: [],
  };
}

function obtenerChecklist(grupo: string) {
  const datos: Record<string, string[]> = {
    Pecho: ["Escápulas firmes", "Controlar la bajada", "No rebotar el peso"],
    Espalda: ["Pecho abierto", "Tirar con espalda", "Evitar balanceo"],
    Piernas: ["Rodillas alineadas", "Core firme", "Recorrido completo"],
    Biceps: ["Codos quietos", "Subir controlado", "No usar impulso"],
    Triceps: ["Codos estables", "Movimiento completo", "Controlar recorrido"],
    Hombros: ["No arquear espalda", "Subir controlado", "Activar core"],
    Core: ["Mantener tensión", "Respirar normal", "Evitar compensaciones"],
  };

  return datos[grupo] ?? [
    "Controlar movimiento",
    "No usar impulso",
    "Buena postura",
  ];
}

function obtenerErrores(grupo: string) {
  const datos: Record<string, string[]> = {
    Pecho: ["Abrir demasiado codos", "Rebotar el peso", "Perder estabilidad"],
    Espalda: ["Tirar con brazos", "Encoger hombros", "Usar impulso"],
    Piernas: ["Rodillas hacia adentro", "Recorrido corto", "Perder equilibrio"],
    Biceps: ["Mover codos", "Balancear torso", "Subir rápido"],
    Triceps: ["Abrir codos", "Recorrido incompleto", "Usar hombros"],
    Hombros: ["Arquear espalda", "Subir rápido", "Usar impulso"],
    Core: ["Perder alineación", "Contener respiración", "Relajar abdomen"],
  };

  return datos[grupo] ?? [
    "Bajar demasiado rápido",
    "Perder técnica",
    "Compensar movimiento",
  ];
}

export const ejercicios: Ejercicio[] =
  ejerciciosImportados.map((ejercicio) => {
    const clasificacion =
      clasificarEjercicio(
        ejercicio.nombre,
        ejercicio.urlFuente,
        ejercicio.id
      );

    return {
      ...ejercicio,

      youtubeId:
        ejercicio.youtubeId ?? "",

      ...clasificacion,

      dificultad: "Intermedio",

      descripcion:
        `Ejercicio enfocado principalmente en ${clasificacion.grupoMuscular.toLowerCase()}.`,

      checklist:
        obtenerChecklist(
          clasificacion.grupoMuscular
        ),

      erroresComunes:
        obtenerErrores(
          clasificacion.grupoMuscular
        ),
    };
  });

export default ejercicios;