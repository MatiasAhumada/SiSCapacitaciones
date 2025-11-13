import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ComisionSelector = ({
  comisiones,
  onComisionSelect,
  searchValue,
  onSearchChange,
  showDropdown,
  onShowDropdown,
  placeholder = 'Buscar comisión...',
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onShowDropdown]);

  const filteredComisiones = comisiones.filter((c) => {
    const comisionText = `${c.name} - ${c.curso?.name} (${c.day} ${c.hour?.start}-${c.hour?.end})`;
    return comisionText.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => onShowDropdown(true)}
        className="w-full bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg p-2.5"
        placeholder={placeholder}
        required
      />
      {showDropdown && filteredComisiones.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredComisiones.map((comision) => (
            <div
              key={comision.id}
              onClick={() => onComisionSelect(comision)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm text-gray-700 hover:text-blue-700 transition-colors"
            >
              <div className="font-medium">{comision.name}</div>
              <div className="text-xs text-gray-500">
                {comision.curso?.name} • {comision.day} {comision.hour?.start}-{comision.hour?.end}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ComisionSelector.propTypes = {
  comisiones: PropTypes.array.isRequired,
  onComisionSelect: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  onShowDropdown: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default ComisionSelector;
