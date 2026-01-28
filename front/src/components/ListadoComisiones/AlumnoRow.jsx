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
  hideDates = false,
}) => {
  return (
    <tr
      className={`${getRowBgColor(item)} hover:shadow-lg hover:scale-[1.01] transition-all duration-300`}
    >
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate(item)}
            className="px-3 py-2 text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 group"
            title="Ver detalles"
          >
            {pause[item.id] ? (
              <Spinner color="white" />
            ) : (
              <i className="fa-solid fa-eye group-hover:scale-110 transition-transform"></i>
            )}
          </button>
          <button
            onClick={() => onTransfer(item)}
            className="px-3 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 group"
            title="Transferir alumno"
          >
            <i className="fa-solid fa-exchange-alt group-hover:rotate-180 transition-transform duration-500"></i>
          </button>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">{item.alumno.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.alumno.dni}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.alumno.tel}</td>
      <td className="px-6 py-4">
        <button
          name={item.state ? 'activo' : 'inactivo'}
          onClick={(e) => onStateChange(e, item.id)}
          className={`text-xs px-4 py-2 rounded text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95
            ${item.state ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}`}
          disabled={pause[item.id]}
        >
          {pause[item.id] ? <Spinner color="white" /> : item.state ? '✓ Activo' : '✕ Inactivo'}
        </button>
      </td>
      {!hideDates &&
        allDates.map((date) => {
          const asistencia = item.asistencias.find((a) => a.fecha.split('T')[0] === date);
          return (
            <td key={date} className="px-6 py-4 text-center text-xl">
              <span
                className={`inline-block transition-transform duration-300 hover:scale-125 ${
                  asistencia?.presente ? 'hover:rotate-12' : 'hover:rotate-[-12deg]'
                }`}
              >
                {asistencia ? (asistencia.presente ? '✔️' : '❌') : '❌'}
              </span>
            </td>
          );
        })}
      {showAsistencia && (
        <td className="text-center py-2">
          <input
            className="w-6 h-6 cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90"
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
  hideDates: PropTypes.bool,
};

export default AlumnoRow;
