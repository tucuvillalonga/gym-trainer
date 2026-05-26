import React from "react";
import { ejercicios } from "../data/ejercicios";
import { useRutinas } from "../hooks/useRutinas";
import { useHistorial } from "../hooks/useHistorial";
import { usePerfil } from "../hooks/usePerfil";
import MapaMuscular from "./MapaMuscular";
import type { NivelMuscular, RegionMuscular } from "../types/ejercicio";
import type { Rutina } from "../types/rutina";

type DiaSemana =
  | "domingo"
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado";

type Props = {
  irAEjercicios: () => void;
  irARutinas: () => void;
  onEmpezar: (rutina: Rutina) => void;
};

const DIAS_SEMANA: DiaSemana[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const PUNTAJE_NIVEL: Record<NivelMuscular, number> = {
  principal: 3,
  secundario: 2,
  indirecto: 1,
};

const COLORES_CARGA = {
  sinCarga: "#253044",
  muyBaja: "#facc15",
  baja: "#f59e0b",
  mediaBaja: "#f97316",
  media: "#ea580c",
  mediaAlta: "#ef4444",
  alta: "#dc2626",
  maxima: "#b91c1c",
};

const GRUPOS_DESCANSO: {
  id: string;
  nombre: string;
  regiones: RegionMuscular[];
  descansoMaximo: number;
}[] = [
  {
    id: "espalda",
    nombre: "Espalda",
    regiones: ["dorsales", "espaldaAlta", "espaldaMedia", "trapecios", "espaldaBaja"],
    descansoMaximo: 2,
  },
  {
    id: "pecho",
    nombre: "Pecho",
    regiones: ["pectoral"],
    descansoMaximo: 2,
  },
  {
    id: "brazos-hombros",
    nombre: "Brazos y hombros",
    regiones: ["deltoides", "biceps", "triceps", "antebrazos"],
    descansoMaximo: 1,
  },
  {
    id: "piernas",
    nombre: "Piernas",
    regiones: ["cuadriceps", "isquiotibiales", "gluteos", "pantorrillas"],
    descansoMaximo: 2,
  },
  {
    id: "core",
    nombre: "Core",
    regiones: ["abdominales", "oblicuos"],
    descansoMaximo: 1,
  },
];

function calcularProgreso(completados: number, objetivo: number) {
  if (objetivo <= 0) return 0;
  return Math.min(100, (completados / objetivo) * 100);
}

function obtenerColorCarga(valor: number, maximo: number) {
  if (valor <= 0 || maximo <= 0) return COLORES_CARGA.sinCarga;

  const intensidad = valor / maximo;
  if (intensidad < 0.17) return COLORES_CARGA.muyBaja;
  if (intensidad < 0.34) return COLORES_CARGA.baja;
  if (intensidad < 0.5) return COLORES_CARGA.mediaBaja;
  if (intensidad < 0.67) return COLORES_CARGA.media;
  if (intensidad < 0.84) return COLORES_CARGA.mediaAlta;
  if (intensidad < 1) return COLORES_CARGA.alta;
  return COLORES_CARGA.maxima;
}

function calcularDiasDescanso(
  puntosSemana: number,
  cargaUltimaSesion: number,
  descansoMaximo: number
) {
  if (descansoMaximo <= 1) {
    return puntosSemana >= 4 || cargaUltimaSesion >= 3 ? 1 : 0;
  }

  if (puntosSemana >= 9 || cargaUltimaSesion >= 5) return 2;
  if (puntosSemana >= 4 || cargaUltimaSesion >= 3) return 1;
  return 0;
}

function Dashboard({ irAEjercicios, irARutinas, onEmpezar }: Props) {
  const { rutinas } = useRutinas();
  const { historial } = useHistorial();
  const { perfil } = usePerfil();

  const distribucionMuscular = React.useMemo(() => {
    const contador: Partial<Record<RegionMuscular, number>> = {};
    const ultimaCarga: Partial<
      Record<
        RegionMuscular,
        {
          fechaISO: string;
          puntosSesion: number;
        }
      >
    > = {};
    const desde = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const entrenamientosRecientes = historial.filter(
      (entrenamiento) => new Date(entrenamiento.fechaISO).getTime() >= desde
    );

    for (const entrenamiento of entrenamientosRecientes) {
      const puntosSesion: Partial<Record<RegionMuscular, number>> = {};

      for (const ejercicioRef of entrenamiento.ejercicios) {
        const ejercicio = ejercicios.find((item) => item.id === ejercicioRef.ejercicioId);
        if (!ejercicio) continue;

        if (ejercicio.mapaDeEnfoque.length === 0) {
          puntosSesion[ejercicio.musculoPrincipal] =
            (puntosSesion[ejercicio.musculoPrincipal] ?? 0) + PUNTAJE_NIVEL.principal;
          continue;
        }

        for (const foco of ejercicio.mapaDeEnfoque) {
          puntosSesion[foco.region] =
            (puntosSesion[foco.region] ?? 0) + PUNTAJE_NIVEL[foco.nivel];
        }
      }

      const fechaEntrenamiento = new Date(entrenamiento.fechaISO).getTime();

      for (const [region, puntos] of Object.entries(puntosSesion) as [RegionMuscular, number][]) {
        contador[region] = (contador[region] ?? 0) + puntos;

        const cargaAnterior = ultimaCarga[region];
        if (
          !cargaAnterior ||
          fechaEntrenamiento > new Date(cargaAnterior.fechaISO).getTime()
        ) {
          ultimaCarga[region] = {
            fechaISO: entrenamiento.fechaISO,
            puntosSesion: puntos,
          };
        }
      }
    }

    const maximo = Math.max(0, ...Object.values(contador));
    const colorPorRegion: Partial<Record<RegionMuscular, string>> = {};
    const etiquetaPorRegion: Partial<Record<RegionMuscular, string>> = {};

    for (const [region, valor] of Object.entries(contador) as [RegionMuscular, number][]) {
      colorPorRegion[region] = obtenerColorCarga(valor, maximo);
      etiquetaPorRegion[region] = `${valor} pts esta semana`;
    }

    const recomendacionesDescanso = GRUPOS_DESCANSO.map((grupo) => {
        const puntosSemana = Math.max(
          0,
          ...grupo.regiones.map((region) => contador[region] ?? 0)
        );
        const ultima = grupo.regiones
          .map((region) => ultimaCarga[region])
          .filter((item): item is { fechaISO: string; puntosSesion: number } => Boolean(item))
          .sort(
            (a, b) =>
              new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime()
          )[0];
        const ultimaFecha = ultima ? new Date(ultima.fechaISO) : null;
        const cargaUltimaSesion = Math.max(
          0,
          ...grupo.regiones.map((region) => {
            const carga = ultimaCarga[region];
            return carga && carga.fechaISO === ultima?.fechaISO
              ? carga.puntosSesion
              : 0;
          })
        );
        const diasDesdeUltima = ultimaFecha
          ? Math.floor((Date.now() - ultimaFecha.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        const diasRecomendados = calcularDiasDescanso(
          puntosSemana,
          cargaUltimaSesion,
          grupo.descansoMaximo
        );
        const diasRestantes = Math.max(0, diasRecomendados - diasDesdeUltima);

        return {
          id: grupo.id,
          nombre: grupo.nombre,
          puntosSemana,
          diasRestantes,
          texto:
            diasRestantes === 0
              ? "Listo para volver a entrenar"
              : `Descansar ${diasRestantes} dia${diasRestantes === 1 ? "" : "s"} mas`,
        };
      })
      .filter((grupo) => grupo.puntosSemana > 0)
      .sort((a, b) => b.diasRestantes - a.diasRestantes || b.puntosSemana - a.puntosSemana)
      .slice(0, 5);

    return {
      colorPorRegion,
      etiquetaPorRegion,
      recomendacionesDescanso,
      tieneDatos: entrenamientosRecientes.length > 0,
    };
  }, [historial]);

  const racha = React.useMemo(() => {
    if (!historial || historial.length === 0) return 0;
    // compute consecutive days with activity starting from today
    const dias = new Set(historial.map((h) => new Date(h.fechaISO).toDateString()));
    let count = 0;
    let cursor = new Date();
    while (dias.has(cursor.toDateString())) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [historial]);

  const entrenamientosSemana = React.useMemo(() => {
    if (!historial) return 0;
    const desde = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return historial.filter((h) => new Date(h.fechaISO).getTime() >= desde).length;
  }, [historial]);

  const objetivoSemana = perfil.objetivoSemanal;
  const progresoSemana = calcularProgreso(entrenamientosSemana, objetivoSemana);

  const mesCompletados = React.useMemo(() => {
    if (!historial) return 0;
    const ahora = new Date();
    return historial.filter((h) => {
      const f = new Date(h.fechaISO);
      return f.getFullYear() === ahora.getFullYear() && f.getMonth() === ahora.getMonth();
    }).length;
  }, [historial]);

  const mesObjetivo = perfil.objetivoMensual;
  const progresoMes = calcularProgreso(mesCompletados, mesObjetivo);

  const ultEntrenos = React.useMemo(() => {
    if (!historial || historial.length === 0) {
      return [];
    }

    return historial.slice(0, 6).map((h) => {
      const fecha = new Date(h.fechaISO);
      const diffMs = Date.now() - fecha.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return { nombre: h.nombre, cuando: diffDays === 0 ? "hoy" : `hace ${diffDays} días` };
    });
  }, [historial]);

  const proximaRutina = React.useMemo(() => {
    const hoy = DIAS_SEMANA[new Date().getDay()];
    const rutinaIdHoy = perfil.planSemanal[hoy];
    const rutinaHoy = rutinas.find((rutina) => rutina.id === rutinaIdHoy);

    if (rutinaHoy) {
      return rutinaHoy;
    }

    // Encuentra la próxima rutina programada en los siguientes días.
    const hoyIndex = DIAS_SEMANA.indexOf(hoy);
    for (let desplazamiento = 1; desplazamiento < 7; desplazamiento += 1) {
      const indice = (hoyIndex + desplazamiento) % 7;
      const diaSiguiente = DIAS_SEMANA[indice];
      const rutId = perfil.planSemanal[diaSiguiente];
      const rutina = rutinas.find((item) => item.id === rutId);
      if (rutina) {
        return rutina;
      }
    }

    return rutinas[0] ?? { id: "demo", nombre: "Push 1", ejercicios: [] };
  }, [perfil.planSemanal, rutinas]);

  return (
    <div className="dashboard">
      <div className="hero-card panel">
        <div className="hero-text">
          <h1>Buenas, {perfil.nombre} 👋</h1>
          <p className="sub">Listo para entrenar hoy?</p>
        </div>

        <div className="hero-actions">
          <button className="boton-secundario" onClick={irAEjercicios}>Ver ejercicios</button>
          <button className="boton-secundario" onClick={irARutinas}>Mis rutinas</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-large panel">
          <h3>Próxima rutina</h3>
          <div className="proxima-body">
            <div>
              <strong>{proximaRutina.nombre} · {proximaRutina.ejercicios?.length ?? 0} ejercicios</strong>
              <p className="muted">Sugerida / última creada</p>
            </div>
            <div>
              <button
                className="boton-secundario"
                onClick={() => {
                  if (!proximaRutina || !proximaRutina.ejercicios || proximaRutina.ejercicios.length === 0) {
                    alert("Crea una rutina primero.");
                    irARutinas();
                    return;
                  }

                  // adicional: confirmar que onEmpezar existe
                  try {
                    onEmpezar(proximaRutina);
                  } catch (e) {
                    console.error("onEmpezar fallo:", e);
                    alert("No se pudo iniciar la rutina.");
                  }
                }}
              >
                Empezar
              </button>
            </div>
          </div>
        </div>

        <div className="card panel">
          <h4>Resumen semanal</h4>
          <p className="muted">{entrenamientosSemana}/{objetivoSemana} entrenamientos</p>
          <div className="progress">
            <div className="progress-fill" style={{ width: `${progresoSemana}%` }} />
          </div>
        </div>

        <div className="card panel">
          <h4>Racha</h4>
          <div className="racha">
            <div className="fire">🔥</div>
            <div>
              <strong>{racha} días</strong>
              <p className="muted">Racha actual</p>
            </div>
          </div>
        </div>

        <div className="card panel">
          <h4>Últimos entrenamientos</h4>
          {ultEntrenos.length === 0 ? (
            <p>Todavía no completaste entrenamientos.</p>
          ) : (
            <ul className="ultimos-lista">
              {ultEntrenos.map((e: any, index) => (
                <li key={`${e.nombre}-${index}`}>
                  <strong>{e.nombre}</strong>
                  <span className="muted">{e.cuando}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card panel">
          <h4>Objetivo mensual</h4>
          <p className="muted">{mesCompletados}/{mesObjetivo} entrenamientos</p>
          <div className="progress">
            <div className="progress-fill" style={{ width: `${progresoMes}%` }} />
          </div>
        </div>

        <div className="card card-large panel distribucion-muscular-card">
          <div className="distribucion-muscular">
            <MapaMuscular
              titulo="Carga muscular semanal"
              mapaDeEnfoque={[]}
              colorPorRegion={distribucionMuscular.colorPorRegion}
              etiquetaPorRegion={distribucionMuscular.etiquetaPorRegion}
              leyenda={[
                { etiqueta: "Muy baja", color: COLORES_CARGA.muyBaja },
                { etiqueta: "Baja", color: COLORES_CARGA.baja },
                { etiqueta: "Media", color: COLORES_CARGA.media },
                { etiqueta: "Alta", color: COLORES_CARGA.alta },
                { etiqueta: "Maxima", color: COLORES_CARGA.maxima },
              ]}
            />
            {!distribucionMuscular.tieneDatos && (
              <p className="muted">Completa entrenamientos para ver la carga semanal.</p>
            )}
            {distribucionMuscular.recomendacionesDescanso.length > 0 && (
              <div className="descanso-muscular">
                <h4>Descanso recomendado</h4>
                <div className="descanso-lista">
                  {distribucionMuscular.recomendacionesDescanso.map((item) => (
                    <div key={item.id} className="descanso-item">
                      <div>
                        <strong>{item.nombre}</strong>
                        <span>{item.puntosSemana} pts esta semana</span>
                      </div>
                      <p className={item.diasRestantes === 0 ? "listo" : ""}>
                        {item.texto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
