import { useCallback, useEffect, useMemo, useState } from "react";
import { ejercicios } from "../data/ejercicios";
import { useHistorial } from "../hooks/useHistorial";
import type { Rutina, EjercicioRutina } from "../types/rutina";
import { obtenerEjerciciosPersonalizados } from "../utils/ejerciciosPersonalizados";

type Props = {
  rutina: Rutina;
  onFinish: () => void;
  onCancel: () => void;
  onIndexChange?: (index: number) => void;
};

const DESCANSO_INICIAL = 90;
const OPCIONES_DESCANSO = [
  { id: "90s", etiqueta: "90 segundos", segundos: 90 },
  { id: "2m", etiqueta: "2 min", segundos: 120 },
  { id: "3m", etiqueta: "3 min", segundos: 180 },
  { id: "4m", etiqueta: "4 min", segundos: 240 },
];

function WorkoutRunner({ rutina, onFinish, onCancel, onIndexChange }: Props) {
  const { registrarEntrenamiento } = useHistorial();
  const [indiceActual, setIndiceActual] = useState(0);
  const [serieActual, setSerieActual] = useState(1);
  const [descansando, setDescansando] = useState(false);
  const [descansoPausado, setDescansoPausado] = useState(false);
  const [descansoSeleccionado, setDescansoSeleccionado] = useState("90s");
  const [segundosDescanso, setSegundosDescanso] = useState(DESCANSO_INICIAL);
  const [entrenamientoCompletado, setEntrenamientoCompletado] = useState(false);
  const [avisoDescanso, setAvisoDescanso] = useState<string | null>(null);

  const ejerciciosCatalogo = useMemo(
    () => [...ejercicios, ...obtenerEjerciciosPersonalizados()],
    []
  );

  const ejercicioActual: EjercicioRutina | null =
    rutina.ejercicios[indiceActual] ?? null;
  const ejercicio = ejercicioActual
    ? ejerciciosCatalogo.find((e) => e.id === ejercicioActual.ejercicioId)
    : null;
  const duracionDescanso =
    OPCIONES_DESCANSO.find((opcion) => opcion.id === descansoSeleccionado)?.segundos ??
    DESCANSO_INICIAL;

  const totalSeries = rutina.ejercicios.reduce(
    (total, item) => total + Math.max(1, item.series),
    0
  );
  const seriesPrevias = rutina.ejercicios
    .slice(0, indiceActual)
    .reduce((total, item) => total + Math.max(1, item.series), 0);
  const seriesCompletadas = entrenamientoCompletado
    ? totalSeries
    : seriesPrevias + Math.max(0, serieActual - 1) + (descansando ? 1 : 0);
  const progreso = totalSeries > 0 ? (seriesCompletadas / totalSeries) * 100 : 0;
  const esUltimoEjercicio = indiceActual === rutina.ejercicios.length - 1;
  const esUltimaSerie =
    ejercicioActual ? serieActual >= Math.max(1, ejercicioActual.series) : false;
  const siguienteEjercicio = rutina.ejercicios[indiceActual + 1] ?? null;
  const siguienteEjercicioCatalogo = siguienteEjercicio
    ? ejerciciosCatalogo.find((e) => e.id === siguienteEjercicio.ejercicioId)
    : null;
  const minutosDescanso = Math.floor(segundosDescanso / 60);
  const segundosRestantes = segundosDescanso % 60;
  const tiempoDescanso = `${minutosDescanso}:${String(segundosRestantes).padStart(2, "0")}`;

  const reiniciarEstadoDeSerie = useCallback(() => {
    setSerieActual(1);
    setDescansando(false);
    setDescansoPausado(false);
    setSegundosDescanso(duracionDescanso);
    setEntrenamientoCompletado(false);
  }, [duracionDescanso]);

  const finalizarDescanso = useCallback(() => {
    setDescansando(false);
    setDescansoPausado(false);
    setSegundosDescanso(duracionDescanso);

    if (!ejercicioActual) return;

    if (serieActual < Math.max(1, ejercicioActual.series)) {
      setAvisoDescanso(`Descanso terminado. Vamos con la serie ${serieActual + 1}.`);
      setSerieActual((actual) => actual + 1);
      return;
    }

    if (!esUltimoEjercicio) {
      const nuevo = indiceActual + 1;
      const proximo = rutina.ejercicios[nuevo];
      const ejercicioProximo = proximo
        ? ejerciciosCatalogo.find((item) => item.id === proximo.ejercicioId)
        : null;

      setAvisoDescanso(
        ejercicioProximo
          ? `Descanso terminado. Sigue ${ejercicioProximo.nombre}.`
          : "Descanso terminado. Sigue el proximo ejercicio."
      );
      setIndiceActual(nuevo);
      setSerieActual(1);
      onIndexChange?.(nuevo);
    }
  }, [
    duracionDescanso,
    ejerciciosCatalogo,
    ejercicioActual,
    esUltimoEjercicio,
    indiceActual,
    onIndexChange,
    rutina.ejercicios,
    serieActual,
  ]);

  useEffect(() => {
    onIndexChange?.(indiceActual);
  }, [indiceActual, onIndexChange]);

  useEffect(() => {
    if (!descansando || descansoPausado) return;

    if (segundosDescanso <= 0) {
      finalizarDescanso();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSegundosDescanso((actual) => Math.max(0, actual - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [descansando, descansoPausado, finalizarDescanso, segundosDescanso]);

  useEffect(() => {
    if (!descansando) {
      setSegundosDescanso(duracionDescanso);
    }
  }, [descansando, duracionDescanso]);

  useEffect(() => {
    if (!avisoDescanso) return;

    const timeoutId = window.setTimeout(() => {
      setAvisoDescanso(null);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [avisoDescanso]);

  function marcarCompletado() {
    if (!ejercicioActual || descansando || entrenamientoCompletado) return;

    if (esUltimaSerie && esUltimoEjercicio) {
      setEntrenamientoCompletado(true);
      return;
    }

    setDescansando(true);
    setDescansoPausado(false);
    setSegundosDescanso(duracionDescanso);
  }

  function irAlSiguiente() {
    if (indiceActual < rutina.ejercicios.length - 1) {
      const nuevo = indiceActual + 1;
      setIndiceActual(nuevo);
      reiniciarEstadoDeSerie();
      onIndexChange?.(nuevo);
    }
  }

  function irAlAnterior() {
    if (indiceActual > 0) {
      const nuevo = indiceActual - 1;
      setIndiceActual(nuevo);
      reiniciarEstadoDeSerie();
      onIndexChange?.(nuevo);
    }
  }

  function terminarRutina() {
    registrarEntrenamiento(rutina);
    alert(`Rutina "${rutina.nombre}" registrada como completada. Excelente trabajo!`);
    onFinish();
  }

  if (!ejercicio || !ejercicioActual) {
    return (
      <div className="workout-runner panel">
        <h2>Error: No hay ejercicios en la rutina</h2>
      </div>
    );
  }

  return (
    <div className="workout-runner">
      <div className="workout-header panel">
        <div className="workout-info">
          <h2>{rutina.nombre}</h2>
          <p className="muted">
            Ejercicio {indiceActual + 1} de {rutina.ejercicios.length} - Serie{" "}
            {serieActual} de {ejercicioActual.series}
          </p>
        </div>
        <div className="workout-header-actions">
          <label className="descanso-selector">
            <span>Descanso</span>
            <select
              value={descansoSeleccionado}
              disabled={descansando}
              onChange={(event) => setDescansoSeleccionado(event.target.value)}
            >
              {OPCIONES_DESCANSO.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </label>
          <button className="boton-secundario" onClick={onCancel}>
            Salir
          </button>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${progreso}%` }} />
        </div>
      </div>

        <div className="workout-content">
        {avisoDescanso && (
          <div className="aviso-descanso" role="status" aria-live="polite">
            {avisoDescanso}
          </div>
        )}

        <div className="ejercicio-display panel">
          <img src={ejercicio.imagen} alt={ejercicio.nombre} />
          <div className="ejercicio-info">
            <h3>{ejercicio.nombre}</h3>
            <span className="grupo">{ejercicio.grupoMuscular}</span>

            <div className="parametros">
              <div className="param">
                <strong>
                  {serieActual}/{ejercicioActual.series}
                </strong>
                <p>Serie</p>
              </div>
              <div className="param">
                <strong>{ejercicioActual.repeticiones}</strong>
                <p>Reps</p>
              </div>
              <div className="param">
                <strong>{ejercicioActual.peso}</strong>
                <p>{ejercicioActual.tipoPeso}</p>
              </div>
              <div className="param">
                <strong>{Math.round(progreso)}%</strong>
                <p>Progreso</p>
              </div>
            </div>

            {ejercicio.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${ejercicio.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="enlace-video"
              >
                Ver tutorial en YouTube
              </a>
            )}
          </div>
        </div>

        <div className={`panel workout-serie-panel ${descansando ? "descanso-activo" : ""}`}>
          {descansando ? (
            <>
              <div className="descanso-copy">
                <span className="workout-estado">Descanso</span>
                <h3>{tiempoDescanso}</h3>
                <p>
                  {esUltimaSerie
                    ? siguienteEjercicioCatalogo
                      ? `Despues sigue ${siguienteEjercicioCatalogo.nombre}.`
                      : "Despues sigue el proximo ejercicio."
                    : `Despues vas con la serie ${serieActual + 1}.`}
                </p>
              </div>

              <div className="descanso-barra">
                <div
                  className="descanso-barra-fill"
                  style={{
                    width: `${100 - (segundosDescanso / duracionDescanso) * 100}%`,
                  }}
                />
              </div>

              <div className="descanso-acciones">
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setDescansoPausado((pausado) => !pausado)}
                >
                  {descansoPausado ? "Reanudar" : "Pausar"}
                </button>
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setSegundosDescanso((actual) => actual + 15)}
                >
                  +15s
                </button>
                <button
                  type="button"
                  className="boton-primario"
                  onClick={finalizarDescanso}
                >
                  Saltar descanso
                </button>
              </div>
            </>
          ) : entrenamientoCompletado ? (
            <div className="descanso-copy">
              <span className="workout-estado">Rutina completa</span>
              <h3>Listo</h3>
              <p>Registra el entrenamiento para guardarlo en tu historial.</p>
            </div>
          ) : (
            <div className="descanso-copy">
              <span className="workout-estado">En serie</span>
              <h3>Serie {serieActual}</h3>
              <p>
                Completa {ejercicioActual.repeticiones} reps con {ejercicioActual.peso}{" "}
                {ejercicioActual.tipoPeso}.
              </p>
            </div>
          )}
        </div>

        <div className="workout-controles panel">
          <button
            className="boton-secundario"
            onClick={irAlAnterior}
            disabled={indiceActual === 0}
          >
            Anterior
          </button>

          <button
            className="boton-primario"
            onClick={marcarCompletado}
            disabled={descansando || entrenamientoCompletado}
          >
            Completar serie
          </button>

          <button
            className="boton-secundario"
            onClick={irAlSiguiente}
            disabled={indiceActual === rutina.ejercicios.length - 1}
          >
            Siguiente
          </button>
        </div>

        {entrenamientoCompletado && (
          <div className="panel final-panel">
            <p>Has llegado al final. Felicitaciones!</p>
            <button className="boton-primario" onClick={terminarRutina}>
              Finalizar rutina
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutRunner;
