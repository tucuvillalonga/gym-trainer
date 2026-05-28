import { useEffect, useMemo, useState } from "react";
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

function WorkoutRunner({ rutina, onFinish, onCancel, onIndexChange }: Props) {
  const { registrarEntrenamiento } = useHistorial();
  const [indiceActual, setIndiceActual] = useState(0);
  const ejerciciosCatalogo = useMemo(
    () => [...ejercicios, ...obtenerEjerciciosPersonalizados()],
    []
  );

  const ejercicioActual: EjercicioRutina | null =
    rutina.ejercicios[indiceActual] ?? null;
  const ejercicio = ejercicioActual
    ? ejerciciosCatalogo.find((e) => e.id === ejercicioActual.ejercicioId)
    : null;

  const progreso = ((indiceActual + 1) / rutina.ejercicios.length) * 100;

  function marcarCompletado() {
    if (!ejercicioActual) return;
    irAlSiguiente();
  }

  function irAlSiguiente() {
    if (indiceActual < rutina.ejercicios.length - 1) {
      const nuevo = indiceActual + 1;
      setIndiceActual(nuevo);
      onIndexChange?.(nuevo);
    }
  }

  function irAlAnterior() {
    if (indiceActual > 0) {
      const nuevo = indiceActual - 1;
      setIndiceActual(nuevo);
      onIndexChange?.(nuevo);
    }
  }

  function terminarRutina() {
    registrarEntrenamiento(rutina);
    alert(`Rutina "${rutina.nombre}" registrada como completada. ¡Excelente trabajo!`);
    onFinish();
  }

  if (!ejercicio || !ejercicioActual) {
    return (
      <div className="workout-runner panel">
        <h2>Error: No hay ejercicios en la rutina</h2>
      </div>
    );
  }

  useEffect(() => {
    onIndexChange?.(indiceActual);
  }, [indiceActual, onIndexChange]);

  return (
    <div className="workout-runner">
      <div className="workout-header panel">
        <div className="workout-info">
          <h2>{rutina.nombre}</h2>
          <p className="muted">
            Ejercicio {indiceActual + 1} de {rutina.ejercicios.length}
          </p>
        </div>
        <div className="workout-header-actions">
          <button className="boton-secundario" onClick={onCancel}>
            Salir
          </button>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      <div className="workout-content">
        <div className="ejercicio-display panel">
          <img src={ejercicio.imagen} alt={ejercicio.nombre} />
          <div className="ejercicio-info">
            <h3>{ejercicio.nombre}</h3>
            <span className="grupo">{ejercicio.grupoMuscular}</span>

            <div className="parametros">
              <div className="param">
                <strong>{ejercicioActual.series}</strong>
                <p>Series</p>
              </div>
              <div className="param">
                <strong>{ejercicioActual.repeticiones}</strong>
                <p>Reps</p>
              </div>
              <div className="param">
                <strong>{ejercicioActual.peso}</strong>
                <p>{ejercicioActual.tipoPeso}</p>
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

        <div className="workout-controles panel">
          <button
            className="boton-secundario"
            onClick={irAlAnterior}
            disabled={indiceActual === 0}
          >
            ← Anterior
          </button>

          <button className="boton-primario" onClick={marcarCompletado}>
            Completar ✓
          </button>

          <button
            className="boton-secundario"
            onClick={irAlSiguiente}
            disabled={indiceActual === rutina.ejercicios.length - 1}
          >
            Siguiente →
          </button>
        </div>

        {indiceActual === rutina.ejercicios.length - 1 && (
          <div className="panel final-panel">
            <p>Has llegado al final. ¡Felicidades!</p>
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
