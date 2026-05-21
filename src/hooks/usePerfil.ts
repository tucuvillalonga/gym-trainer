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
};

const CLAVE_PERFIL = "gym-trainer-perfil";

const DIAS_SEMANA: DiaSemana[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const perfilDefault: PreferenciasPerfil = {
  nombre: "Tucu",
  objetivoSemanal: 5,
  objetivoMensual: 16,
  nivelExperiencia: "intermedio",
  tiempoEntrenamiento: 60,
  planSemanal: DIAS_SEMANA.reduce((plan, dia) => {
    plan[dia] = "";
    return plan;
  }, {} as Record<DiaSemana, string>),
};

export function usePerfil() {
  const [perfil, setPerfil] = useState<PreferenciasPerfil>(() => {
    try {
      const raw = localStorage.getItem(CLAVE_PERFIL);
      if (!raw) return perfilDefault;
      return JSON.parse(raw) as PreferenciasPerfil;
    } catch {
      return perfilDefault;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
    } catch {
      // ignore
    }
  }, [perfil]);

  return {
    perfil,
    setPerfil,
    diasSemana: DIAS_SEMANA,
  };
}
