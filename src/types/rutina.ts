export type EjercicioRutina = {
  ejercicioId: string;
  series: number;
  repeticiones: number;
  peso: number;
  tipoPeso: "total" | "por mancuerna" | "polea" | "corporal";
};

export type Rutina = {
  id: string;
  nombre: string;
  ejercicios: EjercicioRutina[];
};