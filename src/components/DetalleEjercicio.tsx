import type { Ejercicio } from "../types/ejercicio";
import MapaMuscular from "./MapaMuscular";

type Props = {
  ejercicio: Ejercicio;
};

function DetalleEjercicio({ ejercicio }: Props) {
  return (
    <section className="detalle">
      <div className="detalle-header">
        <div>
          <span className="tag">{ejercicio.grupoMuscular}</span>

          <h2>{ejercicio.nombre}</h2>

          <p>{ejercicio.descripcion}</p>
        </div>
      </div>

      <div className="detalle-grid">
        <div className="panel">
          <h3>Video tutorial</h3>

          {ejercicio.youtubeId ? (
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${ejercicio.youtubeId}`}
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