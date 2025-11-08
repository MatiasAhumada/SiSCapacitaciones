import PropTypes from 'prop-types';

const AsistenciaControls = ({ 
  asistencia, 
  onAsistenciaChange, 
  showAsistencia 
}) => {
  if (!showAsistencia) return null;

  return (
    <div className="flex flex-col gap-3">
      <select
        value={asistencia.estadoProfesor}
        onChange={(e) => onAsistenciaChange({ estadoProfesor: e.target.value })}
        className={`px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition-all duration-200 w-full 
          ${asistencia.estadoProfesor === '' ? 'text-gray-400' : 'text-gray-900'}`}
      >
        <option value="" className="text-gray-400">
          Asistencia profesor
        </option>
        <option value="Presente" className="text-gray-900">
          Presente
        </option>
        <option value="Ausente" className="text-gray-900">
          Ausente
        </option>
        <option value="Feriado" className="text-gray-900">
          Feriado
        </option>
      </select>

      {asistencia.estadoProfesor === 'Ausente' && (
        <input
          type="text"
          placeholder="Descripción"
          value={asistencia.descripcion}
          onChange={(e) => onAsistenciaChange({ descripcion: e.target.value })}
          className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200 w-full"
        />
      )}
    </div>
  );
};

AsistenciaControls.propTypes = {
  asistencia: PropTypes.object.isRequired,
  onAsistenciaChange: PropTypes.func.isRequired,
  showAsistencia: PropTypes.bool.isRequired,
};

export default AsistenciaControls;
