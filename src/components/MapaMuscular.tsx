import type {
  MapaDeEnfoque,
  NivelMuscular,
  RegionMuscular,
} from "../types/ejercicio";

type Props = {
  mapaDeEnfoque: MapaDeEnfoque[];
};

const coloresPorNivel: Record<NivelMuscular | "inactivo", string> = {
  principal: "#ef4444",
  secundario: "#f97316",
  indirecto: "#facc15",
  inactivo: "#253044",
};

const etiquetasPorNivel: Record<NivelMuscular | "inactivo", string> = {
  principal: "Principal",
  secundario: "Secundario",
  indirecto: "Indirecto",
  inactivo: "Sin foco",
};

const nombresRegion: Record<RegionMuscular, string> = {
  pectoral: "Pectoral",
  deltoides: "Deltoides",
  biceps: "Biceps",
  triceps: "Triceps",
  abdominales: "Abdominales",
  oblicuos: "Oblicuos",
  cuadriceps: "Cuadriceps",
  isquiotibiales: "Isquiotibiales",
  gluteos: "Gluteos",
  pantorrillas: "Pantorrillas",
  dorsales: "Dorsales",
  trapecios: "Trapecios",
  espaldaBaja: "Espalda baja",
};

type PiezaMuscularProps = {
  region?: RegionMuscular;
  d?: string;
  points?: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  transform?: string;
  tipo?: "path" | "polygon" | "ellipse" | "rect";
  color: string;
};

