import { useState } from "react";
import { ejercicios } from "../data/ejercicios";
import { useRutinas } from "../hooks/useRutinas";
import { useHistorial } from "../hooks/useHistorial";

function MisRutinas() {
  const {
    rutinas,
    crearRutina,
    eliminarRutina,
    agregarEjercicioARutina,
    actualizarEjercicioDeRutina,
    eliminarEjercicioDeRutina,
    actualizarNombreRutina,
  } = useRutinas();
  const { registrarEntrenamiento } = useHistorial();

  const [nombre, setNombre] = useState("");
  const [rutinaActivaId, setRutinaActivaId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");

  const rutinaActiva = rutinas.find((rutina) => rutina.id === rutinaActivaId);

  function borrarRutinaActiva() {
    if (!rutinaActiva) {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar "${rutinaActiva.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    eliminarRutina(rutinaActiva.id);
    setRutinaActivaId(null);
    setModoEdicion(false);
    setBusqueda("");
  }

  const ejerciciosDisponibles = ejercicios.filter((ejercicio) => {
    if (!rutinaActiva) return false;

    const yaAgregado = rutinaActiva.ejercicios.some(
      (item) => item.ejercicioId === ejercicio.id
    );

    const coincideBusqueda =
      ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ejercicio.grupoMuscular.toLowerCase().includes(busqueda.toLowerCase());

    return !yaAgregado && coincideBusqueda;
  });

  if (rutinaActiva) {
    const mostrarPanelAgregar = modoEdicion || rutinaActiva.ejercicios.length === 0;

    function completarRutina() {
      if (!rutinaActiva) return;
      registrarEntrenamiento(rutinaActiva);
      alert(`Rutina "${rutinaActiva.nombre}" registrada como completada.`);
    }

    return (
      <section className="pantalla-rutinas detalle-rutina-activa">
        <button
          className="boton-volver"
          onClick={() => {
            setRutinaActivaId(null);
            setModoEdicion(false);
            setBusqueda("");
          }}
        >
          ← Volver a mis rutinas
        </button>

        <div className="detalle-header rutina-header">
          {modoEdicion ? (
            <div className="editar-rutina-inline">
              <input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />

              <button
                type="button"
                onClick={() => {
                  if (!nuevoNombre.trim()) {
                    return;
                  }

                  actualizarNombreRutina(rutinaActiva.id, nuevoNombre);
                  setModoEdicion(false);
                }}
              >
                Guardar nombre
              </button>

              <button
                type="button"
                className="boton-secundario"
                onClick={() => {
                  setModoEdicion(false);
                }}
              >
                Terminar edición
              </button>
            </div>
          ) : (
            <>
              <h2>{rutinaActiva.nombre}</h2>
              <p>{rutinaActiva.ejercicios.length} ejercicios cargados</p>
            </>
          )}
        </div>

        <div className="menu-rutina">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => {
              setNuevoNombre(rutinaActiva.nombre);
              setModoEdicion(true);
            }}
          >
            Editar
          </button>
          <button
            type="button"
            className="boton-secundario"
            onClick={completarRutina}
          >
            Completar
          </button>

          <button
            type="button"
            className="boton-secundario eliminar"
            onClick={borrarRutinaActiva}
          >
            Eliminar
          </button>
        </div>

        <div className="rutina-detalle-grid">
          <div className="panel">
            <h3>Ejercicios de la rutina</h3>

            <div className="rutina-ejercicios-lista">
              {rutinaActiva.ejercicios.length === 0 && (
                <p>Todavía no agregaste ejercicios.</p>
              )}

              {rutinaActiva.ejercicios.map((item) => {
                const ejercicio = ejercicios.find(
                  (ejercicio) => ejercicio.id === item.ejercicioId
                );

                if (!ejercicio) {
                  return null;
                }

                return (
                  <div key={item.ejercicioId} className="rutina-ejercicio-card">
                    <img src={ejercicio.imagen} alt={ejercicio.nombre} />

                    <div className="rutina-ejercicio-info">
                      <h4>{ejercicio.nombre}</h4>
                      <span>{ejercicio.grupoMuscular}</span>

                      <div className="rutina-campos">
                        <label>
                          Series
                          <input
                            type="number"
                            value={item.series}
                            disabled={!modoEdicion}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(rutinaActiva.id, item.ejercicioId, {
                                series: Number(e.target.value),
                              })
                            }
                          />
                        </label>

                        <label>
                          Reps
                          <input
                            type="number"
                            value={item.repeticiones}
                            disabled={!modoEdicion}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(rutinaActiva.id, item.ejercicioId, {
                                repeticiones: Number(e.target.value),
                              })
                            }
                          />
                        </label>

                        <label>
                          Peso
                          <input
                            type="number"
                            value={item.peso}
                            disabled={!modoEdicion}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(rutinaActiva.id, item.ejercicioId, {
                                peso: Number(e.target.value),
                              })
                            }
                          />
                        </label>

                        <label>
                          Tipo
                          <select
                            value={item.tipoPeso}
                            disabled={!modoEdicion}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(rutinaActiva.id, item.ejercicioId, {
                                tipoPeso: e.target.value as
                                  | "total"
                                  | "por mancuerna"
                                  | "polea"
                                  | "corporal",
                              })
                            }
                          >
                            <option value="total">Total</option>
                            <option value="por mancuerna">Por mancuerna</option>
                            <option value="polea">Polea</option>
                            <option value="corporal">Corporal</option>
                          </select>
                        </label>
                      </div>

                      {modoEdicion && (
                        <button
                          type="button"
                          className="boton-secundario"
                          onClick={() =>
                            eliminarEjercicioDeRutina(rutinaActiva.id, item.ejercicioId)
                          }
                        >
                          Sacar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {mostrarPanelAgregar && (
            <div>
              <div className="panel panel-agregar-ejercicios">
                <h3>Agregar ejercicios</h3>

                <div className="buscador">
                  <input
                    type="text"
                    placeholder="Buscar por ejercicio o músculo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <div className="lista-agregar-ejercicios">
                  {ejerciciosDisponibles.map((ejercicio) => (
                    <div key={ejercicio.id} className="fila-ejercicio-rutina">
                      <div className="fila-ejercicio-info">
                        <img src={ejercicio.imagen} alt={ejercicio.nombre} />
                        <span>{ejercicio.nombre}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => agregarEjercicioARutina(rutinaActiva.id, ejercicio.id)}
                      >
                        Agregar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="pantalla-rutinas">
      <h2>Mis rutinas</h2>

      <div className="crear-rutina">
        <input
          value={nombre}
          placeholder="Ej: Push"
          onChange={(e) => setNombre(e.target.value)}
        />

        <button
          type="button"
          onClick={() => {
            if (!nombre.trim()) {
              return;
            }

            crearRutina(nombre);
            setNombre("");
          }}
        >
          Crear
        </button>
      </div>

      <div className="rutinas-grid">
        {rutinas.map((rutina) => (
          <div
            key={rutina.id}
            className="panel rutina-card-clickeable"
            onClick={() => setRutinaActivaId(rutina.id)}
          >
            <h3>{rutina.nombre}</h3>
            <p>{rutina.ejercicios.length} ejercicios</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MisRutinas;
