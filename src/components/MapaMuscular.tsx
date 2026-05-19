import type { MapaDeEnfoque, RegionMuscular } from "../types/ejercicio";

type Props = {
  mapaDeEnfoque: MapaDeEnfoque[];
};

const coloresPorNivel = {
  principal: "#dc2626",
  secundario: "#f87171",
  indirecto: "#fecaca",
  inactivo: "#e5e7eb",
};

function MapaMuscular({ mapaDeEnfoque }: Props) {
  const obtenerColor = (region: RegionMuscular) => {
    const nivel = mapaDeEnfoque.find((item) => item.region === region)?.nivel;
    return coloresPorNivel[nivel ?? "inactivo"];
  };

  return (
    <section className="mapa-muscular">
      <h3>Mapa muscular</h3>

      <div className="mapa-muscular-layout">

        <div className="mapa-vistas">
  <div>
    <p style={{ textAlign: "center", fontWeight: 700 }}>Vista frontal</p>

    <svg width="220" height="360" viewBox="0 0 320 420">
      <circle cx="160" cy="40" r="28" fill="#fde2b8" />

      <polygon points="135,75 185,75 200,110 120,110" fill={obtenerColor("trapecios")} />

      <path
        d="M120 110 Q160 90 200 110 L215 220 Q160 245 105 220 Z"
        fill={obtenerColor("pectoral")}
      />

      <rect x="138" y="145" width="44" height="80" rx="12" fill={obtenerColor("abdominales")} />

      <ellipse cx="105" cy="120" rx="26" ry="38" fill={obtenerColor("deltoides")} />
      <ellipse cx="215" cy="120" rx="26" ry="38" fill={obtenerColor("deltoides")} />

      <rect x="78" y="145" width="24" height="95" rx="12" fill={obtenerColor("biceps")} />
      <rect x="218" y="145" width="24" height="95" rx="12" fill={obtenerColor("biceps")} />

      <rect x="82" y="235" width="20" height="80" rx="10" fill="#dfe3ea" />
      <rect x="218" y="235" width="20" height="80" rx="10" fill="#dfe3ea" />

      <path d="M125 220 L195 220 L185 270 Q160 285 135 270 Z" fill="#dfe3ea" />

      <rect x="125" y="270" width="28" height="95" rx="14" fill={obtenerColor("cuadriceps")} />
      <rect x="167" y="270" width="28" height="95" rx="14" fill={obtenerColor("cuadriceps")} />

      <rect x="128" y="360" width="22" height="48" rx="10" fill={obtenerColor("pantorrillas")} />
      <rect x="170" y="360" width="22" height="48" rx="10" fill={obtenerColor("pantorrillas")} />
    </svg>
  </div>

  <div>
    <p style={{ textAlign: "center", fontWeight: 700 }}>Vista posterior</p>

    <svg width="220" height="360" viewBox="0 0 320 420">
      <circle cx="160" cy="40" r="28" fill="#fde2b8" />

      <polygon points="130,75 190,75 210,120 110,120" fill={obtenerColor("trapecios")} />

      <path
        d="M110 115 Q160 90 210 115 L220 225 Q160 250 100 225 Z"
        fill={obtenerColor("dorsales")}
      />

      <rect x="142" y="135" width="36" height="95" rx="12" fill={obtenerColor("espaldaBaja")} />

      <ellipse cx="100" cy="125" rx="26" ry="40" fill={obtenerColor("deltoides")} />
      <ellipse cx="220" cy="125" rx="26" ry="40" fill={obtenerColor("deltoides")} />

      <rect x="75" y="150" width="24" height="95" rx="12" fill={obtenerColor("triceps")} />
      <rect x="221" y="150" width="24" height="95" rx="12" fill={obtenerColor("triceps")} />

      <rect x="78" y="240" width="20" height="75" rx="10" fill="#dfe3ea" />
      <rect x="222" y="240" width="20" height="75" rx="10" fill="#dfe3ea" />

      <ellipse cx="140" cy="245" rx="28" ry="34" fill={obtenerColor("gluteos")} />
      <ellipse cx="180" cy="245" rx="28" ry="34" fill={obtenerColor("gluteos")} />

      <rect x="125" y="280" width="28" height="85" rx="14" fill={obtenerColor("isquiotibiales")} />
      <rect x="167" y="280" width="28" height="85" rx="14" fill={obtenerColor("isquiotibiales")} />

      <rect x="128" y="360" width="22" height="48" rx="10" fill={obtenerColor("pantorrillas")} />
      <rect x="170" y="360" width="22" height="48" rx="10" fill={obtenerColor("pantorrillas")} />
    </svg>
  </div>
</div>

        <div>
          <h4>Músculos trabajados</h4>

          {mapaDeEnfoque.map((item) => (
            <p key={item.region}>
              <strong>{item.region}</strong>: {item.nivel}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MapaMuscular;