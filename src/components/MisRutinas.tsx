import { useMemo, useState } from "react";
import { ejercicios } from "../data/ejercicios";
import { useRutinas } from "../hooks/useRutinas";
import type { EjercicioRutina, Rutina } from "../types/rutina";
import type { Ejercicio, RegionMuscular } from "../types/ejercicio";
import {
  guardarEjerciciosPersonalizados,
  obtenerEjerciciosPersonalizados,
} from "../utils/ejerciciosPersonalizados";

type Props = {
  onEmpezar: (rutina: Rutina) => void;
};

type EjercicioImportado = {
  nombre: string;
  series: number;
  repeticiones: number;
  peso: number;
  ejercicioId?: string;
  creadoAutomatico: boolean;
};

type RutinaImportada = {
  nombre: string;
  ejercicios: EjercicioImportado[];
};

function normalizarTexto(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function limpiarNombreImportado(nombre: string) {
  const limpio = nombre.trim();
  const celdas = separarCsv(limpio);

  if (celdas.length > 1 && /\d+\s*x\s*\d+/i.test(celdas[1] ?? "")) {
    return celdas[0].trim();
  }

  return limpio
    .replace(/,\s*\d+\s*x\s*\d+.*$/i, "")
    .replace(/\s+\d+\s*x\s*\d+.*$/i, "")
    .replace(/[-,:]+$/g, "")
    .trim();
}

function crearIdPersonalizado(nombre: string) {
  const base = normalizarTexto(limpiarNombreImportado(nombre))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `custom-${base || "ejercicio"}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function clasificarGrupo(nombre: string): {
  grupoMuscular: string;
  musculoPrincipal: RegionMuscular;
} {
  const texto = normalizarTexto(limpiarNombreImportado(nombre));

  if (texto.includes("pecho") || texto.includes("banca") || texto.includes("press")) {
    return { grupoMuscular: "Pecho", musculoPrincipal: "pectoral" };
  }
  if (texto.includes("remo") || texto.includes("jalon") || texto.includes("dominada") || texto.includes("pull")) {
    return { grupoMuscular: "Espalda", musculoPrincipal: "dorsales" };
  }
  if (texto.includes("hombro") || texto.includes("lateral") || texto.includes("militar")) {
    return { grupoMuscular: "Hombros", musculoPrincipal: "deltoides" };
  }
  if (texto.includes("biceps") || texto.includes("bicep") || texto.includes("curl")) {
    return { grupoMuscular: "Biceps", musculoPrincipal: "biceps" };
  }
  if (texto.includes("triceps") || texto.includes("extension")) {
    return { grupoMuscular: "Triceps", musculoPrincipal: "triceps" };
  }
  if (texto.includes("sentadilla") || texto.includes("prensa") || texto.includes("pierna") || texto.includes("cuadriceps")) {
    return { grupoMuscular: "Piernas", musculoPrincipal: "cuadriceps" };
  }
  if (texto.includes("peso muerto") || texto.includes("femoral")) {
    return { grupoMuscular: "Piernas", musculoPrincipal: "isquiotibiales" };
  }
  if (texto.includes("gemelo") || texto.includes("pantorrilla")) {
    return { grupoMuscular: "Piernas", musculoPrincipal: "pantorrillas" };
  }
  if (texto.includes("ab") || texto.includes("crunch") || texto.includes("plancha")) {
    return { grupoMuscular: "Core", musculoPrincipal: "abdominales" };
  }

  return { grupoMuscular: "Otros", musculoPrincipal: "deltoides" };
}

function extraerDatosEjercicio(linea: string) {
  const limpia = linea.replace(/^[-*•]\s*/, "").trim();
  const match = limpia.match(/(.+?)(?:\s+|,)(\d+)\s*x\s*(\d+)(?:\s+|,)?("?[\d.,]+"?)?\s*(?:kg|kilos)?$/i);

  if (!match) {
    return {
      nombre: limpiarNombreImportado(limpia),
      series: 3,
      repeticiones: 10,
      peso: 0,
    };
  }

  return {
    nombre: limpiarNombreImportado(match[1]),
    series: Number(match[2]),
    repeticiones: Number(match[3]),
    peso: match[4] ? Number(match[4].replace(/"/g, "").replace(",", ".")) : 0,
  };
}

function separarCsv(linea: string) {
  const celdas: string[] = [];
  let actual = "";
  let entreComillas = false;

  for (const caracter of linea) {
    if (caracter === "\"") {
      entreComillas = !entreComillas;
      continue;
    }

    if (caracter === "," && !entreComillas) {
      celdas.push(actual.trim());
      actual = "";
      continue;
    }

    actual += caracter;
  }

  celdas.push(actual.trim());
  return celdas;
}

function parsearReps(valor: string) {
  const match = valor.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return { series: Number(valor) || 3, repeticiones: 10 };

  return {
    series: Number(match[1]),
    repeticiones: Number(match[2]),
  };
}

function parsearPeso(valor: string) {
  return Number(valor.replace(/"/g, "").replace(",", ".")) || 0;
}

function parsearCsv(texto: string) {
  const lineas = texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter((linea) => linea && linea.replace(/,/g, "").trim());

  if (lineas.length < 2 || !lineas.some((linea) => linea.includes(","))) {
    return null;
  }

  const rutinas = new Map<string, EjercicioImportado[]>();
  let rutinaActual = "";

  for (const [index, linea] of lineas.entries()) {
    const celdas = separarCsv(linea);
    const primera = celdas[0] ?? "";
    const segunda = celdas[1] ?? "";
    const tercera = celdas[2] ?? "";
    const segundaNormalizada = normalizarTexto(segunda);
    const terceraNormalizada = normalizarTexto(tercera);

    if (index === 0 && normalizarTexto(primera).includes("rutina")) {
      continue;
    }

    if (
      primera &&
      segundaNormalizada.includes("reps") &&
      terceraNormalizada.includes("kg")
    ) {
      rutinaActual = primera.replace(/:$/g, "").trim();
      if (!rutinas.has(rutinaActual)) {
        rutinas.set(rutinaActual, []);
      }
      continue;
    }

    if (normalizarTexto(primera) === "rutina") {
      continue;
    }

    if (celdas.length >= 5) {
      const [rutina, ejercicio, series, reps, peso] = celdas;
      if (!rutina || !ejercicio) continue;

      rutinas.set(rutina, [
        ...(rutinas.get(rutina) ?? []),
        {
          nombre: limpiarNombreImportado(ejercicio),
          series: Number(series) || 3,
          repeticiones: Number(reps) || 10,
          peso: parsearPeso(peso ?? ""),
          creadoAutomatico: false,
        },
      ]);
      continue;
    }

    if (!rutinaActual || !primera || !segunda) {
      continue;
    }

    const reps = parsearReps(segunda);

    rutinas.set(rutinaActual, [
      ...(rutinas.get(rutinaActual) ?? []),
      {
        nombre: limpiarNombreImportado(primera),
        series: reps.series,
        repeticiones: reps.repeticiones,
        peso: parsearPeso(tercera),
        creadoAutomatico: false,
      },
    ]);
  }

  return Array.from(rutinas.entries())
    .map(([nombre, ejercicios]) => ({ nombre, ejercicios }))
    .filter((rutina) => rutina.ejercicios.length > 0);
}

function parsearRutinasImportadas(texto: string) {
  const csv = parsearCsv(texto);
  if (csv) return csv;

  const lineas = texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);
  const rutinas: RutinaImportada[] = [];
  let actual: RutinaImportada | null = null;

  for (const linea of lineas) {
    const pareceEjercicio = /\d+\s*x\s*\d+/i.test(linea) || /^[-*]/.test(linea);

    if (!actual || !pareceEjercicio) {
      actual = { nombre: linea.replace(/:$/g, ""), ejercicios: [] };
      rutinas.push(actual);
      continue;
    }

    actual.ejercicios.push({
      ...extraerDatosEjercicio(linea),
      creadoAutomatico: false,
    });
  }

  return rutinas.filter((rutina) => rutina.ejercicios.length > 0);
}

function MisRutinas({ onEmpezar }: Props) {
  const {
    rutinas,
    crearRutina,
    crearRutinaConEjercicios,
    eliminarRutina,
    agregarEjercicioARutina,
    actualizarEjercicioDeRutina,
    eliminarEjercicioDeRutina,
    actualizarNombreRutina,
  } = useRutinas();

  const [nombre, setNombre] = useState("");
  const [rutinaActivaId, setRutinaActivaId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [mostrarImportador, setMostrarImportador] = useState(false);
  const [textoImportar, setTextoImportar] = useState("");
  const [rutinasImportadas, setRutinasImportadas] = useState<RutinaImportada[]>([]);
  const [selectorFotoEjercicioId, setSelectorFotoEjercicioId] = useState<string | null>(null);
  const ejerciciosCatalogo = useMemo(
    () => [...ejercicios, ...obtenerEjerciciosPersonalizados()],
    [rutinasImportadas]
  );
  const bibliotecaFotos = useMemo(() => {
    const vistas = new Map<string, { nombre: string; imagen: string }>();

    ejerciciosCatalogo.forEach((ejercicio) => {
      if (!ejercicio.imagen || ejercicio.imagen === "/fitapp-logo.png") return;
      if (!vistas.has(ejercicio.imagen)) {
        vistas.set(ejercicio.imagen, {
          nombre: limpiarNombreImportado(ejercicio.nombre),
          imagen: ejercicio.imagen,
        });
      }
    });

    return Array.from(vistas.values()).slice(0, 60);
  }, [ejerciciosCatalogo]);

  const rutinaActiva = rutinas.find((rutina) => rutina.id === rutinaActivaId);

  function matchearEjercicio(nombreEjercicio: string) {
    const nombreNormalizado = normalizarTexto(limpiarNombreImportado(nombreEjercicio));
    return (
      ejerciciosCatalogo.find(
        (ejercicio) => normalizarTexto(limpiarNombreImportado(ejercicio.nombre)) === nombreNormalizado
      ) ??
      ejerciciosCatalogo.find(
        (ejercicio) =>
          normalizarTexto(limpiarNombreImportado(ejercicio.nombre)).includes(nombreNormalizado) ||
          nombreNormalizado.includes(normalizarTexto(limpiarNombreImportado(ejercicio.nombre)))
      ) ??
      null
    );
  }

  function analizarImportacion(texto = textoImportar) {
    const parseadas = parsearRutinasImportadas(texto).map((rutina) => ({
      ...rutina,
      ejercicios: rutina.ejercicios.map((item) => {
        const match = matchearEjercicio(item.nombre);
        return {
          ...item,
          ejercicioId: match?.id,
          creadoAutomatico: !match,
        };
      }),
    }));

    setRutinasImportadas(parseadas);
  }

  function cargarArchivoImportado(archivo: File | undefined) {
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      const contenido = typeof lector.result === "string" ? lector.result : "";
      setTextoImportar(contenido);
      analizarImportacion(contenido);
    };
    lector.readAsText(archivo);
  }

  function crearEjercicioAutomatico(nombreEjercicio: string): Ejercicio {
    const nombreLimpio = limpiarNombreImportado(nombreEjercicio);
    const clasificacion = clasificarGrupo(nombreLimpio);
    const ejercicio: Ejercicio = {
      id: crearIdPersonalizado(nombreLimpio),
      nombre: nombreLimpio,
      imagen: "/fitapp-logo.png",
      grupoMuscular: clasificacion.grupoMuscular,
      musculoPrincipal: clasificacion.musculoPrincipal,
      dificultad: "Intermedio",
      equipamiento: [],
      objetivo: "Hipertrofia",
      tipoEjercicio: "Compuesto",
      youtubeId: "",
      descripcion: `Ejercicio personalizado importado enfocado en ${clasificacion.grupoMuscular.toLowerCase()}.`,
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
        { region: clasificacion.musculoPrincipal, nivel: "principal" },
      ],
    };

    return ejercicio;
  }

  function copiarEjercicioComoPersonalizado(ejercicio: Ejercicio, imagen: string): Ejercicio {
    return {
      ...ejercicio,
      id: crearIdPersonalizado(ejercicio.nombre),
      nombre: limpiarNombreImportado(ejercicio.nombre),
      imagen,
      urlFuente: undefined,
    };
  }

  function aplicarFotoAEjercicio(rutinaId: string, ejercicio: Ejercicio, imagen: string) {
    const personalizados = obtenerEjerciciosPersonalizados();
    const esPersonalizado = ejercicio.id.startsWith("custom-");

    if (esPersonalizado) {
      const actualizado = personalizados.map((item) =>
        item.id === ejercicio.id ? { ...item, imagen } : item
      );
      guardarEjerciciosPersonalizados(actualizado);
    } else {
      const copia = copiarEjercicioComoPersonalizado(ejercicio, imagen);
      guardarEjerciciosPersonalizados([...personalizados, copia]);
      actualizarEjercicioDeRutina(rutinaId, ejercicio.id, {
        ejercicioId: copia.id,
      });
    }

    setRutinasImportadas((actuales) => [...actuales]);
    setSelectorFotoEjercicioId(null);
  }

  function quitarFotoEjercicio(rutinaId: string, ejercicio: Ejercicio) {
    aplicarFotoAEjercicio(rutinaId, ejercicio, "/fitapp-logo.png");
  }

  function actualizarFotoEjercicio(
    rutinaId: string,
    ejercicio: Ejercicio,
    archivo: File | undefined
  ) {
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      if (typeof lector.result !== "string") return;
      aplicarFotoAEjercicio(rutinaId, ejercicio, lector.result);
    };

    lector.readAsDataURL(archivo);
  }

  function confirmarImportacion() {
    if (rutinasImportadas.length === 0) {
      alert("Pega una rutina o subi un CSV primero.");
      return;
    }

    const personalizados = obtenerEjerciciosPersonalizados();
    const nuevosPersonalizados: Ejercicio[] = [];

    for (const rutina of rutinasImportadas) {
      const ejerciciosRutina: EjercicioRutina[] = rutina.ejercicios.map((item) => {
        let ejercicioId = item.ejercicioId;

        if (!ejercicioId) {
          const existente = [...ejerciciosCatalogo, ...nuevosPersonalizados].find(
            (ejercicio) =>
              normalizarTexto(limpiarNombreImportado(ejercicio.nombre)) ===
              normalizarTexto(limpiarNombreImportado(item.nombre))
          );
          const ejercicioCreado = existente ?? crearEjercicioAutomatico(item.nombre);

          if (!existente) {
            nuevosPersonalizados.push(ejercicioCreado);
          }

          ejercicioId = ejercicioCreado.id;
        }

        return {
          ejercicioId,
          series: item.series,
          repeticiones: item.repeticiones,
          peso: item.peso,
          tipoPeso: "total",
        };
      });

      crearRutinaConEjercicios(rutina.nombre, ejerciciosRutina);
    }

    if (nuevosPersonalizados.length > 0) {
      guardarEjerciciosPersonalizados([...personalizados, ...nuevosPersonalizados]);
    }

    setTextoImportar("");
    setRutinasImportadas([]);
    setMostrarImportador(false);
    alert("Rutinas importadas correctamente.");
  }

  function borrarRutinaActiva() {
    if (!rutinaActiva) {
      return;
    }

    const confirmar = window.confirm(
      `Seguro que queres eliminar "${rutinaActiva.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    eliminarRutina(rutinaActiva.id);
    setRutinaActivaId(null);
    setModoEdicion(false);
    setBusqueda("");
  }

  const ejerciciosDisponibles = ejerciciosCatalogo.filter((ejercicio) => {
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
      <section className="pantalla-rutinas detalle-rutina-activa">
        <button
          className="boton-volver"
          onClick={() => {
            setRutinaActivaId(null);
            setModoEdicion(false);
            setBusqueda("");
          }}
        >
          {"← Volver a mis rutinas"}
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
                }}
              >
                Guardar nombre
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
              if (modoEdicion) {
                setModoEdicion(false);
                setSelectorFotoEjercicioId(null);
                return;
              }

              setNuevoNombre(rutinaActiva.nombre);
              setModoEdicion(true);
            }}
          >
            {modoEdicion ? "Dejar de editar" : "Editar"}
          </button>
          {!modoEdicion && (
            <button
              type="button"
              className="boton-secundario"
              onClick={() => onEmpezar(rutinaActiva)}
            >
              Hacer rutina
            </button>
          )}

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
                <p>Todavia no agregaste ejercicios.</p>
              )}

              {rutinaActiva.ejercicios.map((item) => {
                const ejercicio = ejerciciosCatalogo.find(
                  (ejercicio) => ejercicio.id === item.ejercicioId
                );

                if (!ejercicio) {
                  return null;
                }

                return (
                  <div key={item.ejercicioId} className="rutina-ejercicio-card">
                    <img src={ejercicio.imagen} alt={ejercicio.nombre} />

                    <div className="rutina-ejercicio-info">
                      <h4>{limpiarNombreImportado(ejercicio.nombre)}</h4>
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
                        <div className="rutina-ejercicio-acciones">
                          <label className="boton-secundario boton-foto-ejercicio">
                            Subir foto
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                actualizarFotoEjercicio(
                                  rutinaActiva.id,
                                  ejercicio,
                                  event.target.files?.[0]
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className="boton-secundario"
                            onClick={() =>
                              setSelectorFotoEjercicioId((actual) =>
                                actual === item.ejercicioId ? null : item.ejercicioId
                              )
                            }
                          >
                            Elegir de la biblioteca
                          </button>

                          <button
                            type="button"
                            className="boton-secundario"
                            onClick={() => quitarFotoEjercicio(rutinaActiva.id, ejercicio)}
                          >
                            Quitar foto
                          </button>

                          <button
                            type="button"
                            className="boton-secundario"
                            onClick={() =>
                              eliminarEjercicioDeRutina(rutinaActiva.id, item.ejercicioId)
                            }
                          >
                            Sacar
                          </button>
                        </div>
                      )}

                      {modoEdicion && selectorFotoEjercicioId === item.ejercicioId && (
                        <div className="galeria-fotos-wrapper">
                          <div className="galeria-fotos-ejercicio">
                            {bibliotecaFotos.length === 0 ? (
                              <p>No hay fotos disponibles en la biblioteca.</p>
                            ) : (
                              bibliotecaFotos.map((foto) => (
                                <button
                                  type="button"
                                  key={foto.imagen}
                                  onClick={() =>
                                    aplicarFotoAEjercicio(
                                      rutinaActiva.id,
                                      ejercicio,
                                      foto.imagen
                                    )
                                  }
                                >
                                  <img src={foto.imagen} alt={foto.nombre} />
                                  <span>{foto.nombre}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {modoEdicion && (
            <div>
              <div className="panel panel-agregar-ejercicios">
                <h3>Agregar ejercicios</h3>

                <div className="buscador">
                  <input
                    type="text"
                    placeholder="Buscar por ejercicio o musculo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <div className="lista-agregar-ejercicios">
                  {ejerciciosDisponibles.map((ejercicio) => (
                    <div key={ejercicio.id} className="fila-ejercicio-rutina">
                      <div className="fila-ejercicio-info">
                        <img src={ejercicio.imagen} alt={ejercicio.nombre} />
                        <span>{limpiarNombreImportado(ejercicio.nombre)}</span>
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

      <div className="panel importador-rutinas">
        <div className="importador-header">
          <div>
            <h3>Importar rutina</h3>
            <p>Pega texto de notas o subi un CSV simple.</p>
          </div>
          <button
            type="button"
            className="boton-secundario"
            onClick={() => setMostrarImportador((visible) => !visible)}
          >
            {mostrarImportador ? "Cerrar" : "Importar"}
          </button>
        </div>

        {mostrarImportador && (
          <div className="importador-contenido">
            <textarea
              value={textoImportar}
              placeholder={"Push 1\nPress banca 4x8 60kg\nPress inclinado 3x10\nTriceps polea 3x12"}
              onChange={(event) => {
                setTextoImportar(event.target.value);
                analizarImportacion(event.target.value);
              }}
            />

            <div className="importador-acciones">
              <label className="boton-secundario importador-archivo">
                Subir CSV
                <input
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={(event) =>
                    cargarArchivoImportado(event.target.files?.[0])
                  }
                />
              </label>
              <button
                type="button"
                className="boton-primario"
                onClick={confirmarImportacion}
              >
                Crear rutinas
              </button>
            </div>

            {rutinasImportadas.length > 0 && (
              <div className="importador-preview">
                {rutinasImportadas.map((rutina) => (
                  <div key={rutina.nombre} className="importador-rutina-preview">
                    <h4>{rutina.nombre}</h4>
                    {rutina.ejercicios.map((ejercicio, index) => (
                      <div key={`${ejercicio.nombre}-${index}`} className="importador-ejercicio-preview">
                        <span>
                          {limpiarNombreImportado(ejercicio.nombre)} - {ejercicio.series}x{ejercicio.repeticiones}
                          {ejercicio.peso ? ` - ${ejercicio.peso}kg` : ""}
                        </span>
                        <strong>
                          {ejercicio.creadoAutomatico ? "Se crea nuevo" : "Encontrado"}
                        </strong>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rutinas-grid">
        {rutinas.map((rutina) => (
          <div
            key={rutina.id}
            className="panel rutina-card-clickeable"
            onClick={() => {
              setRutinaActivaId(rutina.id);
              setNuevoNombre(rutina.nombre);
              setModoEdicion(rutina.ejercicios.length === 0);
            }}
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

