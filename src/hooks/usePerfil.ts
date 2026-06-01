import { useEffect, useState } from "react";

type DiaSemana =
  | "domingo"
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado";

export type PreferenciasPerfil = {
  nombre: string;
  objetivoSemanal: number;
  objetivoMensual: number;
  nivelExperiencia: "principiante" | "intermedio" | "avanzado";
  tiempoEntrenamiento: number;
  planSemanal: Record<DiaSemana, string>;
  objetivoPrincipal?: "hipertrofia" | "fuerza" | "bajar-grasa" | "salud";
  equipamientoDisponible?: string[];
  onboardingCompletado?: boolean;
  notificacionesActivadas?: boolean;
  horaNotificacionEntrenamiento?: string;
};

const CLAVE_PERFIL = "gym-trainer-perfil";
const EVENTO_PERFIL = "gym-trainer-perfil-actualizado";

const DIAS_SEMANA: DiaSemana[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

export function crearPerfilDefault(): PreferenciasPerfil {
  return {
    nombre: "",
    objetivoSemanal: 4,
    objetivoMensual: 16,
    nivelExperiencia: "intermedio",
    tiempoEntrenamiento: 60,
    objetivoPrincipal: "hipertrofia",
    equipamientoDisponible: [],
    onboardingCompletado: false,
    notificacionesActivadas: false,
    horaNotificacionEntrenamiento: "19:00",
    planSemanal: DIAS_SEMANA.reduce((plan, dia) => {
      plan[dia] = "";
      return plan;
    }, {} as Record<DiaSemana, string>),
  };
}

export const perfilDefault: PreferenciasPerfil = crearPerfilDefault();

function leerPerfil() {
  try {
    const raw = localStorage.getItem(CLAVE_PERFIL);
    if (!raw) return perfilDefault;
    return { ...perfilDefault, ...JSON.parse(raw) } as PreferenciasPerfil;
  } catch {
    return perfilDefault;
  }
}

function guardarPerfil(perfil: PreferenciasPerfil) {
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
  window.dispatchEvent(new Event(EVENTO_PERFIL));
}

export function borrarPerfilGuardado() {
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(crearPerfilDefault()));
  window.dispatchEvent(new Event(EVENTO_PERFIL));
}

export function usePerfil() {
  const [perfil, setPerfilState] = useState<PreferenciasPerfil>(leerPerfil);

  useEffect(() => {
    function sincronizarPerfil() {
      setPerfilState(leerPerfil());
    }

    window.addEventListener(EVENTO_PERFIL, sincronizarPerfil);
    window.addEventListener("storage", sincronizarPerfil);

    return () => {
      window.removeEventListener(EVENTO_PERFIL, sincronizarPerfil);
      window.removeEventListener("storage", sincronizarPerfil);
    };
  }, []);

  function setPerfil(nuevoPerfil: PreferenciasPerfil) {
    guardarPerfil(nuevoPerfil);
    setPerfilState(nuevoPerfil);
  }

  return {
    perfil,
    setPerfil,
    diasSemana: DIAS_SEMANA,
  };
}
