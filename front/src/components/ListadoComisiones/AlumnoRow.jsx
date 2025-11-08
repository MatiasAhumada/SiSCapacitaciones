import PropTypes from 'prop-types';
import { Spinner } from '../Spinner/Spinner';

const AlumnoRow = ({
  item,
  allDates,
  formatFecha,
  getRowBgColor,
  onNavigate,
  onTransfer,
  onStateChange,
  onAsistenciaCheck,
  pause,
  showAsistencia,
}) => {
  return (
    <tr className={`${getRowBgColor(item)} hover:shadow-md transition-shadow`}>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate(item)}
            className="px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-sm hover:shadow-md"
            title="Ver detalles"
          >
            {pause[item.id] ? (
              <Spinner color="white" />
            ) : (
              <i className="fa-solid fa-eye"></i>
            )}
          </button>
          <button
            onClick={() => onTransfer(item)}
            className="px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm hover:shadow-md"
            title="Transferir alumno"
          >
            <i className="fa-solid fa-exchange-alt"></i>
          </button>
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-gray-800">{item.alumno.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.alumno.dni}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.alumno.tel}</td>
      <td className="px-6 py-4">
        <button
          name={item.state ? 'activo' : 'inactivo'}
          onClick={(e) => onStateChange(e, item.id)}
          className={`text-xs px-3 py-1.5 rounded text-white font-medium transition-colors shadow-sm
            ${item.state ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          disabled={pause[item.id]}
        >
          {pause[item.id] ? (
            <Spinner color="white" />
          ) : item.state ? (
            'Activo'
          ) : (
            'Inactivo'
          )}
        </button>
      </td>
      {allDates.map((date) => {
        const asistencia = item.asistencias.find((a) => formatFecha(a.fecha) === date);
        return (
          <td key={date} className="px-6 py-4 text-center text-lg">
            {asistencia ? (asistencia.presente ? '✔️' : '❌') : '❌'}
          </td>
        );
      })}
      {showAsistencia && (
        <td className="text-center py-2">
          <input
            className="w-5 h-5 cursor-pointer"
            style={{ accentColor: '#2563eb' }}
            onChange={() => onAsistenciaCheck(item.id)}
            type="checkbox"
          />
        </td>
      )}
    </tr>
  );
};

AlumnoRow.propTypes = {
  item: PropTypes.object.isRequired,
  allDates: PropTypes.array.isRequired,
  formatFecha: PropTypes.func.isRequired,
  getRowBgColor: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  onAsistenciaCheck: PropTypes.func.isRequired,
  pause: PropTypes.object.isRequired,
  showAsistencia: PropTypes.bool.isRequired,
};

export default AlumnoRow;
