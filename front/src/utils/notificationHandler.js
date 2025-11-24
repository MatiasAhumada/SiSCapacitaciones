import Swal from 'sweetalert2';

const getPosition = () => {
  return window.innerWidth >= 1024 ? 'top-end' : 'top';
};

/**
 * Muestra una notificación de error
 * @param {string} message - Mensaje de error a mostrar
 * @param {number} timer - Duración en milisegundos (default: 3000)
 */
export const clientErrorHandler = (message, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: getPosition(),
    icon: 'error',
    title: message || 'Ha ocurrido un error',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};

/**
 * Muestra una notificación de éxito
 * @param {string} message - Mensaje de éxito a mostrar
 * @param {number} timer - Duración en milisegundos (default: 3000)
 */
export const clientSuccessHandler = (message, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: getPosition(),
    icon: 'success',
    title: message || 'Operación exitosa',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};

/**
 * Muestra una notificación de advertencia
 * @param {string} message - Mensaje de advertencia a mostrar
 * @param {number} timer - Duración en milisegundos (default: 3000)
 */
export const clientWarningHandler = (message, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: getPosition(),
    icon: 'warning',
    title: message || 'Advertencia',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};

/**
 * Muestra una notificación informativa
 * @param {string} message - Mensaje informativo a mostrar
 * @param {number} timer - Duración en milisegundos (default: 3000)
 */
export const clientInfoHandler = (message, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: getPosition(),
    icon: 'info',
    title: message,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};
