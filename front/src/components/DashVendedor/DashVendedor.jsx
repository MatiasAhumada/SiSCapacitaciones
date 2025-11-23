import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getVendSucID } from '../../services/Vendedores.service';
import Pagination from '../Pagination/Pagination';
import { clientErrorHandler } from '../../utils/notificationHandler';
import { ERROR_MESSAGES } from '../../constants/messages';

const DashVendedor = () => {
  const { getSucursalActiva } = useApp();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const click = (idVend) => {
    navigate(`/admin/vendedores/info/${idVend}`);
  };

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;

    const peticion = async () => {
      setLoading(true);
      try {
        const data = await getVendSucID(sucursalId, currentPage, 10);
        setTableItems(data.data || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        console.error('Error al cargar vendedores:', error);
        setTableItems([]);
        clientErrorHandler(error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_VENDEDORES);
      } finally {
        setLoading(false);
      }
    };
    peticion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getSucursalActiva()?.id]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Equipo de vendedores
          </h3>
          <p className="text-gray-600 mt-2">
            En esta tabla estaran todos los vendedores de esta sucursal
          </p>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Numero de telefono</th>
              <th className="py-3 px-6">Cursos vendidos</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                    Cargando vendedores...
                  </div>
                </td>
              </tr>
            ) : tableItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay vendedores registrados en esta sucursal
                </td>
              </tr>
            ) : (
              tableItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.tel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.inscripciones?.length || 0}</td>
                  <td className="text-right px-6 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => click(item.id)}
                      className="py-2 px-3 btnAz principal rounded-lg"
                    >
                      <i className="fa-solid fa-plus"></i>
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

export default DashVendedor;
