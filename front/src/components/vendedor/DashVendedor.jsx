import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getVendSucID } from '../queris/queris';

const DashVendedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tableItems, setTableItems] = useState([]);

  const location = useLocation();

  const isSubRoute = location.pathname.includes('crear') || location.pathname.includes('info');

  const click = (idVend) => {
    navigate(`/adm/${id}/vendedores/info`, {
      state: { id: idVend },
    });
  };
  useEffect(() => {
    const peticion = async () => {
      await getVendSucID(id).then((data) => {
        setTableItems(data);
      });
    };
    peticion();
  }, [id]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
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
                onClick={() => navigate(`/adm/${id}/vendedores/crear`)}
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
                {tableItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.tel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.inscripciones?.length || 0}
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default DashVendedor;
