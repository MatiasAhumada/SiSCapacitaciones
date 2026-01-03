import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllInscripciones, getInscripcionesByVendedor, descargarPDFInscripcion } from '../../services/Inscripciones.service';
import { getVendedores } from '../../services/Vendedores.service';
import { clientErrorHandler } from '../../utils/notificationHandler';
import { Spinner } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';

const DashInscripciones = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statsByVendedor, setStatsByVendedor] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [selectedVendedor, setSelectedVendedor] = useState('');
  const [selectedFecha, setSelectedFecha] = useState('');
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    if (isAdmin) {
      const cargarVendedores = async () => {
        try {
          const data = await getVendedores();
          setVendedores(data);
        } catch (error) {
          clientErrorHandler(error?.response?.data?.message || error?.message);
        }
      };
      cargarVendedores();
    }
  }, [isAdmin]);

  useEffect(() => {
    const cargarInscripciones = async () => {
      setLoading(true);
      try {
        let response;
        if (isAdmin) {
          response = await getAllInscripciones(currentPage, 10, selectedVendedor, selectedFecha);
          if (response.statsByVendedor) {
            setStatsByVendedor(response.statsByVendedor);
          }
        } else {
          response = await getInscripcionesByVendedor(user.id, currentPage, 10);
        }
        setInscripciones(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (error) {
        clientErrorHandler(error?.response?.data?.message || error?.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      cargarInscripciones();
    }
  }, [user?.id, currentPage, isAdmin, selectedVendedor, selectedFecha]);

  const handlePrint = async (inscripcion) => {
    try {
      const blob = await descargarPDFInscripcion(inscripcion.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscripcion-${inscripcion.alumno?.name || inscripcion.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
    }
  };

  const handleClearFilters = () => {
    setSelectedVendedor('');
    setSelectedFecha('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Inscripciones' : 'Mis Inscripciones'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gestiona todas las inscripciones' : 'Gestiona las inscripciones realizadas'}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => navigate('/vendedor/inscribir')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <i className="fa-solid fa-plus"></i>
            Inscribir
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor</label>
              <select
                value={selectedVendedor}
                onChange={(e) => {
                  setSelectedVendedor(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los vendedores</option>
                {vendedores.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={selectedFecha}
                onChange={(e) => {
                  setSelectedFecha(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {(selectedVendedor || selectedFecha) && (
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition-colors duration-200 flex items-center justify-center"
                  title="Limpiar Filtros"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && statsByVendedor.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statsByVendedor.map((vendedor) => (
            <div
              key={vendedor.id}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-user text-white"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 truncate">{vendedor.name}</p>
                  <p className="text-xl font-bold text-gray-900">{vendedor.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-chart-bar text-white text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de Inscripciones</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Fecha Registro
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Vendedor
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Alumno
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Comisión
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inscripciones.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "6" : "5"} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <i className="fa-solid fa-inbox text-gray-300 text-6xl mb-4"></i>
                      <p className="text-gray-500 text-lg font-medium">No hay inscripciones registradas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inscripciones.map((inscripcion) => (
                  <tr key={inscripcion.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inscripcion.fechaRegistro).toLocaleDateString('es-AR')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inscripcion.vendedor?.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inscripcion.alumno?.name}</div>
                      <div className="text-sm text-gray-500">DNI: {inscripcion.alumno?.dni}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.comision?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.sucursal?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handlePrint(inscripcion)}
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        title="Imprimir"
                      >
                        <i className="fa-solid fa-print"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default DashInscripciones;
