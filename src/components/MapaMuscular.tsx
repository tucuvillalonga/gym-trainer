import type {
  MapaDeEnfoque,
  NivelMuscular,
  RegionMuscular,
} from "../types/ejercicio";

type Props = {
  mapaDeEnfoque?: MapaDeEnfoque[];
  titulo?: string;
  leyenda?: { etiqueta: string; color: string }[];
  colorPorRegion?: Partial<Record<RegionMuscular, string>>;
  etiquetaPorRegion?: Partial<Record<RegionMuscular, string>>;
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
  antebrazos: "Antebrazos",
  abdominales: "Abdominales",
  oblicuos: "Oblicuos",
  cuadriceps: "Cuadriceps",
  isquiotibiales: "Isquiotibiales",
  gluteos: "Gluteos",
  pantorrillas: "Pantorrillas",
  dorsales: "Dorsales",
  espaldaAlta: "Espalda alta",
  espaldaMedia: "Espalda media",
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

function MapaMuscular({
  mapaDeEnfoque = [],
  titulo = "Mapa muscular",
  leyenda,
  colorPorRegion = {},
  etiquetaPorRegion = {},
}: Props) {
  const obtenerNivel = (region: RegionMuscular) =>
    mapaDeEnfoque.find((item) => item.region === region)?.nivel ?? "inactivo";

  const obtenerColor = (region: RegionMuscular) =>
    colorPorRegion[region] ?? coloresPorNivel[obtenerNivel(region)];

  const PiezaMuscular = ({
    region,
    color,
    tipo = "path",
    ...props
  }: PiezaMuscularProps) => {
    const fill = region ? obtenerColor(region) : color;
    const label = region
      ? `${nombresRegion[region]} - ${
          etiquetaPorRegion[region] ?? etiquetasPorNivel[obtenerNivel(region)]
        }`
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
        <h3>{titulo}</h3>

        <div className="mapa-leyenda" aria-label="Leyenda de intensidad">
          {leyenda
            ? leyenda.map((item) => (
                <span key={item.etiqueta}>
                  <i style={{ backgroundColor: item.color }} />
                  {item.etiqueta}
                </span>
              ))
            : (["principal", "secundario", "indirecto"] as NivelMuscular[]).map(
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
                region="antebrazos"
                color={coloresPorNivel.inactivo}
                d="M53 252 C64 259 71 269 69 286 L64 337 C61 351 47 350 45 336 L39 284 C37 269 42 258 53 252Z"
              />
              <PiezaMuscular
                region="antebrazos"
                color={coloresPorNivel.inactivo}
                d="M207 252 C196 259 189 269 191 286 L196 337 C199 351 213 350 215 336 L221 284 C223 269 218 258 207 252Z"
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
                color={coloresPorNivel.inactivo}
                d="M112 68 C118 86 124 98 130 109 C136 98 142 86 148 68 C153 87 166 104 184 118 C168 118 153 113 142 106 C136 102 133 104 130 111 C127 104 124 102 118 106 C107 113 92 118 76 118 C94 104 107 87 112 68Z"
              />
              <PiezaMuscular
                region="espaldaAlta"
                color={coloresPorNivel.inactivo}
                d="M88 113 C104 105 121 111 130 126 L130 166 C112 164 98 153 90 138 C84 127 84 117 88 113Z"
              />
              <PiezaMuscular
                region="espaldaAlta"
                color={coloresPorNivel.inactivo}
                d="M172 113 C156 105 139 111 130 126 L130 166 C148 164 162 153 170 138 C176 127 176 117 172 113Z"
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
                d="M86 126 C96 145 111 160 130 171 L130 252 C111 247 96 233 88 211 C81 188 79 151 86 126Z"
              />
              <PiezaMuscular
                region="dorsales"
                color={coloresPorNivel.inactivo}
                d="M174 126 C164 145 149 160 130 171 L130 252 C149 247 164 233 172 211 C179 188 181 151 174 126Z"
              />
              <PiezaMuscular
                region="espaldaMedia"
                color={coloresPorNivel.inactivo}
                d="M101 151 C113 158 123 163 130 166 L130 211 C117 208 106 199 99 186 C94 174 95 161 101 151Z"
              />
              <PiezaMuscular
                region="espaldaMedia"
                color={coloresPorNivel.inactivo}
                d="M159 151 C147 158 137 163 130 166 L130 211 C143 208 154 199 161 186 C166 174 165 161 159 151Z"
              />
              <PiezaMuscular
                region="espaldaBaja"
                color={coloresPorNivel.inactivo}
                d="M109 207 C122 216 138 216 151 207 L158 260 C145 271 115 271 102 260Z"
              />
              <path
                className="linea-cuerpo"
                d="M130 112 L130 262 M101 149 C116 162 144 162 159 149 M99 187 C116 198 144 198 161 187 M109 221 C122 229 138 229 151 221"
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
                region="antebrazos"
                color={coloresPorNivel.inactivo}
                d="M53 253 C64 260 71 270 69 287 L64 337 C61 351 47 350 45 336 L39 285 C37 270 42 259 53 253Z"
              />
              <PiezaMuscular
                region="antebrazos"
                color={coloresPorNivel.inactivo}
                d="M207 253 C196 260 189 270 191 287 L196 337 C199 351 213 350 215 336 L221 285 C223 270 218 259 207 253Z"
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