function MapaMuscular({ mapaDeEnfoque }: Props) {
  const obtenerNivel = (region: RegionMuscular) =>
    mapaDeEnfoque.find((item) => item.region === region)?.nivel ?? "inactivo";

  const obtenerColor = (region: RegionMuscular) =>
    coloresPorNivel[obtenerNivel(region)];

  const PiezaMuscular = ({
    region,
    color,
    tipo = "path",
    ...props
  }: PiezaMuscularProps) => {
    const fill = region ? obtenerColor(region) : color;
    const label = region
      ? `${nombresRegion[region]} - ${etiquetasPorNivel[obtenerNivel(region)]}`
      : "Zona sin foco";

    if (tipo === "polygon") {
      return (
        <polygon className="musculo" fill={fill} {...props}>
          <title>{label}</title>
        </polygon>
      );
    }

    if (tipo === "ellipse") {
      return (
        <ellipse className="musculo" fill={fill} {...props}>
          <title>{label}</title>
        </ellipse>
      );
    }

    if (tipo === "rect") {
      return (
        <rect className="musculo" fill={fill} rx="12" {...props}>
          <title>{label}</title>
        </rect>
      );
    }

    return (
      <path className="musculo" fill={fill} {...props}>
        <title>{label}</title>
      </path>
    );
  };

  return (
    <section className="mapa-muscular">
      <div className="mapa-muscular-header">
        <h3>Mapa muscular</h3>

        <div className="mapa-leyenda" aria-label="Leyenda de intensidad">
          {(["principal", "secundario", "indirecto"] as NivelMuscular[]).map(
            (nivel) => (
              <span key={nivel}>
                <i style={{ backgroundColor: coloresPorNivel[nivel] }} />
                {etiquetasPorNivel[nivel]}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mapa-muscular-layout">
        <div className="mapa-vistas">
          <div className="mapa-vista">
            <p>Vista frontal</p>

            <svg
              className="figura-muscular"
              viewBox="0 0 260 460"
              role="img"
              aria-label="Mapa muscular frontal"
            >
              <PiezaMuscular
                tipo="ellipse"
                color={coloresPorNivel.inactivo}
                cx={130}
                cy={38}
                rx={24}
                ry={29}
              />
              <PiezaMuscular
                region="trapecios"
                tipo="polygon"
                color={coloresPorNivel.inactivo}
                points="101,72 159,72 181,105 151,113 130,101 109,113 79,105"
              />
              <path
                className="linea-cuerpo"
                d="M112 68 Q130 78 148 68"
              />

              <PiezaMuscular
                region="deltoides"
                color={coloresPorNivel.inactivo}
                d="M79 103 C55 110 43 134 48 159 C66 158 78 147 88 126 C91 117 88 108 79 103Z"
              />
              <PiezaMuscular
                region="deltoides"
                color={coloresPorNivel.inactivo}
                d="M181 103 C205 110 217 134 212 159 C194 158 182 147 172 126 C169 117 172 108 181 103Z"
              />

              <PiezaMuscular
                region="pectoral"
                color={coloresPorNivel.inactivo}
                d="M88 113 C103 101 119 99 130 111 L130 171 C107 169 91 156 82 136 C79 127 80 119 88 113Z"
              />
              <PiezaMuscular
                region="pectoral"
                color={coloresPorNivel.inactivo}
                d="M172 113 C157 101 141 99 130 111 L130 171 C153 169 169 156 178 136 C181 127 180 119 172 113Z"
              />

              <PiezaMuscular
                region="biceps"
                color={coloresPorNivel.inactivo}
                d="M55 160 C70 158 80 166 80 187 L76 246 C74 260 58 260 53 247 L45 194 C43 177 47 166 55 160Z"
              />
              <PiezaMuscular
                region="biceps"
                color={coloresPorNivel.inactivo}
                d="M205 160 C190 158 180 166 180 187 L184 246 C186 260 202 260 207 247 L215 194 C217 177 213 166 205 160Z"
              />
              <PiezaMuscular
                color={coloresPorNivel.inactivo}
                d="M53 252 C64 259 71 269 69 286 L64 337 C61 351 47 350 45 336 L39 284 C37 269 42 258 53 252Z"
              />
              <PiezaMuscular
                color={coloresPorNivel.inactivo}
                d="M207 252 C196 259 189 269 191 286 L196 337 C199 351 213 350 215 336 L221 284 C223 269 218 258 207 252Z"
              />

              <PiezaMuscular
                region="abdominales"
                color={coloresPorNivel.inactivo}
                d="M104 169 C112 176 121 180 130 180 C139 180 148 176 156 169 L161 251 C151 269 139 278 130 278 C121 278 109 269 99 251Z"
              />
              <PiezaMuscular
                region="oblicuos"
                color={coloresPorNivel.inactivo}
                d="M86 146 C99 170 102 206 99 251 C87 239 80 217 78 190 C77 170 79 154 86 146Z"
              />
              <PiezaMuscular
                region="oblicuos"
                color={coloresPorNivel.inactivo}
                d="M174 146 C161 170 158 206 161 251 C173 239 180 217 182 190 C183 170 181 154 174 146Z"
              />
              <path
                className="linea-cuerpo"
                d="M130 178 L130 276 M107 202 H153 M104 229 H156 M116 254 H144"
              />

              <PiezaMuscular
                color={coloresPorNivel.inactivo}
                d="M99 258 C118 270 142 270 161 258 L154 300 C139 311 121 311 106 300Z"
              />
              <PiezaMuscular
                region="cuadriceps"
                color={coloresPorNivel.inactivo}
                d="M104 300 C119 306 127 325 124 352 L118 407 C116 423 98 423 95 407 L88 348 C85 325 91 307 104 300Z"
              />
              <PiezaMuscular
                region="cuadriceps"
                color={coloresPorNivel.inactivo}
                d="M156 300 C141 306 133 325 136 352 L142 407 C144 423 162 423 165 407 L172 348 C175 325 169 307 156 300Z"
              />
              <PiezaMuscular
                region="pantorrillas"
                color={coloresPorNivel.inactivo}
                d="M96 405 C107 411 114 425 111 444 L108 458 H88 L91 431 C92 420 93 412 96 405Z"
              />
              <PiezaMuscular
                region="pantorrillas"
                color={coloresPorNivel.inactivo}
                d="M164 405 C153 411 146 425 149 444 L152 458 H172 L169 431 C168 420 167 412 164 405Z"
              />
            </svg>
          </div>

          <div className="mapa-vista">
            <p>Vista posterior</p>

            <svg
              className="figura-muscular"
              viewBox="0 0 260 460"
              role="img"
              aria-label="Mapa muscular posterior"
            >
              <PiezaMuscular
                tipo="ellipse"
                color={coloresPorNivel.inactivo}
                cx={130}
                cy={38}
                rx={24}
                ry={29}
              />
              <PiezaMuscular
                region="trapecios"
                tipo="polygon"
                color={coloresPorNivel.inactivo}
                points="102,72 158,72 184,118 151,116 130,103 109,116 76,118"
              />
              <PiezaMuscular
                region="deltoides"
                color={coloresPorNivel.inactivo}
                d="M77 108 C55 114 43 136 48 161 C65 159 78 148 88 127 C91 118 87 111 77 108Z"
              />
              <PiezaMuscular
                region="deltoides"
                color={coloresPorNivel.inactivo}
                d="M183 108 C205 114 217 136 212 161 C195 159 182 148 172 127 C169 118 173 111 183 108Z"
              />

              <PiezaMuscular
                region="dorsales"
                color={coloresPorNivel.inactivo}
                d="M86 121 C102 112 118 111 130 122 L130 252 C111 248 94 234 85 211 C76 186 75 144 86 121Z"
              />
              <PiezaMuscular
                region="dorsales"
                color={coloresPorNivel.inactivo}
                d="M174 121 C158 112 142 111 130 122 L130 252 C149 248 166 234 175 211 C184 186 185 144 174 121Z"
              />
              <PiezaMuscular
                region="espaldaBaja"
                color={coloresPorNivel.inactivo}
                d="M109 208 C122 216 138 216 151 208 L158 260 C143 272 117 272 102 260Z"
              />
              <path
                className="linea-cuerpo"
                d="M130 121 L130 262 M101 150 C116 163 144 163 159 150 M100 187 C116 198 144 198 160 187"
              />

              <PiezaMuscular
                region="triceps"
                color={coloresPorNivel.inactivo}
                d="M55 161 C70 159 80 167 80 188 L76 248 C74 262 58 262 53 249 L45 195 C43 178 47 167 55 161Z"
              />
              <PiezaMuscular
                region="triceps"
                color={coloresPorNivel.inactivo}
                d="M205 161 C190 159 180 167 180 188 L184 248 C186 262 202 262 207 249 L215 195 C217 178 213 167 205 161Z"
              />
              <PiezaMuscular
                color={coloresPorNivel.inactivo}
                d="M53 253 C64 260 71 270 69 287 L64 337 C61 351 47 350 45 336 L39 285 C37 270 42 259 53 253Z"
              />
              <PiezaMuscular
                color={coloresPorNivel.inactivo}
                d="M207 253 C196 260 189 270 191 287 L196 337 C199 351 213 350 215 336 L221 285 C223 270 218 259 207 253Z"
              />

              <PiezaMuscular
                region="gluteos"
                color={coloresPorNivel.inactivo}
                d="M101 261 C118 252 132 263 130 288 C126 310 105 318 91 304 C83 288 86 270 101 261Z"
              />
              <PiezaMuscular
                region="gluteos"
                color={coloresPorNivel.inactivo}
                d="M159 261 C142 252 128 263 130 288 C134 310 155 318 169 304 C177 288 174 270 159 261Z"
              />
              <PiezaMuscular
                region="isquiotibiales"
                color={coloresPorNivel.inactivo}
                d="M101 308 C119 315 126 334 123 359 L117 409 C115 423 99 423 96 409 L89 354 C86 332 90 314 101 308Z"
              />
              <PiezaMuscular
                region="isquiotibiales"
                color={coloresPorNivel.inactivo}
                d="M159 308 C141 315 134 334 137 359 L143 409 C145 423 161 423 164 409 L171 354 C174 332 170 314 159 308Z"
              />
              <PiezaMuscular
                region="pantorrillas"
                color={coloresPorNivel.inactivo}
                d="M96 407 C108 413 114 426 111 444 L108 458 H88 L91 431 C92 420 93 413 96 407Z"
              />
              <PiezaMuscular
                region="pantorrillas"
                color={coloresPorNivel.inactivo}
                d="M164 407 C152 413 146 426 149 444 L152 458 H172 L169 431 C168 420 167 413 164 407Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapaMuscular;
