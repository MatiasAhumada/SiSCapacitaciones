import { useState } from 'react';

const CajaResumen = ({ sesionCaja }) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  if (!sesionCaja) return null;

  const toggleDetalle = () => setMostrarDetalle(!mostrarDetalle);

  return (
    <div className="mt-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Total Ingresos */}
        <div
          onClick={toggleDetalle}
          className="bg-white shadow-md border p-3 rounded text-center cursor-pointer hover:bg-gray-50"
        >
          <p className="text-gray-500">Total Ingresos</p>
          <p className="font-bold text-green-600">
            ${Number(sesionCaja.totalIngresos).toLocaleString()}
          </p>
        </div>

        {/* Total Egresos */}
        <div className="bg-white shadow-md border p-3 rounded text-center">
          <p className="text-gray-500">Total Egresos</p>
          <p className="font-bold text-red-600">
            ${Number(sesionCaja.totalEgresos).toLocaleString()}
          </p>
        </div>

        {/* Total Caja */}
        <div className="bg-white shadow-md border p-3 rounded text-center">
          <p className="text-gray-500">Total Caja</p>
          <p className="font-bold text-black">
            ${Number(sesionCaja.montoCierre || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Detalle de Ingresos */}
      {mostrarDetalle && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="bg-gray-50 border p-3 rounded text-center">
            <p className="text-gray-500">Total Efectivo</p>
            <p className="font-bold text-green-600">
              ${Number(sesionCaja.totalEfectivo).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 border p-3 rounded text-center">
            <p className="text-gray-500">Digital Javier</p>
            <p className="font-bold text-purple-600">
              ${Number(sesionCaja.totalDigitalJavier).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 border p-3 rounded text-center">
            <p className="text-gray-500">Digital Tobias</p>
            <p className="font-bold text-purple-600">
              ${Number(sesionCaja.totalDigitalTobias).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 border p-3 rounded text-center">
            <p className="text-gray-500">Total Crédito</p>
            <p className="font-bold text-blue-600">
              ${Number(sesionCaja.totalCredito).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CajaResumen;
