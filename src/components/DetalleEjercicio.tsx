import type { Ejercicio } from "../types/ejercicio";
import MapaMuscular from "./MapaMuscular";

type Props = {
  ejercicio: Ejercicio;
  esPersonalizado?: boolean;
  onEliminarPersonalizado?: (ejercicioId: string) => void;
};

function DetalleEjercicio({
  ejercicio,
  esPersonalizado = false,
  onEliminarPersonalizado,
}: Props) {
  return (
    <section className="detalle">
      <div className="detalle-header">
        <div>
          <div className="detalle-meta">
            <span className="tag">{ejercicio.grupoMuscular}</span>
            <span className="detalle-chip">{ejercicio.dificultad}</span>
            {ejercicio.tipoEjercicio && (
              <span className="detalle-chip">{ejercicio.tipoEjercicio}</span>
            )}
            {ejercicio.objetivo && (
              <span className="detalle-chip">{ejercicio.objetivo}</span>
            )}
          </div>
          <h2>{ejercicio.nombre}</h2>
          <p>{ejercicio.descripcion}</p>

          {ejercicio.equipamiento?.length ? (
            <p className="detalle-equipo">
              <strong>Equipamiento:</strong> {ejercicio.equipamiento.join(", ")}
            </p>
          ) : null}

          {ejercicio.urlFuente ? (
            <p>
              <a
                href={ejercicio.urlFuente}
                target="_blank"
                rel="noreferrer"
                className="detalle-enlace"
              >
                Ver fuente del ejercicio
              </a>
            </p>
          ) : null}

          {esPersonalizado && onEliminarPersonalizado ? (
            <button
              type="button"
              className="boton-secundario eliminar detalle-eliminar"
              onClick={() => onEliminarPersonalizado(ejercicio.id)}
            >
              Eliminar ejercicio
            </button>
          ) : null}
        </div>
      </div>

      <div className="detalle-grid">
        <div className="panel">
          <h3>Video tutorial</h3>

          {ejercicio.youtubeId ? (
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ejercicio.youtubeId}`}
                title={`Video tutorial de ${ejercicio.nombre}`}
                allowFullScreen
              />
            </div>
          ) : (
            <div className="video-placeholder">
              <p>Video próximamente</p>
            </div>
          )}
        </div>

        <div className="panel">
          <MapaMuscular mapaDeEnfoque={ejercicio.mapaDeEnfoque} />
        </div>
      </div>

      <div className="detalle-grid">
        <div className="panel">
          <h3>Checklist de técnica</h3>

          <ul className="lista-check">
            {ejercicio.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Errores comunes</h3>

          <ul className="lista-error">
            {ejercicio.erroresComunes.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DetalleEjercicio;
