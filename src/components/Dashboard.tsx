import React from "react";
import { ejercicios } from "../data/ejercicios";
import { useRutinas } from "../hooks/useRutinas";
import { useHistorial } from "../hooks/useHistorial";
import { usePerfil } from "../hooks/usePerfil";
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

function Dashboard({ irAEjercicios, irARutinas, onEmpezar }: Props) {
  const { rutinas } = useRutinas();
  const { historial } = useHistorial();
  const { perfil } = usePerfil();

  const distribucionMuscular = React.useMemo(() => {
    const contador: Record<string, number> = {};
    
    // Contar ejercicios por grupo muscular desde historial
    for (const entrenamiento of historial) {
      for (const ejercicioRef of entrenamiento.ejercicios) {
        const ej = ejercicios.find((e) => e.id === ejercicioRef.ejercicioId);
        if (!ej) continue;
        contador[ej.grupoMuscular] = (contador[ej.grupoMuscular] ?? 0) + 1;
      }
    }

    // Retornar top 6 ordenados por frecuencia
    return Object.entries(contador)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([grupo]) => grupo);
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

  const mesCompletados = React.useMemo(() => {
    if (!historial) return 0;
    const ahora = new Date();
    return historial.filter((h) => {
      const f = new Date(h.fechaISO);
      return f.getFullYear() === ahora.getFullYear() && f.getMonth() === ahora.getMonth();
    }).length;
  }, [historial]);

  const mesObjetivo = perfil.objetivoMensual;

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
                  if (!proximaRutina || proximaRutina.ejercicios.length === 0) {
                    alert("Crea una rutina primero.");
                    irARutinas();
                    return;
                  }
                  onEmpezar(proximaRutina);
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
            <div className="progress-fill" style={{ width: `${(entrenamientosSemana/objetivoSemana)*100}%` }} />
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
              {ultEntrenos.map((e: any) => (
                <li key={e.nombre}>
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
            <div className="progress-fill" style={{ width: `${(mesCompletados/mesObjetivo)*100}%` }} />
          </div>
        </div>

        <div className="card panel">
          <h4>Distribución muscular</h4>
          <div className="muscle-chips">
            {distribucionMuscular.length === 0 ? (
              <p className="muted">Completa entrenamientos para ver distribución</p>
            ) : (
              distribucionMuscular.map((grupo) => (
                <span key={grupo} className="chip">{grupo}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
