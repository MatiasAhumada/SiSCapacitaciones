import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCurso, getCursos } from '../../services/Cursos.service';
import Pagination from '../Pagination/Pagination';
import { AREAS } from '../../constants/areas';
import { useAuth } from '../../context/AuthContext';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const DashCursos = () => {
  const { user } = useAuth();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clickDelete = async (cursoId) => {
    setPause((prev) => ({ ...prev, [cursoId]: true }));

    try {
      await deleteCurso(cursoId);
      clientSuccessHandler(SUCCESS_MESSAGES.CURSO_ELIMINADO);
      setTableItems((prev) => prev.filter((item) => item.id !== cursoId));
    } catch (error) {
      clientErrorHandler(error.response?.data?.message || error.message);
    } finally {
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[cursoId];
        return newPause;
      });
    }
  };

  const cargarCursos = async (page = 1, area = '') => {
    setLoading(true);
    try {
      const data = await getCursos(page, 10, area);
      setTableItems(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_CURSOS
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos(currentPage, selectedArea);
  }, [currentPage, selectedArea]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 shadow-lg mb-6 border border-indigo-100">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 principal">
              Listado de Cursos
            </h3>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              En esta tabla estarán todos los cursos para todas las sucursales
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 sm:w-auto px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md text-sm cursor-pointer"
            >
              <option value="">Todas las áreas</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-center">
            <thead className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 text-gray-700 font-semibold border-b-2 border-indigo-200">
              <tr>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Nombre</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Área</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm hidden sm:table-cell">Duración</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Tipo</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Precio</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : tableItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl text-gray-300 mb-2"></i>
                    <p>No hay cursos disponibles</p>
                  </td>
                </tr>
              ) : (
                tableItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-800 text-xs md:text-sm">{item.name}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-semibold rounded shadow-sm ${
                          item.area === 'Digital'
                            ? 'bg-blue-200 text-blue-800'
                            : item.area === 'Idiomas'
                              ? 'bg-yellow-200 text-yellow-800'
                              : item.area === 'Administrativa'
                                ? 'bg-red-200 text-red-800'
                                : item.area === 'Belleza'
                                  ? 'bg-pink-200 text-pink-800'
                                  : item.area === 'Técnica'
                                    ? 'bg-purple-200 text-purple-800'
                                    : item.area === 'Salud'
                                      ? 'bg-green-200 text-green-800'
                                      : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {item.area}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell text-xs md:text-sm">
                      <span className="inline-flex items-center gap-1">
                        <i className="fa-solid fa-clock text-blue-600"></i>
                        {item.duration} meses
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-semibold rounded shadow-sm ${
                          item.tipo === 'Distancia'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap font-bold text-green-600 text-xs md:text-sm">
                      ${item.price}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <button
                        onClick={() => clickDelete(item.id)}
                        disabled={pause[item.id]}
                        className="px-2 md:px-3 py-1.5 md:py-2 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Eliminar"
                      >
                        {pause[item.id] ? (
                          <svg
                            className="animate-spin h-4 w-4 md:h-5 md:w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <i className="fa-solid fa-trash text-xs md:text-sm group-hover:scale-110 transition-transform"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default DashCursos;
