import { format } from 'date-fns-tz';
import { es } from 'date-fns/locale';
const TIME_ZONE = 'America/Argentina/Buenos_Aires';
export function getArgentinaTime(): Date {
  const now = new Date(); // Obtiene la fecha y hora actual en la zona horaria local del servidor
  const utcMilliseconds = now.getTime(); // Millisegundos desde la época UTC
  const argentinaOffsetMilliseconds = 3 * 60 * 60 * 1000; // 3 horas en milisegundos (para UTC-3)

  // Resta el offset para obtener la hora UTC-3 en milisegundos desde la época
  const argentinaUtcMilliseconds =
    utcMilliseconds - argentinaOffsetMilliseconds;

  return new Date(argentinaUtcMilliseconds);
}

/**
 * Convierte una fecha en UTC o tipo Date a hora de Argentina y la devuelve formateada.
 * Funciona tanto para `timestamp/timestamptz` como para `date` de PostgreSQL.
 *
 * @param date Fecha en UTC, string ISO, o Date
 * @param pattern Formato de salida (por defecto dd/MM/yyyy)
 * @returns Fecha formateada en zona horaria Argentina
 */
export function formatDateToArgentina(
  date: Date | string,
  pattern = 'dd/MM/yyyy',
): string {
  if (!date) return '';

  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else {
    // string 'YYYY-MM-DD' -> Date
    const [year, month, day] = date.split('-');
    d = new Date(Number(year), Number(month) - 1, Number(day));
  }

  return format(d, pattern, { locale: es });
}

export function formatPostgresDate(date: string | Date): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export function normalizeDateArgentina(
  date: Date | string,
  pattern = 'EEE, d MMM yyyy',
): string {
  return formatDateToArgentina(date, pattern);
}
