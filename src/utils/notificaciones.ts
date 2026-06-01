import type { Rutina } from "../types/rutina";
import type { Entrenamiento } from "../hooks/useHistorial";
import type { PreferenciasPerfil } from "../hooks/usePerfil";
import {
  cancelLocalNotification,
  scheduleLocalNotification,
  showLocalNotification,
} from "./pwa";
import { inicioDeSemana } from "./fechas";

export const CLAVE_RUTINA_GUARDADA = "gym-trainer-rutina-guardada";

const NOTIFICACION_RUTINA_INCOMPLETA = "fitapp-rutina-incompleta";
const NOTIFICACION_ENTRENAR_HOY = "fitapp-entrenar-hoy";
const NOTIFICACION_OBJETIVO_SEMANAL = "fitapp-objetivo-semanal";
const NOTIFICACION_POST_ENTRENO = "fitapp-post-entreno";
const MINUTOS_RUTINA_INCOMPLETA = 60;

type RutinaGuardada = {
  rutinaId: string;
  indice: number;
  pausada: boolean;
  ultimoProgresoISO: string;
};

export function guardarProgresoRutina(
  rutina: Rutina,
  indice: number,
  pausada: boolean
) {
  const payload: RutinaGuardada = {
    rutinaId: rutina.id,
    indice,
    pausada,
    ultimoProgresoISO: new Date().toISOString(),
  };

  localStorage.setItem(CLAVE_RUTINA_GUARDADA, JSON.stringify(payload));
  programarRutinaIncompleta(payload);
}

export function leerProgresoRutina() {
  try {
    const raw = localStorage.getItem(CLAVE_RUTINA_GUARDADA);
    return raw ? (JSON.parse(raw) as Partial<RutinaGuardada>) : null;
  } catch {
    return null;
  }
}

export function limpiarProgresoRutina() {
  localStorage.removeItem(CLAVE_RUTINA_GUARDADA);
  cancelLocalNotification(NOTIFICACION_RUTINA_INCOMPLETA);
}

export function programarRutinaIncompleta(progreso: Partial<RutinaGuardada>) {
  if (!progreso.rutinaId || !progreso.ultimoProgresoISO) return;

  const ultimoProgreso = new Date(progreso.ultimoProgresoISO).getTime();
  if (Number.isNaN(ultimoProgreso)) return;

  scheduleLocalNotification({
    id: NOTIFICACION_RUTINA_INCOMPLETA,
    title: "💪 Te quedó una rutina sin terminar",
    body: "Continuá donde la dejaste.",
    at: ultimoProgreso + MINUTOS_RUTINA_INCOMPLETA * 60 * 1000,
    tag: NOTIFICACION_RUTINA_INCOMPLETA,
    requireInteraction: true,
    data: {
      intent: "resume-workout",
      rutinaId: progreso.rutinaId,
      indice: progreso.indice ?? 0,
    },
  });
}

export function programarRecordatorioEntrenamiento(
  perfil: PreferenciasPerfil,
  historial: Entrenamiento[],
  rutinas: Rutina[]
) {
  const rutinaHoy = obtenerRutinaDisponibleHoy(perfil, rutinas);
  const entrenoHoy = entrenoRegistradoHoy(historial);

  cancelLocalNotification(NOTIFICACION_ENTRENAR_HOY);

  if (!rutinaHoy || entrenoHoy) return;

  const hora = perfil.horaNotificacionEntrenamiento || "19:00";
  const fecha = fechaDeHoyConHora(hora);

  if (fecha.getTime() <= Date.now()) {
    fecha.setDate(fecha.getDate() + 1);
  }

  scheduleLocalNotification({
    id: NOTIFICACION_ENTRENAR_HOY,
    title: "🏋️ Hora de entrenar",
    body: "Tenés tu rutina lista para hoy.",
    at: fecha.getTime(),
    tag: NOTIFICACION_ENTRENAR_HOY,
    requireInteraction: true,
    data: { intent: "open-routines" },
  });
}

export function notificarObjetivoSemanalSiHaceFalta(
  perfil: PreferenciasPerfil,
  historial: Entrenamiento[]
) {
  const objetivo = Math.max(1, perfil.objetivoSemanal || 4);
  const completados = contarEntrenamientosSemana(historial);
  if (completados >= objetivo) return;

  const faltan = objetivo - completados;
  showLocalNotification({
    id: NOTIFICACION_OBJETIVO_SEMANAL,
    title: `🔥 Vas ${completados}/${objetivo} entrenamientos esta semana`,
    body: `Te faltan ${faltan} para cumplir tu objetivo.`,
    tag: NOTIFICACION_OBJETIVO_SEMANAL,
    data: { intent: "open-profile" },
  });
}

export function notificarResumenPostEntreno(
  rutina: Rutina,
  entrenamiento: Entrenamiento
) {
  const series = rutina.ejercicios.reduce(
    (total, ejercicio) => total + Math.max(1, ejercicio.series),
    0
  );

  showLocalNotification({
    id: NOTIFICACION_POST_ENTRENO,
    title: "✅ Entrenamiento completado",
    body: `${rutina.nombre} · ${entrenamiento.ejerciciosCompletados} ejercicios · ${series} series`,
    tag: NOTIFICACION_POST_ENTRENO,
    data: { intent: "open-profile" },
  });
}

export function contarEntrenamientosSemana(historial: Entrenamiento[]) {
  const desde = inicioDeSemana().getTime();
  return historial.filter(
    (entrenamiento) => new Date(entrenamiento.fechaISO).getTime() >= desde
  ).length;
}

function obtenerRutinaDisponibleHoy(perfil: PreferenciasPerfil, rutinas: Rutina[]) {
  const dia = obtenerDiaActual();
  const rutinaPlanificadaId = perfil.planSemanal[dia];
  const rutinaPlanificada = rutinas.find(
    (rutina) => rutina.id === rutinaPlanificadaId && rutina.ejercicios.length > 0
  );

  return rutinaPlanificada ?? rutinas.find((rutina) => rutina.ejercicios.length > 0);
}

function entrenoRegistradoHoy(historial: Entrenamiento[]) {
  const hoy = new Date();
  return historial.some((entrenamiento) => {
    const fecha = new Date(entrenamiento.fechaISO);
    return (
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
    );
  });
}

function fechaDeHoyConHora(hora: string) {
  const [horas = "19", minutos = "0"] = hora.split(":");
  const fecha = new Date();
  fecha.setHours(Number(horas), Number(minutos), 0, 0);
  return fecha;
}

function obtenerDiaActual() {
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ] as const;

  return dias[new Date().getDay()];
}
