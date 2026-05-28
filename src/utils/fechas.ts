export function inicioDelDia(fecha = new Date()) {
  const inicio = new Date(fecha);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

export function inicioDeSemana(fecha = new Date()) {
  const inicio = inicioDelDia(fecha);
  const dia = inicio.getDay();
  const desplazamiento = dia === 0 ? -6 : 1 - dia;
  inicio.setDate(inicio.getDate() + desplazamiento);
  return inicio;
}

export function esMismoDia(fechaA: Date, fechaB: Date) {
  return inicioDelDia(fechaA).getTime() === inicioDelDia(fechaB).getTime();
}

export function diasDesde(fechaISO: string, hasta = new Date()) {
  const desde = inicioDelDia(new Date(fechaISO)).getTime();
  const fin = inicioDelDia(hasta).getTime();
  return Math.max(0, Math.floor((fin - desde) / (1000 * 60 * 60 * 24)));
}
