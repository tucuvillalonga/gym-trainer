import type { Ejercicio } from "../types/ejercicio";

type Props = {
  ejercicio: Ejercicio;
  favorito: boolean;
  onToggleFavorito: (id: string) => void;
};

function TarjetaEjercicio({ ejercicio, favorito, onToggleFavorito }: Props) {
  return (
    <article className="tarjeta-ejercicio tarjeta-horizontal">
      <button
        type="button"
        className="boton-favorito"
        aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorito(ejercicio.id);
        }}
      >
        {favorito ? "♥" : "♡"}
      </button>

      <div className="tarjeta-contenido">
        <div className="tag">{ejercicio.grupoMuscular}</div>

        <h2>{ejercicio.nombre}</h2>

        <p className="descripcion">{ejercicio.descripcion}</p>

        <div className="fila-info">
          <span>Dificultad</span>
          <strong>{ejercicio.dificultad}</strong>
        </div>
      </div>

      <div className="imagen-ejercicio-lateral">
        <img src={ejercicio.imagen} alt={ejercicio.nombre} loading="lazy" />
      </div>
    </article>
  );
}

export default TarjetaEjercicio;