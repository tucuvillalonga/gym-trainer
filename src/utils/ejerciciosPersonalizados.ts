import type { Ejercicio } from "../types/ejercicio";

export const CLAVE_EJERCICIOS_PERSONALIZADOS =
  "gym-trainer-ejercicios-personalizados";

export function obtenerEjerciciosPersonalizados() {
  const guardados = localStorage.getItem(CLAVE_EJERCICIOS_PERSONALIZADOS);
  if (!guardados) return [];

  try {
    return JSON.parse(guardados) as Ejercicio[];
  } catch {
    return [];
  }
}
