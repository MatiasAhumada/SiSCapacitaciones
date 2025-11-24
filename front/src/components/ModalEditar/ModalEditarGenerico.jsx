import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../Spinner/Spinner.jsx';

export const ModalEditarGenerico = ({
  title,
  formData,
  fields,
  onClose,
  onSave,
  onChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const renderField = (field) => {
    const { name, label, type, disabled, options, placeholder } = field;
    const value = formData[name] || '';

    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              disabled ? 'bg-gray-50 text-gray-600' : ''
            }`}
          />
        );
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              disabled ? 'bg-gray-50 text-gray-600' : ''
            }`}
          >
            <option value="">{placeholder || 'Seleccione'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              disabled ? 'bg-gray-50 text-gray-600' : ''
            }`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col transition-all duration-200 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-xl">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <form className="space-y-4 p-6 overflow-y-auto flex-1">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
        </form>

        <div className="flex justify-end gap-3 p-6 pt-4 bg-gray-50 rounded-b-xl">
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
            {isSaving ? <Spinner color="white" /> : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

ModalEditarGenerico.propTypes = {
  title: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'email', 'tel', 'number', 'select', 'textarea']).isRequired,
      disabled: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      placeholder: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
