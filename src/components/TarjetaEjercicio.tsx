import type { Ejercicio } from "../types/ejercicio";

type Props = {
  ejercicio: Ejercicio;
};

function TarjetaEjercicio({ ejercicio }: Props) {
  return (
    <article className="tarjeta-ejercicio tarjeta-horizontal">
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
        <img src={ejercicio.imagen} alt={ejercicio.nombre} />
      </div>
    </article>
  );
}

export default TarjetaEjercicio;