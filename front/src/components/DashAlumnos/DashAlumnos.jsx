import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { deleteAlumnoId, getAluSucID } from '../../services/Alumnos.service';
import FilterAlus from '../FilterAlus/FilterAlus';
import { Spinner } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const DashAlumnos = () => {
  const { getSucursalActiva } = useApp();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFiltered, setIsFiltered] = useState(false);

  const click = (item) => {
    const idAlu = item.idAluCom[0];
    if (!idAlu) {
      clientErrorHandler('No hay comisiones asignadas');
      return;
    }
    navigate(`/admin/alumno/${idAlu}`);
  };

  const clickDelete = async (id) => {
    setPause((prev) => ({ ...prev, [id]: true }));
    await deleteAlumnoId(id).then(() => {
      clientSuccessHandler(SUCCESS_MESSAGES.ALUMNO_ELIMINADO);
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[id];
        return newPause;
      });
      peticionAlumnos(currentPage);
    });
  };

  const peticionAlumnos = async (page = 1, perPage = itemsPerPage, filtros = {}) => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;
    try {
      const data = await getAluSucID(sucursalId, page, perPage, filtros);
      setTableItems(data.data);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_ALUMNOS
      );
    }
  };

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (sucursalId) {
      peticionAlumnos(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getSucursalActiva()?.id]);

  const filtrarAlumnos = async (filtros, setPaused) => {
    setPaused(true);
    try {
      const hayFiltros = Object.values(filtros).some((v) => v !== '');
      if (!hayFiltros) {
        setItemsPerPage(10);
        setCurrentPage(1);
        await peticionAlumnos(1, 10);
        setIsFiltered(false);
        return;
      }
      setCurrentPage(1);
      await peticionAlumnos(1, itemsPerPage, filtros);
      setIsFiltered(true);
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_ALUMNOS
      );
    } finally {
      setPaused(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Listado de alumnos.
          </h3>
          <p className="text-gray-600 mt-2">
            En esta tabla estaran todos los alumnos de esta sucursal
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center">
          <FilterAlus onFiltrar={filtrarAlumnos} />
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6">Nombre y Apellido</th>
              <th className="py-3 px-6">DNI</th>
              <th className="py-3 px-6">Telefono</th>
              <th className="py-3 px-6">Comision/s</th>
              <th className="py-3 px-6">Certificados</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {tableItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.dni}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.tel}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.cantidadComisiones}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.cantidadCertificados}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => click(item)}
                    className="px-4 py-2 ms-3 btnAz principal md:text-sm rounded"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                  <button
                    onClick={() => clickDelete(item.id)}
                    className="px-4 py-2 ms-3 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                  >
                    {pause[item.id] ? <Spinner color="white" /> : <i className="fa-solid fa-x"></i>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isFiltered && (
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
