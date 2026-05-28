import { useState } from "react";
import { usePerfil, type PreferenciasPerfil } from "../hooks/usePerfil";

type Props = {
  onFinish: () => void;
};

const equipamientos = [
  "Mancuernas",
  "Barra",
  "Poleas",
  "Maquinas",
  "Banco",
  "Peso corporal",
];

function Onboarding({ onFinish }: Props) {
  const { perfil, setPerfil } = usePerfil();
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState<PreferenciasPerfil>({
    ...perfil,
    nombre: perfil.nombre || "",
    objetivoSemanal: perfil.objetivoSemanal || 4,
    objetivoMensual: perfil.objetivoMensual || 16,
    tiempoEntrenamiento: perfil.tiempoEntrenamiento || 60,
    nivelExperiencia: perfil.nivelExperiencia || "intermedio",
    objetivoPrincipal: perfil.objetivoPrincipal || "hipertrofia",
    equipamientoDisponible: perfil.equipamientoDisponible || [],
  });

  const totalPasos = 6;

  function actualizar(cambios: Partial<PreferenciasPerfil>) {
    setForm((actual) => ({ ...actual, ...cambios }));
  }

  function toggleEquipo(equipo: string) {
    const actuales = form.equipamientoDisponible ?? [];
    actualizar({
      equipamientoDisponible: actuales.includes(equipo)
        ? actuales.filter((item) => item !== equipo)
        : [...actuales, equipo],
    });
  }

  function terminar(cambios: Partial<PreferenciasPerfil> = {}) {
    const perfilFinal = {
      ...form,
      ...cambios,
      objetivoMensual: Math.max(
        form.objetivoSemanal * 4,
        cambios.objetivoMensual ?? form.objetivoMensual
      ),
      onboardingCompletado: true,
    };

    setPerfil(perfilFinal);
    onFinish();
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-card panel">
        <div className="onboarding-top">
          <div className="logo onboarding-logo">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">
              <strong>FIT<span>APP</span></strong>
              <small>Entrena tu mejor version</small>
            </span>
          </div>
          <span className="onboarding-paso">
            {paso + 1}/{totalPasos}
          </span>
        </div>

        <div className="onboarding-progress">
          <span style={{ width: `${((paso + 1) / totalPasos) * 100}%` }} />
        </div>

        {paso === 0 && (
          <div className="onboarding-step">
            <h1>Armemos tu perfil</h1>
            <p>Con unas preguntas cortas la app puede ajustar objetivos, tiempo y recomendaciones.</p>
            <label>
              Nombre
              <input
                type="text"
                placeholder="Ej: Tucu"
                value={form.nombre}
                onChange={(event) => actualizar({ nombre: event.target.value })}
              />
            </label>
          </div>
        )}

        {paso === 1 && (
          <div className="onboarding-step">
            <h1>Objetivo principal</h1>
            <div className="onboarding-opciones">
              {[
                ["hipertrofia", "Ganar musculo"],
                ["fuerza", "Ganar fuerza"],
                ["bajar-grasa", "Bajar grasa"],
                ["salud", "Salud general"],
              ].map(([valor, texto]) => (
                <button
                  key={valor}
                  type="button"
                  className={form.objetivoPrincipal === valor ? "activo" : ""}
                  onClick={() =>
                    actualizar({
                      objetivoPrincipal: valor as PreferenciasPerfil["objetivoPrincipal"],
                    })
                  }
                >
                  {texto}
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="onboarding-step">
            <h1>Tu nivel</h1>
            <div className="onboarding-opciones">
              {[
                ["principiante", "Principiante"],
                ["intermedio", "Intermedio"],
                ["avanzado", "Avanzado"],
              ].map(([valor, texto]) => (
                <button
                  key={valor}
                  type="button"
                  className={form.nivelExperiencia === valor ? "activo" : ""}
                  onClick={() =>
                    actualizar({
                      nivelExperiencia: valor as PreferenciasPerfil["nivelExperiencia"],
                    })
                  }
                >
                  {texto}
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="onboarding-step">
            <h1>Frecuencia</h1>
            <label>
              Cuantos dias queres entrenar por semana
              <input
                type="number"
                min="1"
                max="7"
                value={form.objetivoSemanal}
                onChange={(event) =>
                  actualizar({
                    objetivoSemanal: Number(event.target.value),
                    objetivoMensual: Number(event.target.value) * 4,
                  })
                }
              />
            </label>
            <label>
              Duracion por entrenamiento
              <select
                value={form.tiempoEntrenamiento}
                onChange={(event) =>
                  actualizar({ tiempoEntrenamiento: Number(event.target.value) })
                }
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos</option>
                <option value={75}>75 minutos</option>
                <option value={90}>90 minutos</option>
              </select>
            </label>
          </div>
        )}

        {paso === 4 && (
          <div className="onboarding-step">
            <h1>Equipamiento</h1>
            <div className="onboarding-opciones">
              {equipamientos.map((equipo) => (
                <button
                  key={equipo}
                  type="button"
                  className={
                    form.equipamientoDisponible?.includes(equipo) ? "activo" : ""
                  }
                  onClick={() => toggleEquipo(equipo)}
                >
                  {equipo}
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === 5 && (
          <div className="onboarding-step">
            <h1>Listo</h1>
            <p>
              Tu perfil queda preparado para objetivos semanales, rutina de hoy y recomendaciones.
            </p>
            <div className="onboarding-resumen">
              <span>{form.objetivoSemanal} dias por semana</span>
              <span>{form.tiempoEntrenamiento} minutos</span>
              <span>{form.nivelExperiencia}</span>
            </div>
          </div>
        )}

        <div className="onboarding-actions">
          {paso > 0 && (
            <button
              type="button"
              className="boton-secundario"
              onClick={() => setPaso((actual) => actual - 1)}
            >
              Atras
            </button>
          )}
          <button
            type="button"
            className="boton-primario"
            onClick={() => (paso === totalPasos - 1 ? terminar() : setPaso((actual) => actual + 1))}
          >
            {paso === totalPasos - 1 ? "Entrar a la app" : "Continuar"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Onboarding;
