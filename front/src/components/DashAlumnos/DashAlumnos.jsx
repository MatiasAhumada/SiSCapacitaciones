import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteAlumnoId, getAluGlobal } from '../../services/Alumnos.service';
import FilterAlus from '../FilterAlus/FilterAlus';
import { Spinner } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const DashAlumnos = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const click = (item) => {
    const idAlu = item.idAluCom[0];
    if (!idAlu) {
      clientErrorHandler('No hay comisiones asignadas');
      return;
    }
    navigate(`${isAdmin ? '/admin' : '/vendedor'}/alumno/${idAlu}`);
  };

  const clickDelete = async (id) => {
    setPause((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteAlumnoId(id);
      clientSuccessHandler(SUCCESS_MESSAGES.ALUMNO_ELIMINADO);
      setRefreshKey((key) => key + 1);
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_ALUMNOS
      );
    } finally {
      setPause((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError('');

    getAluGlobal(currentPage, itemsPerPage, filtrosActivos)
      .then((response) => {
        if (!active) return;
        setTableItems(response.data || []);
        setTotalItems(response.totalItems || 0);
        setTotalPages(Math.max(response.totalPages || 1, 1));
        setCurrentPage(response.currentPage || 1);
      })
      .catch((error) => {
        if (!active) return;
        setTableItems([]);
        setTotalItems(0);
        setTotalPages(1);
        setLoadError(
          error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_ALUMNOS
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage, itemsPerPage, filtrosActivos, refreshKey]);

  const filtrarAlumnos = async (filtros) => {
    const filtrosLimpios = Object.fromEntries(
      Object.entries(filtros).map(([key, value]) => [key, String(value).trim()])
    );
    const hayFiltros = Object.values(filtrosLimpios).some(Boolean);
    setFiltrosActivos(hayFiltros ? filtrosLimpios : {});
    setCurrentPage(1);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Listado de alumnos.
          </h3>
          <p className="text-gray-600 mt-2">
            Alumnos de todas las sucursales.
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center">
          <FilterAlus onFiltrar={filtrarAlumnos} />
        </div>
      </div>
      <div className="mt-8 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[680px] table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6">Nombre y Apellido</th>
              <th className="py-3 px-6">DNI</th>
              <th className="py-3 px-6">Teléfono</th>
              <th className="py-3 px-6">Comisión/es</th>
              <th className="py-3 px-6">Certificados</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y" aria-live="polite">
            {isLoading ? (
              <tr>
                <td className="px-6 py-8" colSpan={6} role="status">
                  Cargando alumnos…
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td className="px-6 py-8 text-red-600" colSpan={6} role="alert">
                  No se pudo cargar el listado: {loadError}
                </td>
              </tr>
            ) : tableItems.length === 0 ? (
              <tr>
                <td className="px-6 py-8" colSpan={6}>
                  No se encontraron alumnos para estos filtros.
                </td>
              </tr>
            ) : (
              tableItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.tel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.cantidadComisiones}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.cantidadCertificados}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      aria-label="Ver alumno"
                      onClick={() => click(item)}
                      className="px-4 py-2 ms-3 btnAz principal md:text-sm rounded"
                    >
                      <i aria-hidden="true" className="fa-solid fa-plus"></i>
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        aria-label="Eliminar alumno"
                        disabled={!!pause[item.id]}
                        onClick={() => clickDelete(item.id)}
                        className="px-4 py-2 ms-3 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded disabled:opacity-60"
                      >
                        {pause[item.id] ? (
                          <Spinner color="white" />
                        ) : (
                          <i aria-hidden="true" className="fa-solid fa-x"></i>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && !loadError && totalItems > 0 && (
        <p className="mt-3 text-center text-sm text-gray-600" aria-live="polite">
          {totalItems} alumnos en el listado.
        </p>
      )}
      {!isLoading && !loadError && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default DashAlumnos;
