import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccionesDropdown = ({ idVend }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (ruta) => {
    setOpen(false);
    navigate(`/${idVend}/${ruta}`);
  };

  return (
    <div className="relative inline-block mt-3 md:mt-0">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 text-white btnAz rounded-md"
      >
        Acciones
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
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
            onClick={() => handleNavigate('cobrar')}
            disabled
            className="w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed"
          >
            Cerrar caja
          </button>
        </div>
      )}
    </div>
  );
};

export default AccionesDropdown;
