import { useState, useEffect } from "react";
import { useRutinas } from "../hooks/useRutinas";
import {
  crearPerfilDefault,
  usePerfil,
  type PreferenciasPerfil,
} from "../hooks/usePerfil";
import { useHistorial } from "../hooks/useHistorial";
import { inicioDeSemana } from "../utils/fechas";

const diasLabels: Record<string, string> = {
  domingo: "Domingo",
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
};

const diasPerfil = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
] as const;

type Props = {
  onReiniciarOnboarding?: () => void;
};

function Perfil({ onReiniciarOnboarding }: Props) {
  const { rutinas } = useRutinas();
  const { perfil, setPerfil } = usePerfil();
  const { historial, borrarEntrenamiento, limpiarHistorialSemana } = useHistorial();
  const [editando, setEditando] = useState(false);
  const [temporal, setTemporal] = useState<PreferenciasPerfil>(perfil);

  const entrenamientosSemana = historial.filter((entrenamiento) => {
    const desde = inicioDeSemana().getTime();
    return new Date(entrenamiento.fechaISO).getTime() >= desde;
  });

  useEffect(() => {
    setTemporal(perfil);
  }, [perfil]);

  function guardarCambios() {
    setPerfil(temporal);
    setEditando(false);
    alert("Perfil actualizado correctamente.");
  }

  function cancelar() {
    setTemporal(perfil);
    setEditando(false);
  }

  function resetearProgresoSemana() {
    const confirmar = window.confirm(
      "Seguro que queres borrar el progreso de esta semana? Esto va a resetear el resumen semanal y el mapa muscular."
    );

    if (!confirmar) return;

    limpiarHistorialSemana();
  }

  function borrarRegistro(id: string, nombre: string) {
    const confirmar = window.confirm(
      `Seguro que queres borrar el registro de "${nombre}"?`
    );

    if (!confirmar) return;

    borrarEntrenamiento(id);
  }

  function configurarPerfilDeNuevo() {
    const confirmar = window.confirm(
      "Queres volver a hacer el onboarding para configurar tu perfil?"
    );

    if (!confirmar) return;

    setPerfil({
      ...perfil,
      onboardingCompletado: false,
    });
    onReiniciarOnboarding?.();
  }

  function eliminarPerfil() {
    const confirmar = window.confirm(
      "Seguro que queres eliminar tu perfil? Vas a volver al onboarding para cargarlo de nuevo."
    );

    if (!confirmar) return;

    setPerfil(crearPerfilDefault());
    onReiniciarOnboarding?.();
  }

  function formatearFecha(fechaISO: string) {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(fechaISO));
  }

  if (editando) {
    return (
      <section className="pantalla-perfil">
        <h2>Editar perfil</h2>

        <div className="form-perfil panel">
          <div className="form-group">
            <label>
              Nombre
              <input
                type="text"
                value={temporal.nombre}
                onChange={(e) => setTemporal({ ...temporal, nombre: e.target.value })}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Objetivo semanal (entrenamientos)
              <input
                type="number"
                min="1"
                max="14"
                value={temporal.objetivoSemanal}
                onChange={(e) => setTemporal({ ...temporal, objetivoSemanal: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Objetivo mensual (entrenamientos)
              <input
                type="number"
                min="4"
                max="31"
                value={temporal.objetivoMensual}
                onChange={(e) => setTemporal({ ...temporal, objetivoMensual: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Nivel de experiencia
              <select
                value={temporal.nivelExperiencia}
                onChange={(e) => setTemporal({ ...temporal, nivelExperiencia: e.target.value as any })}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Tiempo de entrenamiento (minutos)
              <input
                type="number"
                min="15"
                max="180"
                step="15"
                value={temporal.tiempoEntrenamiento}
                onChange={(e) => setTemporal({ ...temporal, tiempoEntrenamiento: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Plan semanal de rutinas
            </label>
            <div className="plan-semanal-grid">
              {diasPerfil.map((dia) => (
                <label key={dia} className="plan-semanal-dia">
                  <span>{diasLabels[dia]}</span>
                  <select
                    value={temporal.planSemanal[dia] ?? ""}
                    onChange={(e) =>
                      setTemporal({
                        ...temporal,
                        planSemanal: {
                          ...temporal.planSemanal,
                          [dia]: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Descanso</option>
                    {rutinas.map((rutina) => (
                      <option key={rutina.id} value={rutina.id}>
                        {rutina.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="boton-primario" onClick={guardarCambios}>
              Guardar cambios
            </button>
            <button className="boton-secundario" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pantalla-perfil">
      <h2>Mi perfil</h2>

      <div className="perfil-info panel">
        <div className="info-item">
          <span className="label">Nombre:</span>
          <span className="value">{perfil.nombre}</span>
        </div>

        <div className="info-item">
          <span className="label">Objetivo semanal:</span>
          <span className="value">{perfil.objetivoSemanal} entrenamientos</span>
        </div>

        <div className="info-item">
          <span className="label">Objetivo mensual:</span>
          <span className="value">{perfil.objetivoMensual} entrenamientos</span>
        </div>

        <div className="info-item">
          <span className="label">Nivel de experiencia:</span>
          <span className="value">
            {perfil.nivelExperiencia === "principiante"
              ? "Principiante"
              : perfil.nivelExperiencia === "intermedio"
              ? "Intermedio"
              : "Avanzado"}
          </span>
        </div>

        <div className="info-item">
          <span className="label">Tiempo de entrenamiento:</span>
          <span className="value">{perfil.tiempoEntrenamiento} minutos</span>
        </div>
      </div>

      <div className="plan-semanal-panel panel">
        <h3>Plan semanal</h3>
        <div className="plan-semanal-lista">
          {diasPerfil.map((dia) => {
            const rutinaId = perfil.planSemanal[dia] || "";
            const rutina = rutinas.find((r) => r.id === rutinaId);
            return (
              <div key={dia} className="plan-semanal-item">
                <span>{diasLabels[dia]}:</span>
                <strong>{rutina ? rutina.nombre : "Descanso"}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="historial-perfil panel">
        <div className="historial-header">
          <div>
            <h3>Progreso y registros</h3>
            <p>{entrenamientosSemana.length} entrenamientos esta semana</p>
          </div>

          <button
            type="button"
            className="boton-secundario boton-peligro"
            onClick={resetearProgresoSemana}
            disabled={entrenamientosSemana.length === 0}
          >
            Resetear semana
          </button>
        </div>

        {historial.length === 0 ? (
          <p className="muted">Todavia no hay entrenamientos registrados.</p>
        ) : (
          <div className="historial-lista">
            {historial.map((entrenamiento) => (
              <div key={entrenamiento.id} className="historial-item">
                <div>
                  <strong>{entrenamiento.nombre}</strong>
                  <span>
                    {formatearFecha(entrenamiento.fechaISO)} ·{" "}
                    {entrenamiento.ejercicios.length} ejercicios
                  </span>
                </div>

                <button
                  type="button"
                  className="boton-secundario boton-peligro"
                  onClick={() => borrarRegistro(entrenamiento.id, entrenamiento.nombre)}
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="boton-primario" onClick={() => setEditando(true)}>
        Editar perfil
      </button>

      <button
        type="button"
        className="boton-secundario perfil-onboarding-boton"
        onClick={configurarPerfilDeNuevo}
      >
        Volver a hacer el onboarding
      </button>

      <button
        type="button"
        className="boton-secundario boton-peligro perfil-onboarding-boton"
        onClick={eliminarPerfil}
      >
        Eliminar perfil
      </button>
    </section>
  );
}

export default Perfil;
