import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ejercicios } from "./data/ejercicios";
import { useRutinas } from "./hooks/useRutinas";
import type { Ejercicio, RegionMuscular } from "./types/ejercicio";
import type { Rutina } from "./types/rutina";
import TarjetaEjercicio from "./components/TarjetaEjercicio";
import DetalleEjercicio from "./components/DetalleEjercicio";
import MisRutinas from "./components/MisRutinas";
import Dashboard from "./components/Dashboard";
import Perfil from "./components/Perfil";
import WorkoutRunner from "./components/WorkoutRunner";
import {
  CLAVE_EJERCICIOS_PERSONALIZADOS,
  obtenerEjerciciosPersonalizados,
} from "./utils/ejerciciosPersonalizados";

const CLAVE_FAVORITOS = "gym-trainer-favoritos";
const CLAVE_RUTINA_GUARDADA = "gym-trainer-rutina-guardada";

const GRUPOS_PERSONALIZADOS = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Biceps",
  "Triceps",
  "Piernas",
  "Core",
  "Otros",
];

const REGIONES_MUSCULARES: Array<{ valor: RegionMuscular; etiqueta: string }> = [
  { valor: "pectoral", etiqueta: "Pecho" },
  { valor: "dorsales", etiqueta: "Dorsales" },
  { valor: "espaldaAlta", etiqueta: "Espalda alta" },
  { valor: "espaldaMedia", etiqueta: "Espalda media" },
  { valor: "espaldaBaja", etiqueta: "Espalda baja" },
  { valor: "trapecios", etiqueta: "Trapecios" },
  { valor: "deltoides", etiqueta: "Hombros" },
  { valor: "biceps", etiqueta: "Biceps" },
  { valor: "triceps", etiqueta: "Triceps" },
  { valor: "antebrazos", etiqueta: "Antebrazos" },
  { valor: "abdominales", etiqueta: "Abdominales" },
  { valor: "oblicuos", etiqueta: "Oblicuos" },
  { valor: "cuadriceps", etiqueta: "Cuadriceps" },
  { valor: "isquiotibiales", etiqueta: "Isquiotibiales" },
  { valor: "gluteos", etiqueta: "Gluteos" },
  { valor: "pantorrillas", etiqueta: "Pantorrillas" },
];

const EJERCICIO_PERSONALIZADO_INICIAL = {
  nombre: "",
  grupoMuscular: "Pecho",
  musculoPrincipal: "pectoral" as RegionMuscular,
  dificultad: "Principiante" as Ejercicio["dificultad"],
  equipamiento: "",
  youtubeId: "",
  descripcion: "",
  imagen: "",
};

function extraerYoutubeId(valor: string) {
  const texto = valor.trim();
  if (!texto) return "";

  const match =
    texto.match(/youtu\.be\/([^?&]+)/) ||
    texto.match(/[?&]v=([^?&]+)/) ||
    texto.match(/embed\/([^?&]+)/);

  return match?.[1] ?? texto;
}

function crearIdEjercicioPersonalizado(nombre: string) {
  const base = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `custom-${base || "ejercicio"}-${Date.now()}`;
}

