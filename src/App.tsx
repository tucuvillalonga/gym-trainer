import { useState } from "react";
import { ejercicios } from "./data/ejercicios";
import type { Ejercicio } from "./types/ejercicio";
import TarjetaEjercicio from "./components/TarjetaEjercicio";
import DetalleEjercicio from "./components/DetalleEjercicio";

function App() {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
    useState<Ejercicio | null>(null);

  const [busqueda, setBusqueda] = useState("");

  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);

  const ejerciciosFiltrados = ejercicios.filter((ejercicio) => {
  const coincideBusqueda =
    ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    ejercicio.grupoMuscular.toLowerCase().includes(busqueda.toLowerCase());

  const coincideGrupo =
    grupoSeleccionado === null || ejercicio.grupoMuscular === grupoSeleccionado;

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

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="logo">Gym Trainer</h1>

        {!ejercicioSeleccionado && (
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
    Todos
  </button>

  {Object.keys(ejerciciosAgrupadosFiltrados).map((grupo) => (
    <button
      key={grupo}
      onClick={() => setGrupoSeleccionado(grupo)}
      className={grupoSeleccionado === grupo ? "activo" : ""}
    >
      {grupo}
    </button>
  ))}
</nav>
          </>
        )}
      </aside>

      <main className="contenido">
        {!ejercicioSeleccionado ? (
          <div className="grupos-ejercicios">
            {Object.entries(ejerciciosAgrupadosFiltrados).map(
              ([grupo, ejerciciosDelGrupo]) => (
                <section key={grupo} className="grupo-ejercicios">
                  <h2>{grupo}</h2>

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
              )
            )}
          </div>
        ) : (
          <div style={{ marginTop: "30px" }}>
            <button
              className="boton-volver"
              onClick={() => setEjercicioSeleccionado(null)}
            >
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