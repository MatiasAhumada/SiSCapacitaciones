import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getVendSucID } from '../../services/Vendedores.service';
import Swal from 'sweetalert2';

const DashVendedor = () => {
  const { user } = useAuth();
  const { getSucursalActiva } = useApp();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const click = (idVend) => {
    navigate(`/admin/vendedores/info/${idVend}`);
  };

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;

    const peticion = async () => {
      setLoading(true);
      try {
        const data = await getVendSucID(sucursalId);
        setTableItems(data || []);
      } catch (error) {
        console.error('Error al cargar vendedores:', error);
        setTableItems([]);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar vendedores',
          text: error.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    peticion();
  }, [getSucursalActiva()?.id]);

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
        <div className="mt-3 md:mt-0">
          <button
            onClick={() => navigate('/admin/vendedores/crear')}
            className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
          >
            Nuevo Vendedor
          </button>
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
    </div>
  );
};

export default DashVendedor;
