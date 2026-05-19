import { useState } from "react";
import { ejercicios } from "./data/ejercicios";
import type { Ejercicio } from "./types/ejercicio";
import TarjetaEjercicio from "./components/TarjetaEjercicio";
import DetalleEjercicio from "./components/DetalleEjercicio";
import MisRutinas from "./components/MisRutinas";

function App() {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
    useState<Ejercicio | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(
    null
  );
  const [pantalla, setPantalla] = useState<"ejercicios" | "rutinas">(
    "ejercicios"
  );

  const ejerciciosFiltrados = ejercicios.filter((ejercicio) => {
    const coincideBusqueda =
      ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ejercicio.grupoMuscular.toLowerCase().includes(busqueda.toLowerCase());

    const coincideGrupo =
      grupoSeleccionado === null ||
      ejercicio.grupoMuscular === grupoSeleccionado;

    return coincideBusqueda && coincideGrupo;
  });

  const ejerciciosAgrupadosFiltrados =
    ejerciciosFiltrados.reduce<Record<string, Ejercicio[]>>(
      (grupos, ejercicio) => {
        if (!grupos[ejercicio.grupoMuscular]) {
          grupos[ejercicio.grupoMuscular] = [];
        }

        grupos[ejercicio.grupoMuscular].push(ejercicio);

        return grupos;
      },
      {}
    );

  const gruposOrdenados = Object.entries(ejerciciosAgrupadosFiltrados).sort(
    ([grupoA], [grupoB]) => {
      if (grupoA === "Otros") return 1;
      if (grupoB === "Otros") return -1;

      return grupoA.localeCompare(grupoB);
    }
  );

  const todosLosGrupos = Array.from(
    new Set(ejercicios.map((ejercicio) => ejercicio.grupoMuscular))
  ).sort((grupoA, grupoB) => {
    if (grupoA === "Otros") return 1;
    if (grupoB === "Otros") return -1;

    return grupoA.localeCompare(grupoB);
  });

  const cantidadPorGrupo = ejercicios.reduce<Record<string, number>>(
    (cantidades, ejercicio) => {
      cantidades[ejercicio.grupoMuscular] =
        (cantidades[ejercicio.grupoMuscular] ?? 0) + 1;

      return cantidades;
    },
    {}
  );

  function irAEjercicios() {
    setPantalla("ejercicios");
    setEjercicioSeleccionado(null);
  }

  function irARutinas() {
    setPantalla("rutinas");
    setEjercicioSeleccionado(null);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="logo">Gym Trainer</h1>

        <nav className="sidebar-grupos">
          <button
            onClick={irAEjercicios}
            className={pantalla === "ejercicios" ? "activo" : ""}
          >
            Ejercicios
          </button>

          <button
            onClick={irARutinas}
            className={pantalla === "rutinas" ? "activo" : ""}
          >
            Mis rutinas
          </button>
        </nav>

        {pantalla === "ejercicios" && !ejercicioSeleccionado && (
          <>
            <div className="buscador">
              <input
                type="text"
                placeholder="Buscar ejercicio..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>

            <nav className="sidebar-grupos">
              <button
                onClick={() => setGrupoSeleccionado(null)}
                className={grupoSeleccionado === null ? "activo" : ""}
              >
                <span>Todos</span>
                <span className="contador-grupo">{ejercicios.length}</span>
              </button>

              {todosLosGrupos.map((grupo) => (
                <button
                  key={grupo}
                  onClick={() => setGrupoSeleccionado(grupo)}
                  className={grupoSeleccionado === grupo ? "activo" : ""}
                >
                  <span>{grupo}</span>
                  <span className="contador-grupo">
                    {cantidadPorGrupo[grupo] ?? 0}
                  </span>
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>

      <main className="contenido">
        {pantalla === "rutinas" ? (
          <MisRutinas />
        ) : !ejercicioSeleccionado ? (
          <div className="grupos-ejercicios">
            {gruposOrdenados.map(([grupo, ejerciciosDelGrupo]) => (
              <section key={grupo} className="grupo-ejercicios">
                <h2>
                  {grupo}
                  <span className="contador-titulo">
                    {ejerciciosDelGrupo.length}
                  </span>
                </h2>

                <div className="grilla-ejercicios">
                  {ejerciciosDelGrupo.map((ejercicio) => (
                    <div
                      key={ejercicio.id}
                      onClick={() => setEjercicioSeleccionado(ejercicio)}
                      style={{ cursor: "pointer" }}
                    >
                      <TarjetaEjercicio ejercicio={ejercicio} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: "30px" }}>
            <button className="boton-volver" onClick={irAEjercicios}>
              ← Volver a ejercicios
            </button>

            <DetalleEjercicio ejercicio={ejercicioSeleccionado} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;