function normalizarBusqueda(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function App() {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
    useState<Ejercicio | null>(null);
  const [rutinaEnProgreso, setRutinaEnProgreso] = useState<Rutina | null>(null);
  const [rutinaPausada, setRutinaPausada] = useState(false);
  const [indiceRutinaActual, setIndiceRutinaActual] = useState(0);
  const [rutinasRestaurada, setRutinasRestaurada] = useState(false);
  const { rutinas, eliminarEjercicioDeRutina } = useRutinas();
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
  const [soloCreadosPorMi, setSoloCreadosPorMi] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarCrearEjercicio, setMostrarCrearEjercicio] = useState(false);
  const [nuevoEjercicio, setNuevoEjercicio] = useState(EJERCICIO_PERSONALIZADO_INICIAL);
  const [ejerciciosPersonalizados, setEjerciciosPersonalizados] = useState<Ejercicio[]>(
    () => obtenerEjerciciosPersonalizados()
  );
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    const guardados = localStorage.getItem(CLAVE_FAVORITOS);
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    localStorage.setItem(
      CLAVE_EJERCICIOS_PERSONALIZADOS,
      JSON.stringify(ejerciciosPersonalizados)
    );
  }, [ejerciciosPersonalizados]);

  const ejerciciosDisponibles = useMemo(
    () => [...ejercicios, ...ejerciciosPersonalizados],
    [ejerciciosPersonalizados]
  );

  const todasDificultades = useMemo(
    () => [
      "Todas",
      ...new Set(ejerciciosDisponibles.map((ejercicio) => ejercicio.dificultad)),
    ],
    [ejerciciosDisponibles]
  );

  const todosLosGrupos = useMemo(() => {
    return [
      "Todos",
      ...Array.from(
        new Set(ejerciciosDisponibles.map((ejercicio) => ejercicio.grupoMuscular))
      ).sort((a, b) => {
        if (a === "Otros") return 1;
        if (b === "Otros") return -1;
        return a.localeCompare(b);
      }),
    ];
  }, [ejerciciosDisponibles]);

  const todosLosEquipamientos = useMemo(() => {
    const valores = ejerciciosDisponibles.flatMap(
      (ejercicio) => ejercicio.equipamiento ?? []
    );
    return ["Todos", ...Array.from(new Set(valores)).sort()];
  }, [ejerciciosDisponibles]);

  const ejerciciosFiltrados = useMemo(
    () =>
      ejerciciosDisponibles.filter((ejercicio) => {
        const termino = normalizarBusqueda(busqueda);
        const coincideBusqueda =
          termino.length === 0 ||
          normalizarBusqueda(ejercicio.nombre).includes(termino) ||
          normalizarBusqueda(ejercicio.grupoMuscular).includes(termino) ||
          normalizarBusqueda(ejercicio.descripcion ?? "").includes(termino) ||
          ejercicio.equipamiento?.some((equipo) =>
            normalizarBusqueda(equipo).includes(termino)
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
        const coincideCreadoPorMi =
          !soloCreadosPorMi || ejercicio.id.startsWith("custom-");

        return (
          coincideBusqueda &&
          coincideGrupo &&
          coincideDificultad &&
          coincideEquipamiento &&
          coincideVideo &&
          coincideFavorito &&
          coincideCreadoPorMi
        );
      }),
    [
      busqueda,
      grupoSeleccionado,
      dificultadSeleccionada,
      equipamientoSeleccionado,
      soloConVideo,
      soloFavoritos,
      soloCreadosPorMi,
      favoritos,
      ejerciciosDisponibles,
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
          const termino = normalizarBusqueda(busqueda);
          const grupoANormalizado = normalizarBusqueda(grupoA);
          const grupoBNormalizado = normalizarBusqueda(grupoB);
          const grupoACoincide = termino.length > 0 && grupoANormalizado.includes(termino);
          const grupoBCoincide = termino.length > 0 && grupoBNormalizado.includes(termino);

          if (grupoACoincide && !grupoBCoincide) return -1;
          if (!grupoACoincide && grupoBCoincide) return 1;
          if (grupoA === "Otros") return 1;
          if (grupoB === "Otros") return -1;
          return grupoA.localeCompare(grupoB);
        }
      ),
    [ejerciciosAgrupadosFiltrados, busqueda]
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
    setSoloCreadosPorMi(false);
    setEjercicioSeleccionado(null);
  }

  function cargarFotoPersonalizada(archivo: File | undefined) {
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      if (typeof lector.result !== "string") return;
      setNuevoEjercicio((actual) => ({
        ...actual,
        imagen: lector.result as string,
      }));
    };
    lector.readAsDataURL(archivo);
  }

  function guardarEjercicioPersonalizado(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nombre = nuevoEjercicio.nombre.trim();
    if (!nombre) {
      alert("Ponele un nombre al ejercicio.");
      return;
    }

    const equipamiento = nuevoEjercicio.equipamiento
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const descripcion =
      nuevoEjercicio.descripcion.trim() ||
      `Ejercicio personalizado enfocado en ${nuevoEjercicio.grupoMuscular.toLowerCase()}.`;

    const ejercicioCreado: Ejercicio = {
      id: crearIdEjercicioPersonalizado(nombre),
      nombre,
      imagen: nuevoEjercicio.imagen || "/fitapp-logo.png",
      grupoMuscular: nuevoEjercicio.grupoMuscular,
      musculoPrincipal: nuevoEjercicio.musculoPrincipal,
      dificultad: nuevoEjercicio.dificultad,
      equipamiento,
      objetivo: "Hipertrofia",
      tipoEjercicio: "Compuesto",
      youtubeId: extraerYoutubeId(nuevoEjercicio.youtubeId),
      descripcion,
      checklist: [
        "Ajusta la carga para mantener una tecnica controlada.",
        "Completa el recorrido sin perder la postura.",
        "Respira de forma estable durante cada repeticion.",
      ],
      erroresComunes: [
        "Usar mas peso del que podes controlar.",
        "Acelerar el movimiento y perder tension.",
        "Cambiar la postura para terminar la serie.",
      ],
      mapaDeEnfoque: [
        { region: nuevoEjercicio.musculoPrincipal, nivel: "principal" },
      ],
    };

    setEjerciciosPersonalizados((actuales) => [...actuales, ejercicioCreado]);
    setNuevoEjercicio(EJERCICIO_PERSONALIZADO_INICIAL);
    setMostrarCrearEjercicio(false);
    setGrupoSeleccionado("Todos");
    setBusqueda("");
    setEjercicioSeleccionado(null);
  }

  function eliminarEjercicioPersonalizado(ejercicioId: string) {
    const ejercicio = ejerciciosPersonalizados.find((item) => item.id === ejercicioId);
    if (!ejercicio) return;

    const confirmar = window.confirm(
      `Seguro que queres eliminar "${ejercicio.nombre}"? Tambien se va a sacar de tus rutinas.`
    );

    if (!confirmar) return;

    setEjerciciosPersonalizados((actuales) =>
      actuales.filter((item) => item.id !== ejercicioId)
    );
    setFavoritos((actuales) => actuales.filter((id) => id !== ejercicioId));
    rutinas.forEach((rutina) => eliminarEjercicioDeRutina(rutina.id, ejercicioId));
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
        <div className="app-header">
          <div className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">
              <strong>FIT<span>APP</span></strong>
              <small>Entrena tu mejor version</small>
            </span>
          </div>

          <button className="perfil-avatar perfil-avatar-sidebar" type="button" onClick={irAPerfil} aria-label="Abrir perfil">
            <span>👤</span>
          </button>
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
            {rutinaEnProgreso && !rutinaPausada
              ? `Haciendo: ${rutinaEnProgreso.nombre}`
              : pantalla === "inicio"
              ? "Inicio"
              : pantalla === "ejercicios"
              ? "Ejercicios"
              : pantalla === "rutinas"
              ? "Mis rutinas"
              : pantalla === "perfil"
              ? "Mi perfil"
              : ""}
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
          <button className="perfil-avatar perfil-avatar-topbar" type="button" onClick={irAPerfil} aria-label="Abrir perfil">
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
                <DetalleEjercicio
                  ejercicio={ejercicioSeleccionado}
                  esPersonalizado={ejercicioSeleccionado.id.startsWith("custom-")}
                  onEliminarPersonalizado={eliminarEjercicioPersonalizado}
                />
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
                <button
                  type="button"
                  className="boton-filtros-toggle"
                  aria-expanded={mostrarFiltros}
                  aria-controls="filtros-avanzados"
                  onClick={() => setMostrarFiltros((visible) => !visible)}
                >
                  {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
                </button>
                <button
                  type="button"
                  className="boton-primario boton-crear-ejercicio"
                  onClick={() => setMostrarCrearEjercicio((visible) => !visible)}
                >
                  {mostrarCrearEjercicio ? "Cancelar" : "Crear ejercicio"}
                </button>
              </div>

              {mostrarCrearEjercicio && (
                <form
                  className="crear-ejercicio-form"
                  onSubmit={guardarEjercicioPersonalizado}
                >
                  <label>
                    <span>Nombre</span>
                    <input
                      type="text"
                      placeholder="Ej: Press inclinado en maquina"
                      value={nuevoEjercicio.nombre}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          nombre: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    <span>Grupo muscular</span>
                    <select
                      value={nuevoEjercicio.grupoMuscular}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          grupoMuscular: event.target.value,
                        }))
                      }
                    >
                      {GRUPOS_PERSONALIZADOS.map((grupo) => (
                        <option key={grupo} value={grupo}>
                          {grupo}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Musculo principal</span>
                    <select
                      value={nuevoEjercicio.musculoPrincipal}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          musculoPrincipal: event.target.value as RegionMuscular,
                        }))
                      }
                    >
                      {REGIONES_MUSCULARES.map((region) => (
                        <option key={region.valor} value={region.valor}>
                          {region.etiqueta}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Dificultad</span>
                    <select
                      value={nuevoEjercicio.dificultad}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          dificultad: event.target.value as Ejercicio["dificultad"],
                        }))
                      }
                    >
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                  </label>

                  <label>
                    <span>Equipamiento</span>
                    <input
                      type="text"
                      placeholder="Mancuernas, banco, polea"
                      value={nuevoEjercicio.equipamiento}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          equipamiento: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    <span>Video de YouTube</span>
                    <input
                      type="text"
                      placeholder="URL o ID del video"
                      value={nuevoEjercicio.youtubeId}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          youtubeId: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="crear-ejercicio-foto">
                    <span>Foto personalizada</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        cargarFotoPersonalizada(event.target.files?.[0])
                      }
                    />
                    {nuevoEjercicio.imagen ? (
                      <img
                        src={nuevoEjercicio.imagen}
                        alt="Vista previa del ejercicio"
                      />
                    ) : null}
                  </label>

                  <label className="crear-ejercicio-descripcion">
                    <span>Descripcion</span>
                    <textarea
                      placeholder="Notas rapidas de tecnica o enfoque"
                      value={nuevoEjercicio.descripcion}
                      onChange={(event) =>
                        setNuevoEjercicio((actual) => ({
                          ...actual,
                          descripcion: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <div className="crear-ejercicio-acciones">
                    <button type="submit" className="boton-primario">
                      Guardar ejercicio
                    </button>
                  </div>
                </form>
              )}

              <div
                id="filtros-avanzados"
                className={`filtros-avanzadas ${mostrarFiltros ? "visible" : "oculto"}`}
              >
                <label>
                  <span>Grupo muscular</span>
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
                  <span>Dificultad</span>
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
                  <span>Equipamiento</span>
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

                <div className="filtros-footer">
                  <div className="filtros-checkboxes">
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

                    <label className="filtro-toggle">
                      <input
                        type="checkbox"
                        checked={soloCreadosPorMi}
                        onChange={(event) =>
                          setSoloCreadosPorMi(event.target.checked)
                        }
                      />
                      Creados por mi
                    </label>
                  </div>

                  <button
                    type="button"
                    className="boton-secundario boton-borrar-filtros"
                    onClick={limpiarFiltros}
                  >
                    Borrar filtros
                  </button>
                </div>
              </div>
            </div>

            <div className="panel resumen-filtro">
              <p>
                {ejerciciosVisibles.length} ejercicios encontrados
                {soloConVideo ? " (solo con video)" : ""}
                {soloFavoritos ? " (favoritos)" : ""}
                {soloCreadosPorMi ? " (creados por mi)" : ""}
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
