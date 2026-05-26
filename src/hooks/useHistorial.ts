import { useEffect, useState } from "react";
import type { Rutina } from "../types/rutina";

const CLAVE_HISTORIAL = "gym-trainer-historial";
const EVENTO_HISTORIAL = "gym-trainer-historial-actualizado";

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

function leerHistorial() {
  try {
    const raw = localStorage.getItem(CLAVE_HISTORIAL);
    return raw ? JSON.parse(raw) as Entrenamiento[] : [];
  } catch {
    return [];
  }
}

function guardarHistorial(historial: Entrenamiento[]) {
  localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
  window.dispatchEvent(new Event(EVENTO_HISTORIAL));
}

export function useHistorial() {
  const [historial, setHistorial] = useState<Entrenamiento[]>(leerHistorial);

  useEffect(() => {
    function sincronizarHistorial() {
      setHistorial(leerHistorial());
    }

    window.addEventListener(EVENTO_HISTORIAL, sincronizarHistorial);
    window.addEventListener("storage", sincronizarHistorial);

    return () => {
      window.removeEventListener(EVENTO_HISTORIAL, sincronizarHistorial);
      window.removeEventListener("storage", sincronizarHistorial);
    };
  }, []);

  function registrarEntrenamiento(rutina: Rutina) {
    const nuevo: Entrenamiento = {
      id: generarId(),
      rutinaId: rutina.id,
      nombre: rutina.nombre,
      fechaISO: new Date().toISOString(),
      ejercicios: rutina.ejercicios.map((e) => ({ ejercicioId: e.ejercicioId })),
    };

    const actualizado = [nuevo, ...leerHistorial()];
    guardarHistorial(actualizado);
    setHistorial(actualizado);
    return nuevo;
  }

  function borrarEntrenamiento(id: string) {
    const actualizado = leerHistorial().filter((e) => e.id !== id);
    guardarHistorial(actualizado);
    setHistorial(actualizado);
  }

  function limpiarHistorialSemana() {
    const desde = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const actualizado = leerHistorial().filter(
      (entrenamiento) => new Date(entrenamiento.fechaISO).getTime() < desde
    );
    guardarHistorial(actualizado);
    setHistorial(actualizado);
  }

  function limpiarHistorial() {
    guardarHistorial([]);
    setHistorial([]);
  }

  return {
    historial,
    registrarEntrenamiento,
    borrarEntrenamiento,
    limpiarHistorialSemana,
    limpiarHistorial,
  };
}
