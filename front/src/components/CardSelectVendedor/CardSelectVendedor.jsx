import PropTypes from 'prop-types';

export const CardSelectVendedor = ({ vendedor, onSelect, isSelected }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect()}
    >
      <div className="p-4 text-left text-lg font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
        <span className="text-center block">{vendedor.name}</span>
        {isSelected && (
          <span className="px-3 py-1 text-xs font-bold rounded-full capitalize bg-green-100 text-green-800 float-right">
            Seleccionado
          </span>
        )}
      </div>
      <div className="px-4 pt-2 pb-4 text-sm text-gray-700 border-t border-gray-200">
        <div className="mb-4 grid grid-cols-1 gap-4 items-start">
          <div>
            <p className="font-semibold text-gray-800 mb-2">Totales por Medio de Pago:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                Efectivo:{' '}
                <span className="font-bold text-green-700">${vendedor.totalEfectivo}</span>
              </li>
              <li>
                Digital Javier:{' '}
                <span className="font-bold text-green-700">
                  ${vendedor.totalDigitalJavier.toFixed(2)}
                </span>
              </li>
              <li>
                Digital Tobias:{' '}
                <span className="font-bold text-green-700">
                  ${vendedor.totalDigitalTobias.toFixed(2)}
                </span>
              </li>
              <li className="font-bold mt-2">
                Total Ingresos:{' '}
                <span className="font-bold text-green-700">
                  ${vendedor.totalIngreso.toFixed(2)}
                </span>
              </li>
              <li className="font-bold mt-2">
                Total Egresos:{' '}
                <span className="text-red-700">${vendedor.totalEgreso.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

CardSelectVendedor.propTypes = {
  vendedor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    totalEfectivo: PropTypes.number,
    totalDigitalJavier: PropTypes.number,
    totalDigitalTobias: PropTypes.number,
    totalIngreso: PropTypes.number,
    totalEgreso: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
