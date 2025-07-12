import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteAlumnoId, getAluSucID } from '../../queris/queris';

const DashAlumnos = () => {
  const [tableItems, setTableItems] = useState([]);

  const [pause, setPause] = useState({});

  const navigate = useNavigate();

  const { id } = useParams();

  const location = useLocation();

  const isSubRoute = location.pathname.includes('crear');
  const click = (item) => {
    console.log(item.idAluCom[0]);
    const idAlu = item.idAluCom[0];
    if (!idAlu) {
      Swal.fire({
        title: 'No hay comisiones asignadas',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    navigate(`/adm/${id}/alumno/${idAlu}`, {
      state: { id: idAlu },
    });
  };
  const clickDelete = async (id) => {
    const alumnoId = id;

    setPause((prev) => ({ ...prev, [alumnoId]: true }));

    await deleteAlumnoId(id).then(() => {
      try {
        Swal.fire({
          title: 'Alumno Eliminado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause((prev) => {
            const newPause = { ...prev };
            delete newPause[alumnoId];
            return newPause;
          });
          setTableItems((prev) => prev.filter((item) => item.id !== alumnoId));
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    const peticion = async () => {
      await getAluSucID(id).then((data) => {
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
                Listado de alumnos.
              </h3>
              <p className="text-gray-600 mt-2">
                En esta tabla estaran todos los alumnos de esta sucursal
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <button
                onClick={() => navigate(`/adm/${id}/alumnos/crear`)}
                className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
              >
                Nuevo Alumno
              </button>
            </div>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
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
                      {/* BOTON VER MAS */}
                      <button
                        type="button"
                        value={item.id}
                        onClick={() => click(item)}
                        className="px-4 py-2 ms-3 btnAz principal md:text-sm rounded"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>

                      {/* BOTON BORRAR */}
                      <button
                        value={item.id}
                        onClick={() => clickDelete(item.id)}
                        className=" px-4 py-2 ms-3 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
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
                          <i className="fa-solid fa-x"></i>
                        )}
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

export default DashAlumnos;
