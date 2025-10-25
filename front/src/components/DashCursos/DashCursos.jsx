import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteCurso, getCursos } from '../../services/Cursos.service';
import Pagination from '../Pagination/Pagination';
import { AREAS } from '../../constants/areas';

const DashCursos = () => {
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
      Swal.fire({
        title: 'Curso Eliminado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      setTableItems((prev) => prev.filter((item) => item.id !== cursoId));
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || error.message,
        icon: 'error',
      });
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
      Swal.fire({
        title: 'Error al cargar cursos',
        text: error.response?.data?.message || error.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos(currentPage, selectedArea);
  }, [currentPage, selectedArea]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Listado de Cursos
          </h3>
          <p className="text-gray-600 mt-2">
            En esta tabla estaran todos cursos para todas las sucursales
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-4 items-center">
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Todas las áreas</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate('/admin/cursos/crear')}
            className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
          >
            Nuevo Curso
          </button>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">Area</th>
              <th className="py-3 px-6">Duración/Meses</th>
              <th className="py-3 px-6">Tipo</th>
              <th className="py-3 px-6">Precio</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando cursos...
                  </div>
                </td>
              </tr>
            ) : tableItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No hay cursos disponibles
                </td>
              </tr>
            ) : (
              tableItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                <td className="px-6 py-4 whitespace-nowrap">{item.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      item.tipo === 'Distancia'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {item.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => clickDelete(item.id)}
                    className="px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                  >
                    {pause[item.id] ? (
                      <svg
                        fill="white"
                        className="w-6 h-6 mx-auto"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            dur="0.75s"
                            values="0 12 12;360 12 12"
                            repeatCount="indefinite"
                          />
                        </path>
                      </svg>
                    ) : (
                      <i className="fa-solid fa-trash"></i>
                    )}
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default DashCursos;