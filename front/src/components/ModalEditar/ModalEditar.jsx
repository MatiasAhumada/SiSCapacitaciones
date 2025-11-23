import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../Spinner/Spinner.jsx';

export const ModalEditar = ({
  formData,
  onClose,
  onSave,
  onChange,
  vend,
  isFromAlumno = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };
  const handleSave = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4`}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col transition-all duration-200 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-xl">
          <h3 className="text-xl font-bold text-white">Editar Movimiento</h3>
        </div>

        <form className="space-y-4 p-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
            <input
              type="text"
              name="fecha"
              value={formData.fecha ? formatToDisplay(formData.fecha) : ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vendedor</label>
            <select
              name="vendedorId"
              value={formData.vendedorId || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Seleccione un vendedor</option>
              {vend?.map((vendedor) => (
                <option key={vendedor.id} value={vendedor.id}>
                  {vendedor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Alumno</label>
            <input
              type="text"
              value={formData.alumnoNombre || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
            {isFromAlumno ? (
              <input
                type="text"
                value="Ingreso"
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            ) : (
              <select
                name="tipo"
                value={formData.tipo || ''}
                onChange={onChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Seleccione</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
                <option value="Transferencia">Transferencia de caja</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Método de Pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Debito">Débito</option>
              <option value="Credito">Crédito</option>
              <option value="Digital Javier">Digital javier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cuota</label>
            <input
              type="number"
              name="cuota"
              value={formData.cuota || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mes de Cuota</label>
            <select
              name="mesCuota"
              value={formData.mesCuota || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Seleccione un mes</option>
              <option value="Enero">Enero</option>
              <option value="Febrero">Febrero</option>
              <option value="Marzo">Marzo</option>
              <option value="Abril">Abril</option>
              <option value="Mayo">Mayo</option>
              <option value="Junio">Junio</option>
              <option value="Julio">Julio</option>
              <option value="Agosto">Agosto</option>
              <option value="Septiembre">Septiembre</option>
              <option value="Octubre">Octubre</option>
              <option value="Noviembre">Noviembre</option>
              <option value="Diciembre">Diciembre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto || ''}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 pt-4  bg-gray-50 rounded-b-xl">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={isSaving ? null : handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? <Spinner color="white"></Spinner> : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

ModalEditar.propTypes = {
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  vend: PropTypes.array.isRequired,
  isFromAlumno: PropTypes.bool,
};
