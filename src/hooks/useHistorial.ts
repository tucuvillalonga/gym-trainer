import { useEffect, useState } from "react";
import type { Rutina } from "../types/rutina";

const CLAVE_HISTORIAL = "gym-trainer-historial";

export type Entrenamiento = {
  id: string;
  rutinaId: string;
  nombre: string;
  fechaISO: string;
  ejercicios: { ejercicioId: string }[];
};

function generarId() {
  return crypto.randomUUID();
}

export function useHistorial() {
  const [historial, setHistorial] = useState<Entrenamiento[]>(() => {
    try {
      const raw = localStorage.getItem(CLAVE_HISTORIAL);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    } catch {
      // ignore
    }
  }, [historial]);

  function registrarEntrenamiento(rutina: Rutina) {
    const nuevo: Entrenamiento = {
      id: generarId(),
      rutinaId: rutina.id,
      nombre: rutina.nombre,
      fechaISO: new Date().toISOString(),
      ejercicios: rutina.ejercicios.map((e) => ({ ejercicioId: e.ejercicioId })),
    };

    setHistorial((h) => [nuevo, ...h]);
    return nuevo;
  }

  function borrarEntrenamiento(id: string) {
    setHistorial((h) => h.filter((e) => e.id !== id));
  }

  function limpiarHistorial() {
    setHistorial([]);
  }

  return {
    historial,
    registrarEntrenamiento,
    borrarEntrenamiento,
    limpiarHistorial,
  };
}
