import { useEffect, useMemo, useState } from "react";
import { ejercicios } from "./data/ejercicios";
import type { Ejercicio } from "./types/ejercicio";
import type { Rutina } from "./types/rutina";
import TarjetaEjercicio from "./components/TarjetaEjercicio";
import DetalleEjercicio from "./components/DetalleEjercicio";
import MisRutinas from "./components/MisRutinas";
import Dashboard from "./components/Dashboard";
import Perfil from "./components/Perfil";
import WorkoutRunner from "./components/WorkoutRunner";

const CLAVE_FAVORITOS = "gym-trainer-favoritos";

function App() {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
    useState<Ejercicio | null>(null);
  const [rutinaEnProgreso, setRutinaEnProgreso] = useState<Rutina | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("Todos");
  const [pantalla, setPantalla] = useState<"inicio" | "ejercicios" | "favoritos" | "rutinas" | "perfil">(
    "inicio"
  );
  const [dificultadSeleccionada, setDificultadSeleccionada] =
    useState("Todas");
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] =
    useState("Todos");
  const [soloConVideo, setSoloConVideo] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    const guardados = localStorage.getItem(CLAVE_FAVORITOS);
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  }, [favoritos]);

  const todasDificultades = useMemo(
    () => ["Todas", ...new Set(ejercicios.map((ejercicio) => ejercicio.dificultad))],
    []
  );

  const todosLosGrupos = useMemo(() => {
    return [
      "Todos",
      ...Array.from(new Set(ejercicios.map((ejercicio) => ejercicio.grupoMuscular))).sort(
        (a, b) => {
          if (a === "Otros") return 1;
          if (b === "Otros") return -1;
          return a.localeCompare(b);
        }
      ),
    ];
  }, []);

  const todosLosEquipamientos = useMemo(() => {
    const valores = ejercicios.flatMap((ejercicio) => ejercicio.equipamiento ?? []);
    return ["Todos", ...Array.from(new Set(valores)).sort()];
  }, []);

  const ejerciciosFiltrados = useMemo(
    () =>
      ejercicios.filter((ejercicio) => {
        const termino = busqueda.toLowerCase().trim();
        const coincideBusqueda =
          termino.length === 0 ||
          ejercicio.nombre.toLowerCase().includes(termino) ||
          ejercicio.grupoMuscular.toLowerCase().includes(termino) ||
          ejercicio.equipamiento?.some((equipo) =>
            equipo.toLowerCase().includes(termino)
          );

        const coincideGrupo =
          grupoSeleccionado === "Todos" ||
          ejercicio.grupoMuscular === grupoSeleccionado;

        const coincideDificultad =
          dificultadSeleccionada === "Todas" ||
          ejercicio.dificultad === dificultadSeleccionada;

        const coincideEquipamiento =
          equipamientoSeleccionado === "Todos" ||
          ejercicio.equipamiento?.includes(equipamientoSeleccionado);

        const coincideVideo = !soloConVideo || Boolean(ejercicio.youtubeId);

        return (
          coincideBusqueda &&
          coincideGrupo &&
          coincideDificultad &&
          coincideEquipamiento &&
          coincideVideo
        );
      }),
    [busqueda, grupoSeleccionado, dificultadSeleccionada, equipamientoSeleccionado, soloConVideo]
  );

  const ejerciciosFavoritos = useMemo(
    () =>
      ejercicios.filter((ejercicio) => favoritos.includes(ejercicio.id)),
    [favoritos]
  );

  const ejerciciosVisibles = useMemo(
    () => (pantalla === "favoritos" ? ejerciciosFavoritos : ejerciciosFiltrados),
    [pantalla, ejerciciosFavoritos, ejerciciosFiltrados]
  );

  const ejerciciosAgrupadosFiltrados = useMemo(
    () =>
      ejerciciosVisibles.reduce<Record<string, Ejercicio[]>>(
        (grupos, ejercicio) => {
          if (!grupos[ejercicio.grupoMuscular]) {
            grupos[ejercicio.grupoMuscular] = [];
          }

          grupos[ejercicio.grupoMuscular].push(ejercicio);
          return grupos;
        },
        {}
      ),
    [ejerciciosVisibles]
  );

  const gruposOrdenados = useMemo(
    () =>
      Object.entries(ejerciciosAgrupadosFiltrados).sort(
        ([grupoA], [grupoB]) => {
          if (grupoA === "Otros") return 1;
          if (grupoB === "Otros") return -1;
          return grupoA.localeCompare(grupoB);
        }
      ),
    [ejerciciosAgrupadosFiltrados]
  );

  function irAEjercicios() {
    setPantalla("ejercicios");
    setEjercicioSeleccionado(null);
  }

  function irAFavoritos() {
    setPantalla("favoritos");
    setEjercicioSeleccionado(null);
  }

  function irARutinas() {
    setPantalla("rutinas");
    setEjercicioSeleccionado(null);
  }

  function irAPerfil() {
    setPantalla("perfil");
    setEjercicioSeleccionado(null);
  }

  function limpiarFiltros() {
    setBusqueda("");
    setGrupoSeleccionado("Todos");
    setDificultadSeleccionada("Todas");
    setEquipamientoSeleccionado("Todos");
    setSoloConVideo(false);
    setEjercicioSeleccionado(null);
  }

  function toggleFavorito(ejercicioId: string) {
    setFavoritos((actuales) =>
      actuales.includes(ejercicioId)
        ? actuales.filter((id) => id !== ejercicioId)
        : [...actuales, ejercicioId]
    );
  }

  function abrirEjercicio(ejercicio: Ejercicio) {
    setEjercicioSeleccionado(ejercicio);
  }

  function cerrarEjercicio() {
    setEjercicioSeleccionado(null);
  }

  function iniciarEntrenamiento(rutina: Rutina) {
    setRutinaEnProgreso(rutina);
  }

  function finalizarEntrenamiento() {
    setRutinaEnProgreso(null);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="logo">Gym Trainer</h1>

        <nav className="sidebar-grupos">
          <button
            type="button"
            onClick={() => setPantalla("inicio")}
            className={pantalla === "inicio" ? "activo" : ""}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={irAEjercicios}
            className={pantalla === "ejercicios" ? "activo" : ""}
          >
            Ejercicios
          </button>

          <button
            type="button"
            onClick={irAFavoritos}
            className={pantalla === "favoritos" ? "activo" : ""}
          >
            Favoritos
          </button>

          <button
            type="button"
            onClick={irARutinas}
            className={pantalla === "rutinas" ? "activo" : ""}
          >
            Mis rutinas
          </button>
        </nav>
      </aside>

      <main className="contenido">
        <div className="topbar">
          <div className="topbar-title">
            {pantalla === "inicio" && "Inicio"}
            {pantalla === "ejercicios" && "Ejercicios"}
            {pantalla === "favoritos" && "Favoritos"}
            {pantalla === "rutinas" && "Mis rutinas"}
            {pantalla === "perfil" && "Perfil"}
          </div>
          <button className="perfil-avatar" type="button" onClick={irAPerfil} aria-label="Abrir perfil">
            <span>👤</span>
          </button>
        </div>

        {rutinaEnProgreso ? (
          <WorkoutRunner
            rutina={rutinaEnProgreso}
            onFinish={finalizarEntrenamiento}
            onCancel={finalizarEntrenamiento}
          />
        ) : pantalla === "inicio" ? (
          <Dashboard irAEjercicios={irAEjercicios} irARutinas={irARutinas} onEmpezar={iniciarEntrenamiento} />
        ) : (
          (pantalla === "ejercicios" || pantalla === "favoritos") && (
          <div className="panel panel-filtros">
            <div className="buscador">
              <input
                type="text"
                placeholder={
                  pantalla === "favoritos"
                    ? "Buscar favoritos..."
                    : "Buscar ejercicio..."
                }
                value={busqueda}
                onChange={(event) => {
                  setBusqueda(event.target.value);
                  setEjercicioSeleccionado(null);
                }}
              />
            </div>

            <div className="filtros-avanzados filtros-grid">
              <label>
                Grupo muscular
                <select
                  value={grupoSeleccionado}
                  onChange={(event) => setGrupoSeleccionado(event.target.value)}
                >
                  {todosLosGrupos.map((grupo) => (
                    <option key={grupo} value={grupo}>
                      {grupo}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Dificultad
                <select
                  value={dificultadSeleccionada}
                  onChange={(event) => setDificultadSeleccionada(event.target.value)}
                >
                  {todasDificultades.map((dificultad) => (
                    <option key={dificultad} value={dificultad}>
                      {dificultad}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Equipamiento
                <select
                  value={equipamientoSeleccionado}
                  onChange={(event) => setEquipamientoSeleccionado(event.target.value)}
                >
                  {todosLosEquipamientos.map((equipo) => (
                    <option key={equipo} value={equipo}>
                      {equipo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filtro-toggle">
                <input
                  type="checkbox"
                  checked={soloConVideo}
                  onChange={(event) => setSoloConVideo(event.target.checked)}
                />
                Solo con video
              </label>

              <button
                type="button"
                className="boton-secundario boton-borrar-filtros"
                onClick={limpiarFiltros}
              >
                Borrar filtros
              </button>
            </div>
          </div>
          )
        )}

        {ejercicioSeleccionado ? (
          <section className="detalle-contenedor">
            <button type="button" className="boton-volver" onClick={cerrarEjercicio}>
              ← Volver a la lista
            </button>
            <DetalleEjercicio ejercicio={ejercicioSeleccionado} />
          </section>
        ) : pantalla === "rutinas" ? (
          <MisRutinas />
        ) : pantalla === "perfil" ? (
          <Perfil />
        ) : (pantalla === "ejercicios" || pantalla === "favoritos") && (
          <>
            <div className="panel resumen-filtro">
              <p>
                {ejerciciosVisibles.length} ejercicios encontrados
                {soloConVideo ? " (solo con video)" : ""}
              </p>
              <p>
                {pantalla === "favoritos"
                  ? "Favoritos"
                  : "Listado de ejercicios"}
              </p>
            </div>

            {gruposOrdenados.length === 0 ? (
              <div className="sin-resultados">
                <p>No encontramos ejercicios para esos filtros.</p>
              </div>
            ) : (
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
                          className="tarjeta-clickable"
                          role="button"
                          tabIndex={0}
                          onClick={() => abrirEjercicio(ejercicio)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              abrirEjercicio(ejercicio);
                            }
                          }}
                        >
                          <TarjetaEjercicio
                            ejercicio={ejercicio}
                            favorito={favoritos.includes(ejercicio.id)}
                            onToggleFavorito={toggleFavorito}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
