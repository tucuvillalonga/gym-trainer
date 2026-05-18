import type { Ejercicio } from "../types/ejercicio";
import pressMilitarImg from "../assets/ejercicios/press-militar.webp";
import sentadillaImg from "../assets/ejercicios/sentadilla.webp";
import elevacionLateralMancuerna from "../assets/ejercicios/elevacion-lateral-mancuerna.webp";
import pechoPlanoBancoBarra from "../assets/ejercicios/pecho-plano-banco-barra.webp";
import flexiones from "../assets/ejercicios/flexiones.webp";
import dominadas from "../assets/ejercicios/dominadas.webp";
import remoBarra from "../assets/ejercicios/remo-barra.webp";
import hipthrust from "../assets/ejercicios/hipthrust.webp";
import curlBiceps from "../assets/ejercicios/curl-biceps.webp";
import plancha from "../assets/ejercicios/plancha.webp";




export const ejercicios: Ejercicio[] = [
  {
    id: "press-militar",
    nombre: "Press militar",
    grupoMuscular: "Hombros",
    musculoPrincipal: "deltoides",
    dificultad: "Intermedio",
    youtubeId: "2yjwXTZQDDI",
    imagen: pressMilitarImg,

    descripcion:
      "Ejercicio de empuje enfocado principalmente en hombros y tríceps.",

    checklist: [
      "Mantener el core firme",
      "No arquear la espalda",
      "Empujar en línea recta",
      "Controlar la bajada",
    ],

    erroresComunes: [
      "Arquear demasiado la espalda",
      "Bajar rápido el peso",
      "Usar impulso con piernas",
    ],

    mapaDeEnfoque: [
      {
        region: "deltoides",
        nivel: "principal",
      },

      {
        region: "triceps",
        nivel: "secundario",
      },

      {
        region: "trapecios",
        nivel: "indirecto",
      },
    ],
  },

  {
    id: "elevaciones-laterales",
    nombre: "Elevaciones laterales",
    grupoMuscular: "Hombros",
    musculoPrincipal: "deltoides",
    dificultad: "Principiante",
    youtubeId: "3VcKaXpzqRo",
    imagen: elevacionLateralMancuerna,

    descripcion:
      "Ejercicio aislado para trabajar el deltoide lateral.",

    checklist: [
      "Subir hasta altura de hombros",
      "Controlar el descenso",
      "Mantener codos levemente flexionados",
    ],

    erroresComunes: [
      "Usar impulso",
      "Subir demasiado alto",
      "Mover el torso",
    ],

    mapaDeEnfoque: [
      {
        region: "deltoides",
        nivel: "principal",
      },

      {
        region: "trapecios",
        nivel: "secundario",
      },
    ],
  },

  {
    id: "press-banca",
    nombre: "Press banca",
    grupoMuscular: "Pecho",
    musculoPrincipal: "pectoral",
    dificultad: "Intermedio",
    youtubeId: "rT7DgCr-3pg",
    imagen: pechoPlanoBancoBarra,

    descripcion:
      "Ejercicio principal para desarrollar pecho y fuerza de empuje.",

    checklist: [
      "Escápulas retraídas",
      "Pies firmes",
      "Bajar controlado",
      "Empujar recto",
    ],

    erroresComunes: [
      "Rebotar la barra",
      "Abrir demasiado los codos",
      "Levantar glúteos",
    ],

    mapaDeEnfoque: [
      {
        region: "pectoral",
        nivel: "principal",
      },

      {
        region: "triceps",
        nivel: "secundario",
      },

      {
        region: "deltoides",
        nivel: "secundario",
      },
    ],
  },

  {
    id: "flexiones",
    nombre: "Flexiones",
    grupoMuscular: "Pecho",
    musculoPrincipal: "pectoral",
    dificultad: "Principiante",
    youtubeId: "IODxDxX7oi4",
    imagen: flexiones,

    descripcion:
      "Ejercicio clásico de peso corporal para pecho y tríceps.",

    checklist: [
      "Cuerpo alineado",
      "Bajar controlado",
      "Mantener abdomen firme",
    ],

    erroresComunes: [
      "Hundirse de cadera",
      "No bajar suficiente",
      "Abrir demasiado los brazos",
    ],

    mapaDeEnfoque: [
      {
        region: "pectoral",
        nivel: "principal",
      },

      {
        region: "triceps",
        nivel: "secundario",
      },

      {
        region: "abdominales",
        nivel: "indirecto",
      },
    ],
  },

  {
    id: "dominadas",
    nombre: "Dominadas",
    grupoMuscular: "Espalda",
    musculoPrincipal: "dorsales",
    dificultad: "Avanzado",
    youtubeId: "eGo4IYlbE5g",
    imagen: dominadas,

    descripcion:
      "Ejercicio fundamental para espalda y fuerza de tracción.",

    checklist: [
      "Pecho arriba",
      "Bajar controlado",
      "Evitar balanceo",
    ],

    erroresComunes: [
      "Usar impulso",
      "Acortar recorrido",
      "Relajar hombros",
    ],

    mapaDeEnfoque: [
      {
        region: "dorsales",
        nivel: "principal",
      },

      {
        region: "biceps",
        nivel: "secundario",
      },

      {
        region: "trapecios",
        nivel: "secundario",
      },
    ],
  },

  {
    id: "remo-barra",
    nombre: "Remo con barra",
    grupoMuscular: "Espalda",
    musculoPrincipal: "dorsales",
    dificultad: "Intermedio",
    youtubeId: "FWJR5Ve8bnQ",
    imagen: remoBarra,

    descripcion:
      "Movimiento de tracción para desarrollar grosor de espalda.",

    checklist: [
      "Espalda recta",
      "Tirar hacia el abdomen",
      "Controlar el descenso",
    ],

    erroresComunes: [
      "Redondear espalda",
      "Usar impulso",
      "Encoger hombros",
    ],

    mapaDeEnfoque: [
      {
        region: "dorsales",
        nivel: "principal",
      },

      {
        region: "trapecios",
        nivel: "secundario",
      },

      {
        region: "biceps",
        nivel: "secundario",
      },
    ],
  },

  {
    id: "sentadilla",
    nombre: "Sentadilla",
    grupoMuscular: "Piernas",
    musculoPrincipal: "cuadriceps",
    dificultad: "Intermedio",
    youtubeId: "aclHkVaku9U",
    imagen: sentadillaImg,

    descripcion:
      "Movimiento básico de piernas enfocado en cuádriceps y glúteos.",

    checklist: [
      "Espalda recta",
      "Rodillas alineadas",
      "Bajar controlado",
      "Empujar con talones",
    ],

    erroresComunes: [
      "Rodillas hacia adentro",
      "Levantar talones",
      "Redondear espalda",
    ],

    mapaDeEnfoque: [
      {
        region: "cuadriceps",
        nivel: "principal",
      },

      {
        region: "gluteos",
        nivel: "secundario",
      },

      {
        region: "abdominales",
        nivel: "indirecto",
      },
    ],
  },

  {
    id: "hip-thrust",
    nombre: "Hip thrust",
    grupoMuscular: "Piernas",
    musculoPrincipal: "gluteos",
    dificultad: "Intermedio",
    youtubeId: "LM8XHLYJoYs",
    imagen: hipthrust,

    descripcion:
      "Ejercicio de empuje de cadera enfocado en glúteos.",

    checklist: [
      "Empujar con talones",
      "Apretar glúteos arriba",
      "No hiperextender espalda",
    ],

    erroresComunes: [
      "Empujar con lumbar",
      "Subir demasiado rápido",
      "Separar pies",
    ],

    mapaDeEnfoque: [
      {
        region: "gluteos",
        nivel: "principal",
      },

      {
        region: "isquiotibiales",
        nivel: "secundario",
      },

      {
        region: "abdominales",
        nivel: "indirecto",
      },
    ],
  },

  {
    id: "curl-biceps",
    nombre: "Curl de bíceps",
    grupoMuscular: "Brazos",
    musculoPrincipal: "biceps",
    dificultad: "Principiante",
    youtubeId: "ykJmrZ5v0Oo",
    imagen: curlBiceps,

    descripcion:
      "Ejercicio clásico de aislamiento para bíceps.",

    checklist: [
      "Codos quietos",
      "Subida controlada",
      "Bajada lenta",
    ],

    erroresComunes: [
      "Mover el torso",
      "Usar impulso",
      "Acortar recorrido",
    ],

    mapaDeEnfoque: [
      {
        region: "biceps",
        nivel: "principal",
      },

      {
        region: "biceps",
        nivel: "secundario",
      },
    ],
  },

  {
    id: "plancha",
    nombre: "Plancha",
    grupoMuscular: "Core",
    musculoPrincipal: "abdominales",
    dificultad: "Principiante",
    youtubeId: "pSHjTRCQxIw",
    imagen: plancha,

    descripcion:
      "Ejercicio isométrico para estabilidad del core.",

    checklist: [
      "Mantener línea recta",
      "Core activo",
      "Respirar controlado",
    ],

    erroresComunes: [
      "Hundirse de cadera",
      "Elevar demasiado la cadera",
      "Relajar abdomen",
    ],

    mapaDeEnfoque: [
      {
        region: "abdominales",
        nivel: "principal",
      },

      {
        region: "oblicuos",
        nivel: "secundario",
      },

      {
        region: "espaldaBaja",
        nivel: "indirecto",
      },
    ],
  },
];