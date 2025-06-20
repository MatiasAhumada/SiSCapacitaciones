import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aperturaCaja } from "../../queris/queris";
import Swal from "sweetalert2";

const AccionesDropdown = ({ idVend }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = async (ruta) => {
    setOpen(false);
    switch (ruta) {
      case "apertura":
        await aperturaCaja(idVend)
          .then((res) => {
            console.log(res);
            Swal.fire({
              icon: "success",
              title: "Apertura de caja exitosa",
              text: `Caja abierta por ${res.data.vendedor.name}`,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Error al abrir la caja",
              text: err.response?.data?.message || "Error desconocido",
              showConfirmButton: false,
              timer: 1500,
            });
          });

        break;
      case "cierre":
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
          <button onClick={() => handleNavigate("apertura")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Apertura Caja
          </button>
          <button onClick={() => handleNavigate("cobrar")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Cobrar
          </button>
          <button onClick={() => handleNavigate("egreso")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Egreso
          </button>
          <button onClick={() => handleNavigate("transferencia")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Transferir
          </button>
          <button onClick={() => handleNavigate("cobrar")} disabled className="w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed">
            Cerrar caja
          </button>
        </div>
      )}
    </div>
  );
};

export default AccionesDropdown;
