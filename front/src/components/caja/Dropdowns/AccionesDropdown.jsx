import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aperturaCaja, cerrarCaja } from '../../../services/Cajas.service';
import Swal from 'sweetalert2';

const AccionesDropdown = ({ idVend, onCajaAction, onDescargarExcel }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = async (ruta) => {
    setOpen(false);
    switch (ruta) {
      case 'apertura':
        await aperturaCaja(idVend)
          .then((res) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Apertura de caja exitosa',
              text: `Caja abierta por ${res.vendedor.name}`,
            });
            // Notificar al componente padre para recargar datos
            if (onCajaAction) onCajaAction();
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al abrir la caja',
              text: err.response?.data?.message || 'Error desconocido',
            });
          });

        break;
      case 'cierre':
        await cerrarCaja(idVend)
          .then((res) => {
            console.log(res);
            Swal.fire({
              icon: 'success',
              title: 'Cierre de caja exitosa',
            });
            // Notificar al componente padre para recargar datos
            if (onCajaAction) onCajaAction();
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al cerrar la caja',
              text: err.response?.data?.message || 'Error desconocido',
            });
          });
        break;
      case 'excel':
        if (onDescargarExcel) {
          onDescargarExcel();
        }
        break;
      default:
        navigate(`/${idVend}/${ruta}`);
    }
  };

  return (
    <div className="relative inline-block mt-3 md:mt-0">
      <button onClick={() => setOpen(!open)} className="px-4 py-2 text-white btnAz rounded-md">
        Acciones
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <button
            onClick={() => handleNavigate('apertura')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Apertura Caja
          </button>
          <button
            onClick={() => handleNavigate('cobrar')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Cobrar
          </button>
          <button
            onClick={() => handleNavigate('egreso')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Egreso
          </button>
          <button
            onClick={() => handleNavigate('transferencia')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Transferir
          </button>
          <button
            onClick={() => handleNavigate('excel')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            📊 Descargar Excel
          </button>
          <button
            onClick={() => handleNavigate('cierre')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Cerrar caja
          </button>
        </div>
      )}
    </div>
  );
};

export default AccionesDropdown;
