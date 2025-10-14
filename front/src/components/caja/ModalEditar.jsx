import { useState, useEffect } from 'react';
import { Spinner } from '../Spinner/Spinner.jsx';

export const ModalEditar = ({ formData, onClose, onSave, onChange, vend, alu }) => {
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
    <div className={`fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50 `}>
      <div
        className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 transition-all duration-150 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Editar Movimiento</h3>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="text"
              name="fecha"
              value={formData.fecha ? formatToDisplay(formData.fecha) : ''}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-center"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vendedor</label>
            <select
              name="vendedorId"
              value={formData.vendedorId || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
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
            <label className="block text-sm font-medium mb-1">Alumno</label>
            <select
              name="alumnoComisionId"
              value={formData.alumnoComisionId || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione un alumno</option>
              {alu?.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
              <option value="Transferencia">Transferencia de caja</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Método de Pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
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
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto || ''}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </form>

        <div className="flex justify-end space-x-2 mt-6 gap-1">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">
            Cancelar
          </button>
          <button onClick={isSaving ? null : handleSave} className="px-4 py-2 btnAz">
            {isSaving ? <Spinner color="white"></Spinner> : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};
