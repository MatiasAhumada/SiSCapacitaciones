/**
 * Normaliza un número y lo devuelve como string con formato local.
 * @param value Número o string numérico
 * @param locale Localización (default: es-AR)
 * @returns Número formateado como string (ej: "1.234,56")
 */
export function formatNumber(
  value: number | string | null,
  locale = 'es-AR',
): string {
  if (value === null || value === undefined) return '';

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '';

  return num.toLocaleString(locale);
}
