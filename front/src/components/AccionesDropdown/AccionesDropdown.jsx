import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aperturaCaja, cerrarCaja } from '../../services/Cajas.service';
import PropTypes from 'prop-types';
import { clientSuccessHandler, clientErrorHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES } from '../../constants/messages';

const AccionesDropdown = ({ idVend, onCajaAction, onDescargarExcel }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAbrirCaja = async () => {
    try {
      await aperturaCaja(idVend);
      clientSuccessHandler(SUCCESS_MESSAGES.CAJA_ABIERTA);
      onCajaAction();
    } catch (error) {
      clientErrorHandler(error.message || 'Error al abrir caja');
    }
    setOpen(false);
  };

  const handleCerrarCaja = async () => {
    try {
      await cerrarCaja(idVend);
      clientSuccessHandler(SUCCESS_MESSAGES.CAJA_CERRADA);
      onCajaAction();
    } catch (error) {
      clientErrorHandler(error.message || 'Error al cerrar caja');
    }
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="px-4 py-2 text-white rounded btnAz">
        Acciones
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
          <button
            onClick={handleAbrirCaja}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Abrir Caja
          </button>
          <button
            onClick={() => handleNavigation('/admin/cobrar')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cobrar
          </button>
          <button
            onClick={() => handleNavigation('/admin/egreso')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Egreso
          </button>
          <button
            onClick={() => handleNavigation('/admin/transferencia')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Transferencia
          </button>
          <button
            onClick={() => {
              onDescargarExcel();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Descargar Excel
          </button>
          <button
            onClick={handleCerrarCaja}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cerrar Caja
          </button>
        </div>
      )}
    </div>
  );
};

AccionesDropdown.propTypes = {
  idVend: PropTypes.string.isRequired,
  onCajaAction: PropTypes.func.isRequired,
  onDescargarExcel: PropTypes.func.isRequired,
};

export default AccionesDropdown;
