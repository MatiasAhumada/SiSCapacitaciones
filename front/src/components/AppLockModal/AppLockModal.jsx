import PropTypes from 'prop-types';

const AppLockModal = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-lock text-red-600 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Aplicación Bloqueada</h2>
          <p className="text-gray-600 mb-4">{message}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              <i className="fa-solid fa-money-bill-wave mr-2"></i>
              Información de Pago
            </p>
            <p className="text-sm text-blue-800 mb-1">
              <strong>Alias:</strong> mahumada9732.nx.ars
            </p>
            <p className="text-sm text-blue-800">
              <strong>Vencimiento:</strong> Día 7 de cada mes
            </p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            Contacte al administrador para más información
          </p>
        </div>
      </div>
    </div>
  );
};

AppLockModal.propTypes = {
  message: PropTypes.string.isRequired,
};

export default AppLockModal;
