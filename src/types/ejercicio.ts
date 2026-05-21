export type NivelMuscular =
  | "principal"
  | "secundario"
  | "indirecto";

export type RegionMuscular =
  | "pectoral"
  | "deltoides"
  | "biceps"
  | "triceps"
  | "abdominales"
  | "oblicuos"
  | "cuadriceps"
  | "isquiotibiales"
  | "gluteos"
  | "pantorrillas"
  | "dorsales"
  | "trapecios"
  | "espaldaBaja";

export type MapaDeEnfoque = {
  region: RegionMuscular;
  nivel: NivelMuscular;
};

export type Ejercicio = {
  id: string;
  nombre: string;
  imagen: string;
  grupoMuscular: string;
  musculoPrincipal: RegionMuscular;
  dificultad: "Principiante" | "Intermedio" | "Avanzado";
  equipamiento?: string[];
  objetivo?: "Fuerza" | "Hipertrofia" | "Resistencia";
  tipoEjercicio?: "Compuesto" | "Aislamiento";
  youtubeId: string;
  urlFuente?: string;

  descripcion: string;
  checklist: string[];
  erroresComunes: string[];
  mapaDeEnfoque: MapaDeEnfoque[];
};