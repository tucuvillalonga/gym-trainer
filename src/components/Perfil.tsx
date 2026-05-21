import { useState, useEffect } from "react";
import { useRutinas } from "../hooks/useRutinas";
import { usePerfil, type PreferenciasPerfil } from "../hooks/usePerfil";

const diasLabels: Record<string, string> = {
  domingo: "Domingo",
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
};

function Perfil() {
  const { rutinas } = useRutinas();
  const { perfil, setPerfil, diasSemana } = usePerfil();
  const [editando, setEditando] = useState(false);
  const [temporal, setTemporal] = useState<PreferenciasPerfil>(perfil);

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
              {diasSemana.map((dia) => (
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
          {diasSemana.map((dia) => {
            const rutinaId = perfil.planSemanal[dia] || "";
            const rutina = rutinas.find((r) => r.id === rutinaId);
            return (
              <div key={dia} className="plan-semanal-item">
                <span>{diasLabels[dia]}</span>
                <strong>{rutina ? rutina.nombre : "Descanso"}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <button className="boton-primario" onClick={() => setEditando(true)}>
        Editar perfil
      </button>
    </section>
  );
}

export default Perfil;
