import type { Ejercicio } from "../types/ejercicio";
import ejerciciosImportados from "./importados/ejercicios-simplyfitness.json";

function clasificarEjercicio(nombre: string, url: string) {
  const texto = `${nombre} ${url}`.toLowerCase();

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

  if (
    texto.includes("shoulder") ||
    texto.includes("raise") ||
    texto.includes("military")
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

if (
  (
    texto.includes("curl") ||
    texto.includes("bicep")
  ) &&

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

      {
        region: "deltoides" as const,
        nivel: "indirecto" as const,
      },
    ],
  };
}

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

      {
        region: "deltoides" as const,
        nivel: "indirecto" as const,
      },
    ],
  };
}

  if (
    texto.includes("squat") ||
    texto.includes("deadlift") ||
    texto.includes("lunge") ||
    texto.includes("leg") ||
    texto.includes("calf")||
    texto.includes("leg-extension") ||
    texto.includes("leg extension")
  ) {
    return {
      grupoMuscular: "Piernas",
      musculoPrincipal: "cuadriceps" as const,
      mapaDeEnfoque: [
        { region: "cuadriceps" as const, nivel: "principal" as const },
        { region: "gluteos" as const, nivel: "secundario" as const },
        { region: "isquiotibiales" as const, nivel: "secundario" as const },
      ],
    };
  }

  if (
    texto.includes("crunch") ||
    texto.includes("plank") ||
    texto.includes("ab")
  ) {
    return {
      grupoMuscular: "Core",
      musculoPrincipal: "abdominales" as const,
      mapaDeEnfoque: [
        { region: "abdominales" as const, nivel: "principal" as const },
        { region: "oblicuos" as const, nivel: "secundario" as const },
      ],
    };
  }

  return {
    grupoMuscular: "Otros",
    musculoPrincipal: "abdominales" as const,
    mapaDeEnfoque: [],
  };
}

export const ejercicios: Ejercicio[] = [
  ...ejerciciosImportados.map((ejercicio) => ({
    ...ejercicio,

    youtubeId: ejercicio.youtubeId ?? "",

    ...clasificarEjercicio(ejercicio.nombre, ejercicio.urlFuente),

    dificultad: "Intermedio",

    descripcion:
      "Ejercicio importado automáticamente.",

    checklist: [
      "Controlar el movimiento",
      "No usar impulso",
    ],

    erroresComunes: [
      "Bajar demasiado rápido",
    ],
  })),
];