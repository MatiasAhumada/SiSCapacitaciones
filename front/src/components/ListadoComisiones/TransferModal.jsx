import { useState } from 'react';
import PropTypes from 'prop-types';
import ComisionSelector from '../Common/ComisionSelector';

const TransferModal = ({
  alumno,
  comisiones,
  selectedComisionId,
  onComisionChange,
  onConfirm,
  onCancel,
}) => {
  const [comisionSearch, setComisionSearch] = useState('');
  const [showComisiones, setShowComisiones] = useState(false);

  const handleComisionSelect = (comision) => {
    const comisionText = `${comision.name} - ${comision.curso?.name} (${comision.day} ${comision.hour?.start}-${comision.hour?.end})`;
    setComisionSearch(comisionText);
    onComisionChange(comision.id);
    setShowComisiones(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bgColor flex items-center justify-center">
              <i className="fa-solid fa-exchange-alt text-white text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 principal">Transferir Alumno</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-user-graduate text-blue-600 text-2xl"></i>
              <div>
                <p className="text-xs text-gray-600 mb-1">Alumno seleccionado</p>
                <p className="text-xl font-bold text-gray-800 principal">{alumno?.name}</p>
              </div>
            </div>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-3 principal">
            <i className="fa-solid fa-arrow-right text-blue-600 mr-2"></i>
            Nueva comisión
          </label>
          <ComisionSelector
            comisiones={comisiones}
            selectedComisionId={selectedComisionId}
            onComisionSelect={handleComisionSelect}
            searchValue={comisionSearch}
            onSearchChange={setComisionSearch}
            showDropdown={showComisiones}
            onShowDropdown={setShowComisiones}
            placeholder="Buscar comisión..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded transition-all duration-200 principal"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 btnAz text-white font-semibold rounded transition-all duration-200 shadow-lg hover:shadow-xl principal"
          >
            <i className="fa-solid fa-check mr-2"></i>
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
};

TransferModal.propTypes = {
  alumno: PropTypes.object,
  comisiones: PropTypes.array.isRequired,
  selectedComisionId: PropTypes.string,
  onComisionChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TransferModal;
