import PropTypes from 'prop-types';

const CajaResumen = ({ sesionCaja }) => {
  if (!sesionCaja) return null;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 principal">Resumen de Caja</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Apertura</p>
          <p className="text-lg font-bold text-blue-800">{formatMoney(sesionCaja.montoApertura)}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Ingresos</p>
          <p className="text-lg font-bold text-green-800">
            {formatMoney(sesionCaja.totalIngresos)}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Egresos</p>
          <p className="text-lg font-bold text-red-800">{formatMoney(sesionCaja.totalEgresos)}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Total</p>
          <p className="text-lg font-bold text-purple-800">{formatMoney(sesionCaja.montoCierre)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Efectivo</p>
          <p className="text-sm font-bold text-gray-800">{formatMoney(sesionCaja.totalEfectivo)}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Crédito</p>
          <p className="text-sm font-bold text-gray-800">{formatMoney(sesionCaja.totalCredito)}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Digital Javier</p>
          <p className="text-sm font-bold text-gray-800">
            {formatMoney(sesionCaja.totalDigitalJavier)}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Digital Tobias</p>
          <p className="text-sm font-bold text-gray-800">
            {formatMoney(sesionCaja.totalDigitalTobias)}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Ferro</p>
          <p className="text-sm font-bold text-gray-800">{formatMoney(sesionCaja.totalFerro)}</p>
        </div>
      </div>
    </div>
  );
};

CajaResumen.propTypes = {
  sesionCaja: PropTypes.shape({
    montoApertura: PropTypes.number,
    totalIngresos: PropTypes.number,
    totalEgresos: PropTypes.number,
    montoCierre: PropTypes.number,
    totalEfectivo: PropTypes.number,
    totalCredito: PropTypes.number,
    totalDigitalJavier: PropTypes.number,
    totalDigitalTobias: PropTypes.number,
    totalFerro: PropTypes.number,
  }),
};

export default CajaResumen;
