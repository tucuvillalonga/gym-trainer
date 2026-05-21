import { useEffect, useState } from "react";
import type { EjercicioRutina, Rutina } from "../types/rutina";

const CLAVE_STORAGE = "gym-trainer-rutinas";

function crearId() {
  return crypto.randomUUID();
}

export function useRutinas() {
  const [rutinas, setRutinas] = useState<Rutina[]>(() => {
    const guardadas = localStorage.getItem(CLAVE_STORAGE);
    if (!guardadas) return [];
    return JSON.parse(guardadas);
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(rutinas));
  }, [rutinas]);

  function crearRutina(nombre: string) {
    setRutinas((actuales) => [
      ...actuales,
      {
        id: crearId(),
        nombre,
        ejercicios: [],
      },
    ]);
  }

  function actualizarNombreRutina(rutinaId: string, nombre: string) {
    setRutinas((actuales) =>
      actuales.map((rutina) =>
        rutina.id === rutinaId
          ? { ...rutina, nombre }
          : rutina
      )
    );
  }

  function eliminarRutina(id: string) {
    setRutinas((actuales) => actuales.filter((rutina) => rutina.id !== id));
  }

  function agregarEjercicioARutina(rutinaId: string, ejercicioId: string) {
    const nuevoEjercicio: EjercicioRutina = {
      ejercicioId,
      series: 3,
      repeticiones: 10,
      peso: 0,
      tipoPeso: "total",
    };

    setRutinas((actuales) =>
      actuales.map((rutina) => {
        if (rutina.id !== rutinaId) return rutina;

        const yaExiste = rutina.ejercicios.some(
          (item) => item.ejercicioId === ejercicioId
        );

        if (yaExiste) return rutina;

        return {
          ...rutina,
          ejercicios: [...rutina.ejercicios, nuevoEjercicio],
        };
      })
    );
  }

  function actualizarEjercicioDeRutina(
    rutinaId: string,
    ejercicioId: string,
    cambios: Partial<EjercicioRutina>
  ) {
    setRutinas((actuales) =>
      actuales.map((rutina) => {
        if (rutina.id !== rutinaId) return rutina;

        return {
          ...rutina,
          ejercicios: rutina.ejercicios.map((item) =>
            item.ejercicioId === ejercicioId
              ? { ...item, ...cambios }
              : item
          ),
        };
      })
    );
  }

  function eliminarEjercicioDeRutina(rutinaId: string, ejercicioId: string) {
    setRutinas((actuales) =>
      actuales.map((rutina) => {
        if (rutina.id !== rutinaId) return rutina;

        return {
          ...rutina,
          ejercicios: rutina.ejercicios.filter(
            (item) => item.ejercicioId !== ejercicioId
          ),
        };
      })
    );
  }

  return {
    rutinas,
    crearRutina,
    actualizarNombreRutina,
    eliminarRutina,
    agregarEjercicioARutina,
    actualizarEjercicioDeRutina,
    eliminarEjercicioDeRutina,
  };
}