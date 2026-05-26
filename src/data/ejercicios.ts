import type { Ejercicio } from "../types/ejercicio";
import ejerciciosImportados from "./importados/ejercicios-simplyfitness.json";

function clasificarEjercicio(nombre: string, url: string, id: string) {
  const texto = `${nombre} ${url} ${id}`.toLowerCase();


  
  const core = () => ({
    grupoMuscular: "Core",
    musculoPrincipal: "abdominales" as const,
    mapaDeEnfoque: [
      { region: "abdominales" as const, nivel: "principal" as const },
      { region: "oblicuos" as const, nivel: "secundario" as const },
    ],
  });

  const pecho = () => ({
    grupoMuscular: "Pecho",
    musculoPrincipal: "pectoral" as const,
    mapaDeEnfoque: [
      { region: "pectoral" as const, nivel: "principal" as const },
      { region: "triceps" as const, nivel: "secundario" as const },
      { region: "deltoides" as const, nivel: "secundario" as const },
    ],
  });

  const espalda = () => ({
    grupoMuscular: "Espalda",
    musculoPrincipal: "dorsales" as const,
    mapaDeEnfoque: [
      { region: "dorsales" as const, nivel: "principal" as const },
      { region: "espaldaMedia" as const, nivel: "secundario" as const },
      { region: "biceps" as const, nivel: "secundario" as const },
      { region: "espaldaAlta" as const, nivel: "indirecto" as const },
    ],
  });

  const espaldaMedia = () => ({
    grupoMuscular: "Espalda",
    musculoPrincipal: "espaldaMedia" as const,
    mapaDeEnfoque: [
      { region: "espaldaMedia" as const, nivel: "principal" as const },
      { region: "dorsales" as const, nivel: "secundario" as const },
      { region: "biceps" as const, nivel: "secundario" as const },
      { region: "espaldaAlta" as const, nivel: "indirecto" as const },
    ],
  });

  const espaldaAlta = () => ({
    grupoMuscular: "Espalda",
    musculoPrincipal: "espaldaAlta" as const,
    mapaDeEnfoque: [
      { region: "espaldaAlta" as const, nivel: "principal" as const },
      { region: "espaldaMedia" as const, nivel: "secundario" as const },
      { region: "deltoides" as const, nivel: "secundario" as const },
      { region: "trapecios" as const, nivel: "secundario" as const },
    ],
  });

  const hombros = () => ({
    grupoMuscular: "Hombros",
    musculoPrincipal: "deltoides" as const,
    mapaDeEnfoque: [
      { region: "deltoides" as const, nivel: "principal" as const },
      { region: "espaldaAlta" as const, nivel: "secundario" as const },
      { region: "triceps" as const, nivel: "indirecto" as const },
    ],
  });

  const biceps = () => ({
    grupoMuscular: "Biceps",
    musculoPrincipal: "biceps" as const,
    mapaDeEnfoque: [
      { region: "biceps" as const, nivel: "principal" as const },
    ],
  });

  const triceps = () => ({
    grupoMuscular: "Triceps",
    musculoPrincipal: "triceps" as const,
    mapaDeEnfoque: [
      { region: "triceps" as const, nivel: "principal" as const },
      { region: "pectoral" as const, nivel: "secundario" as const },
    ],
  });

  const piernas = () => ({
    grupoMuscular: "Piernas",
    musculoPrincipal: "cuadriceps" as const,
    mapaDeEnfoque: [
      { region: "cuadriceps" as const, nivel: "principal" as const },
      { region: "gluteos" as const, nivel: "secundario" as const },
      { region: "isquiotibiales" as const, nivel: "secundario" as const },
    ],
  });

// AJUSTES MANUALES FINOS

if (
  texto.includes("curl de muñeca") ||
  texto.includes("wrist curl") ||
  texto.includes("extension de muñeca") ||
  texto.includes("extensión de muñeca")
) {
  return {
    grupoMuscular: "Otros",
    musculoPrincipal: "antebrazos" as const,
    mapaDeEnfoque: [
      { region: "antebrazos" as const, nivel: "principal" as const },
    ],
  };
}

if (
  texto.includes("salto rodillas al pecho")
) {
  return piernas();
}

if (
  texto.includes("burpees") ||
  texto.includes("los groiners")
) {
  return {
    grupoMuscular: "Otros",
    musculoPrincipal: "abdominales" as const,
    mapaDeEnfoque: [],
  };
}

if (
  texto.includes("pullover con barra") ||
  texto.includes("pullover con mancuerna")
) {
  return espalda();
}

if (
  texto.includes("encogimiento de hombros") ||
  texto.includes("shrug")
) {
  return {
    grupoMuscular: "Otros",
    musculoPrincipal: "trapecios" as const,
    mapaDeEnfoque: [
      { region: "trapecios" as const, nivel: "principal" as const },
      { region: "espaldaAlta" as const, nivel: "secundario" as const },
    ],
  };
}

if (
  texto.includes("contragolpe con cable")
) {
  return piernas();
}

if (
  texto.includes("press de hombro con mancuerna") ||
  texto.includes("press de hombros en maquina smith") ||
  texto.includes("press de hombros en máquina smith") ||
  texto.includes("press tras nuca sentado")
) {
  return hombros();
}

if (
  texto.includes("fondos en barras paralelas")
) {
  return triceps();
}

if (
  texto.includes("buenos dias") ||
  texto.includes("buenos días") ||
  texto.includes("elevaciones en posicion de rana") ||
  texto.includes("elevaciones en posición de rana") ||
  texto.includes("elevaciones cortas en posicion de rana") ||
  texto.includes("elevaciones cortas en posición de rana")
) {
  return piernas();
}

  if (
    texto.includes("elevacion-de-piernas") ||
    texto.includes("elevacion de piernas") ||
    texto.includes("elevaciones de piernas") ||
    texto.includes("leg raise") ||
    texto.includes("hanging leg") ||
    texto.includes("elevaciones de rodilla") ||
    texto.includes("knee raise") ||
    texto.includes("abdominal") ||
    texto.includes("abs") ||
    texto.includes("crunch") ||
    texto.includes("plank") ||
    texto.includes("sit-up") ||
    texto.includes("mountain climber") ||
    texto.includes("burpees") ||
    texto.includes("salto rodillas al pecho") ||
    texto.includes("los groiners")
  ) {
    return core();
  }

  if (
    texto.includes("press frances") ||
    texto.includes("press francés") ||
    texto.includes("french press") ||
    texto.includes("fondos en banco") ||
    texto.includes("bench dip") ||
    texto.includes("pushdown") ||
    texto.includes("extension de triceps") ||
    texto.includes("extensión de tríceps") ||
    texto.includes("patadas traseras") ||
    texto.includes("kickback") ||
    texto.includes("contragolpe con cable") ||
    texto.includes("tricep") ||
    texto.includes("triceps") ||
    texto.includes("skull")
  ) {
    return triceps();
  }

  if (
    texto.includes("remo alto") ||
    texto.includes("upright row") ||
    texto.includes("reverse fly") ||
    texto.includes("rear delt") ||
    texto.includes("cruces inversos") ||
    texto.includes("lateral raise") ||
    texto.includes("front raise") ||
    texto.includes("elevacion lateral") ||
    texto.includes("elevación lateral") ||
    texto.includes("elevaciones laterales") ||
    texto.includes("elevacion frontal") ||
    texto.includes("elevación frontal") ||
    texto.includes("elevaciones frontales") ||
    texto.includes("elevaciones posteriores") ||
    texto.includes("pajaro") ||
    texto.includes("pájaro") ||
    texto.includes("press militar") ||
    texto.includes("military press") ||
    texto.includes("shoulder press")
  ) {
    if (
      texto.includes("remo alto") ||
      texto.includes("upright row") ||
      texto.includes("reverse fly") ||
      texto.includes("rear delt") ||
      texto.includes("cruces inversos") ||
      texto.includes("elevaciones posteriores") ||
      texto.includes("pajaro") ||
      texto.includes("pÃ¡jaro")
    ) {
      return espaldaAlta();
    }

    return hombros();
  }

  if (
    texto.includes("chest press") ||
    texto.includes("press de banca") ||
    texto.includes("bench") ||
    texto.includes("fly") ||
    texto.includes("cruce de poleas") ||
    texto.includes("cable crossover") ||
    texto.includes("peck deck") ||
    texto.includes("aperturas en maquina") ||
    texto.includes("aperturas en máquina") ||
    texto.includes("push-up") ||
    texto.includes("pullover")
  ) {
    return pecho();
  }

  if (
    texto.includes("pulldown") ||
    texto.includes("pull-up") ||
    texto.includes("pullup")
  ) {
    return espalda();
  }

  if (
    texto.includes("row") ||
    texto.includes("remo")
  ) {
    return espaldaMedia();
  }

  if (
    (texto.includes("curl") || texto.includes("bicep")) &&
    !texto.includes("leg") &&
    !texto.includes("hamstring") &&
    !texto.includes("femoral")
  ) {
    return biceps();
  }

  if (
    texto.includes("squat") ||
    texto.includes("sentadilla") ||
    texto.includes("deadlift") ||
    texto.includes("peso muerto") ||
    texto.includes("lunge") ||
    texto.includes("zancada") ||
    texto.includes("leg") ||
    texto.includes("calf") ||
    texto.includes("gemelo") ||
    texto.includes("pantorrilla") ||
    texto.includes("hamstring") ||
    texto.includes("femoral") ||
    texto.includes("hip") ||
    texto.includes("glute") ||
    texto.includes("gluteo") ||
    texto.includes("glúteo") ||
    texto.includes("step up") ||
    texto.includes("caminata de pato") ||
    texto.includes("superman en cuadrupedia") ||
    texto.includes("hidrantes") ||
    texto.includes("abduccion") ||
    texto.includes("abducción") ||
    texto.includes("almejas") ||
    texto.includes("patadas de burro") ||
    texto.includes("caminata lateral")
  ) {
    return piernas();
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

  return datos[grupo] ?? ["Controlar movimiento", "No usar impulso", "Buena postura"];
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

  return datos[grupo] ?? ["Bajar demasiado rápido", "Perder técnica", "Compensar movimiento"];
}

function obtenerEquipamiento(nombre: string) {
  const texto = nombre.toLowerCase();
  const equipos = new Set<string>();

  if (texto.includes("mancuerna") || texto.includes("dumbbell")) {
    equipos.add("Mancuernas");
  }

  if (texto.includes("barra") || texto.includes("barbell") || texto.includes("press") || texto.includes("deadlift") || texto.includes("squat")) {
    equipos.add("Barra");
  }

  if (texto.includes("cable") || texto.includes("polea") || texto.includes("pulldown")) {
    equipos.add("Polea");
  }

  if (texto.includes("kettlebell")) {
    equipos.add("Kettlebell");
  }

  if (texto.includes("cuerpo") || texto.includes("peso corporal") || texto.includes("bodyweight") || texto.includes("push-up") || texto.includes("plank") || texto.includes("dip") || texto.includes("burpee")) {
    equipos.add("Peso corporal");
  }

  if (texto.includes("machine") || texto.includes("maquina") || texto.includes("máquina") || texto.includes("tractor") || texto.includes("remadora")) {
    equipos.add("Máquina");
  }

  if (equipos.size === 0) {
    equipos.add("Básico");
  }

  return Array.from(equipos);
}

function obtenerObjetivo(nombre: string) {
  const texto = nombre.toLowerCase();

  if (texto.includes("deadlift") || texto.includes("squat") || texto.includes("press") || texto.includes("pull-up") || texto.includes("lift")) {
    return "Fuerza" as const;
  }

  if (texto.includes("crunch") || texto.includes("plank") || texto.includes("abdominal") || texto.includes("oblicuo")) {
    return "Resistencia" as const;
  }

  return "Hipertrofia" as const;
}

function obtenerTipoEjercicio(nombre: string) {
  const texto = nombre.toLowerCase();

  if (
    texto.includes("curl") ||
    texto.includes("fly") ||
    texto.includes("extensión") ||
    texto.includes("extension") ||
    texto.includes("kickback") ||
    texto.includes("raise") ||
    texto.includes("elevación") ||
    texto.includes("elevacion")
  ) {
    return "Aislamiento" as const;
  }

  return "Compuesto" as const;
}

function obtenerDificultad(nombre: string) {
  const texto = nombre.toLowerCase();

  if (
    texto.includes("deadlift") ||
    texto.includes("squat") ||
    texto.includes("pull-up") ||
    texto.includes("muscle up") ||
    texto.includes("burpee") ||
    texto.includes("press militar")
  ) {
    return "Avanzado" as const;
  }

  if (
    texto.includes("curl") ||
    texto.includes("fly") ||
    texto.includes("crunch") ||
    texto.includes("elevación") ||
    texto.includes("elevacion") ||
    texto.includes("kickback")
  ) {
    return "Principiante" as const;
  }

  return "Intermedio" as const;
}

export const ejercicios: Ejercicio[] = ejerciciosImportados.map((ejercicio) => {
  const clasificacion = clasificarEjercicio(
    ejercicio.nombre,
    ejercicio.urlFuente,
    ejercicio.id
  );

  return {
    ...ejercicio,
    youtubeId: ejercicio.youtubeId ?? "",
    ...clasificacion,
    dificultad: obtenerDificultad(ejercicio.nombre),
    equipamiento: obtenerEquipamiento(ejercicio.nombre),
    objetivo: obtenerObjetivo(ejercicio.nombre),
    tipoEjercicio: obtenerTipoEjercicio(ejercicio.nombre),
    descripcion: `Ejercicio enfocado principalmente en ${clasificacion.grupoMuscular.toLowerCase()}.`,
    checklist: obtenerChecklist(clasificacion.grupoMuscular),
    erroresComunes: obtenerErrores(clasificacion.grupoMuscular),
  };
});

export default ejercicios;
