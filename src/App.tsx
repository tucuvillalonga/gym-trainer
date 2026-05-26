import { useEffect, useMemo, useState } from "react";
import { ejercicios } from "./data/ejercicios";
import { useRutinas } from "./hooks/useRutinas";
import type { Ejercicio } from "./types/ejercicio";
import type { Rutina } from "./types/rutina";
import TarjetaEjercicio from "./components/TarjetaEjercicio";
import DetalleEjercicio from "./components/DetalleEjercicio";
import MisRutinas from "./components/MisRutinas";
import Dashboard from "./components/Dashboard";
import Perfil from "./components/Perfil";
import WorkoutRunner from "./components/WorkoutRunner";

const CLAVE_FAVORITOS = "gym-trainer-favoritos";
const CLAVE_RUTINA_GUARDADA = "gym-trainer-rutina-guardada";

function App() {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
    useState<Ejercicio | null>(null);
  const [rutinaEnProgreso, setRutinaEnProgreso] = useState<Rutina | null>(null);
  const [rutinaPausada, setRutinaPausada] = useState(false);
  const [indiceRutinaActual, setIndiceRutinaActual] = useState(0);
  const [rutinasRestaurada, setRutinasRestaurada] = useState(false);
  const { rutinas } = useRutinas();
  const [busqueda, setBusqueda] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("Todos");
  const [pantalla, setPantalla] = useState<"inicio" | "ejercicios" | "rutinas" | "perfil">(
    "inicio"
  );
  const [dificultadSeleccionada, setDificultadSeleccionada] =
    useState("Todas");
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] =
    useState("Todos");
  const [soloConVideo, setSoloConVideo] = useState(false);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
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
        const coincideFavorito =
          !soloFavoritos || favoritos.includes(ejercicio.id);

        return (
          coincideBusqueda &&
          coincideGrupo &&
          coincideDificultad &&
          coincideEquipamiento &&
          coincideVideo &&
          coincideFavorito
        );
      }),
    [
      busqueda,
      grupoSeleccionado,
      dificultadSeleccionada,
      equipamientoSeleccionado,
      soloConVideo,
      soloFavoritos,
      favoritos,
    ]
  );

  const ejerciciosVisibles = useMemo(
    () => ejerciciosFiltrados,
    [ejerciciosFiltrados]
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
    if (rutinaEnProgreso) setRutinaPausada(true);
  }

  function irARutinas() {
    setPantalla("rutinas");
    setEjercicioSeleccionado(null);
    if (rutinaEnProgreso) setRutinaPausada(true);
  }

  function irAPerfil() {
    setPantalla("perfil");
    setEjercicioSeleccionado(null);
    if (rutinaEnProgreso) setRutinaPausada(true);
  }

  function limpiarFiltros() {
    setBusqueda("");
    setGrupoSeleccionado("Todos");
    setDificultadSeleccionada("Todas");
    setEquipamientoSeleccionado("Todos");
    setSoloConVideo(false);
    setSoloFavoritos(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cerrarEjercicio() {
    setEjercicioSeleccionado(null);
  }

  function iniciarEntrenamiento(rutina: Rutina) {
    console.log("iniciarEntrenamiento llamada con rutina:", rutina);
    if (!rutina || !rutina.ejercicios || rutina.ejercicios.length === 0) {
      alert("La rutina seleccionada no tiene ejercicios. Abre Mis rutinas para editarla.");
      setPantalla("rutinas");
      return;
    }

    setIndiceRutinaActual(0);
    setRutinaEnProgreso(rutina);
    setRutinaPausada(false);
  }

  function finalizarEntrenamiento() {
    setRutinaEnProgreso(null);
    localStorage.removeItem(CLAVE_RUTINA_GUARDADA);
  }

  // Restaurar rutina guardada (si existe) SOLO una vez al montar
  useEffect(() => {
    if (rutinasRestaurada) return;

    const guardada = localStorage.getItem(CLAVE_RUTINA_GUARDADA);
    if (!guardada) {
      setRutinasRestaurada(true);
      return;
    }

    try {
      const parsed = JSON.parse(guardada);
      const { rutinaId, indice = 0, pausada = false } = parsed;
      const encontrada = rutinas.find((r) => r.id === rutinaId);
      if (encontrada) {
        setRutinaEnProgreso(encontrada);
        setIndiceRutinaActual(indice);
        setRutinaPausada(pausada);
      }
    } catch (e) {
      // ignore
    }

    setRutinasRestaurada(true);
  }, []);

  // Sincronizar rutina en progreso en localStorage
  useEffect(() => {
    if (!rutinaEnProgreso) {
      localStorage.removeItem(CLAVE_RUTINA_GUARDADA);
      return;
    }

    const payload = {
      rutinaId: rutinaEnProgreso.id,
      indice: indiceRutinaActual,
      pausada: rutinaPausada,
    };

    localStorage.setItem(CLAVE_RUTINA_GUARDADA, JSON.stringify(payload));
  }, [rutinaEnProgreso, indiceRutinaActual, rutinaPausada]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">
            <strong>FIT<span>APP</span></strong>
            <small>Entrena tu mejor version</small>
          </span>
        </div>

        <nav className="sidebar-grupos">
          <button
            type="button"
            onClick={() => {
              setPantalla("inicio");
              if (rutinaEnProgreso) setRutinaEnProgreso(null);
              setEjercicioSeleccionado(null);
            }}
            className={pantalla === "inicio" ? "activo" : ""}
          >
            <span className="nav-icon" aria-hidden="true">⌂</span>
            <span>Inicio</span>
          </button>
          <button
            type="button"
            onClick={irAEjercicios}
            className={pantalla === "ejercicios" ? "activo" : ""}
          >
            <span className="nav-icon" aria-hidden="true">▦</span>
            <span>Ejercicios</span>
          </button>

          <button
            type="button"
            onClick={irARutinas}
            className={pantalla === "rutinas" ? "activo" : ""}
          >
            <span className="nav-icon" aria-hidden="true">▤</span>
            <span>Rutinas</span>
          </button>
        </nav>
      </aside>

      <main className="contenido">
        <div className="topbar">
          <div className="topbar-title">
            {pantalla === "inicio" && "Inicio"}
            {pantalla === "ejercicios" && "Ejercicios"}
            {pantalla === "rutinas" && "Mis rutinas"}
            {pantalla === "perfil" && "Perfil"}
          </div>
          {rutinaEnProgreso && rutinaPausada && (
            <button
              className="rutina-badge"
              style={{ marginLeft: "16px" }}
              onClick={() => setRutinaPausada(false)}
              aria-label={`Reanudar rutina ${rutinaEnProgreso.nombre}`}
            >
              <div className="rutina-badge-info">
                <span style={{ fontSize: "0.9rem" }}>⏸️ {rutinaEnProgreso.nombre}</span>
                <div className="rutina-badge-bar">
                  <div className="rutina-badge-fill" style={{ width: `${Math.round(((indiceRutinaActual + 1) / rutinaEnProgreso.ejercicios.length) * 100)}%` }} />
                </div>
              </div>
            </button>
          )}
          {rutinaEnProgreso && !rutinaPausada && (
            <div className="rutina-badge-activo">
              <span style={{ fontSize: "0.9rem" }}>🏋️ {rutinaEnProgreso.nombre}</span>
              <div className="rutina-badge-bar">
                <div className="rutina-badge-fill" style={{ width: `${Math.round(((indiceRutinaActual + 1) / rutinaEnProgreso.ejercicios.length) * 100)}%` }} />
              </div>
            </div>
          )}
          <button className="perfil-avatar" type="button" onClick={irAPerfil} aria-label="Abrir perfil">
            <span>👤</span>
          </button>
        </div>

        {rutinaEnProgreso && !rutinaPausada ? (
          <WorkoutRunner
            rutina={rutinaEnProgreso}
            onFinish={finalizarEntrenamiento}
            onCancel={finalizarEntrenamiento}
            onIndexChange={(i) => setIndiceRutinaActual(i)}
          />
        ) : pantalla === "inicio" ? (
          <Dashboard irAEjercicios={irAEjercicios} irARutinas={irARutinas} onEmpezar={iniciarEntrenamiento} />
        ) : pantalla === "rutinas" ? (
          <MisRutinas onEmpezar={iniciarEntrenamiento} />
        ) : pantalla === "perfil" ? (
          <Perfil />
        ) : pantalla === "ejercicios" && (
          <>
            {ejercicioSeleccionado ? (
              <section className="detalle-contenedor">
                <button type="button" className="boton-volver" onClick={cerrarEjercicio}>
                  ← Volver a la lista
                </button>
                <DetalleEjercicio ejercicio={ejercicioSeleccionado} />
              </section>
            ) : (
              <>
            <div className="panel panel-filtros">
              <div className="buscador">
                <input
                  type="text"
                  placeholder="Buscar ejercicio..."
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

                <label className="filtro-toggle">
                  <input
                    type="checkbox"
                    checked={soloFavoritos}
                    onChange={(event) => setSoloFavoritos(event.target.checked)}
                  />
                  Favoritos
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

            <div className="panel resumen-filtro">
              <p>
                {ejerciciosVisibles.length} ejercicios encontrados
                {soloConVideo ? " (solo con video)" : ""}
                {soloFavoritos ? " (favoritos)" : ""}
              </p>
              <p>Listado de ejercicios</p>
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

                    {rutinaEnProgreso && rutinaPausada && (
                      <div className="rutina-flotante">
                        <div className="panel">
                          <p>Rutina en pausa: {rutinaEnProgreso.nombre}</p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="boton-primario"
                              onClick={() => setRutinaPausada(false)}
                            >
                              Reanudar
                            </button>
                            <button
                              className="boton-secundario"
                              onClick={() => setRutinaEnProgreso(null)}
                            >
                              Salir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
              </>
            )}
          </>
        )}

      </main>
    </div>
  );
}

export default App;
