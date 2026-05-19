import { useState } from "react";
import { ejercicios } from "../data/ejercicios";
import { useRutinas } from "../hooks/useRutinas";

function MisRutinas() {
  const {
    rutinas,
    crearRutina,
    eliminarRutina,
    agregarEjercicioARutina,
    actualizarEjercicioDeRutina,
    eliminarEjercicioDeRutina,
  } = useRutinas();

  const [nombre, setNombre] = useState("");
  const [rutinaActivaId, setRutinaActivaId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const rutinaActiva = rutinas.find((rutina) => rutina.id === rutinaActivaId);

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
    return (
      <section>
        <button
          className="boton-volver"
          onClick={() => setRutinaActivaId(null)}
        >
          ← Volver a mis rutinas
        </button>

        <div className="detalle-header">
          <h2>{rutinaActiva.nombre}</h2>
          <p>{rutinaActiva.ejercicios.length} ejercicios cargados</p>
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

                if (!ejercicio) return null;

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
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(
                                rutinaActiva.id,
                                item.ejercicioId,
                                { series: Number(e.target.value) }
                              )
                            }
                          />
                        </label>

                        <label>
                          Reps
                          <input
                            type="number"
                            value={item.repeticiones}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(
                                rutinaActiva.id,
                                item.ejercicioId,
                                { repeticiones: Number(e.target.value) }
                              )
                            }
                          />
                        </label>

                        <label>
                          Peso
                          <input
                            type="number"
                            value={item.peso}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(
                                rutinaActiva.id,
                                item.ejercicioId,
                                { peso: Number(e.target.value) }
                              )
                            }
                          />
                        </label>

                        <label>
                          Tipo
                          <select
                            value={item.tipoPeso}
                            onChange={(e) =>
                              actualizarEjercicioDeRutina(
                                rutinaActiva.id,
                                item.ejercicioId,
                                {
                                  tipoPeso: e.target.value as
                                    | "total"
                                    | "por mancuerna"
                                    | "polea"
                                    | "corporal",
                                }
                              )
                            }
                          >
                            <option value="total">Total</option>
                            <option value="por mancuerna">Por mancuerna</option>
                            <option value="polea">Polea</option>
                            <option value="corporal">Corporal</option>
                          </select>
                        </label>
                      </div>

                      <button
                        className="boton-secundario"
                        onClick={() =>
                          eliminarEjercicioDeRutina(
                            rutinaActiva.id,
                            item.ejercicioId
                          )
                        }
                      >
                        Sacar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel">
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
                    onClick={() =>
                      agregarEjercicioARutina(rutinaActiva.id, ejercicio.id)
                    }
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2>Mis rutinas</h2>

      <div className="crear-rutina">
        <input
          value={nombre}
          placeholder="Ej: Push"
          onChange={(e) => setNombre(e.target.value)}
        />

        <button
          onClick={() => {
            if (!nombre.trim()) return;
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

            <button
              className="boton-secundario"
              onClick={(e) => {
                e.stopPropagation();
                eliminarRutina(rutina.id);
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MisRutinas;