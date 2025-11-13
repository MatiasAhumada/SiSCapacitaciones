import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { deleteProfesId, getProfesSucId } from '../../services/Profesores.service';
import Pagination from '../Pagination/Pagination';
import Swal from 'sweetalert2';

const DashProfesor = () => {
  const { getSucursalActiva } = useApp();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedProfesor, setExpandedProfesor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const clickDelete = async (e) => {
    e.preventDefault();
    const profesorId = e.target.value;

    setPause((prev) => ({ ...prev, [profesorId]: true }));

    try {
      await deleteProfesId(profesorId);
      Swal.fire({
        title: 'Profesor Eliminado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      setTableItems((prev) => prev.filter((item) => item.id !== profesorId));
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || error.message,
        icon: 'error',
      });
    } finally {
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[profesorId];
        return newPause;
      });
    }
  };

  const toggleComisiones = async (profesorId) => {
    if (expandedProfesor === profesorId) {
      setExpandedProfesor(null);
    } else {
      setExpandedProfesor(profesorId);
    }
  };

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;

    const peticion = async () => {
      setLoading(true);
      try {
        const data = await getProfesSucId(sucursalId, currentPage, 10);
        setTableItems(data.data || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        console.error('Error al cargar profesores:', error);
        setTableItems([]);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar profesores',
          text: error.response?.data?.message || error.message,
        });
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
            Equipo de Profesores
          </h3>
          <p className="text-gray-600 mt-2">
            En esta tabla estaran todos los profesores de esta sucursal
          </p>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">Apellido</th>
              <th className="py-3 px-6">Comisiones</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
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
                    Cargando profesores...
                  </div>
                </td>
              </tr>
            ) : tableItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No hay profesores registrados en esta sucursal
                </td>
              </tr>
            ) : (
              tableItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.cantidadComisiones}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => toggleComisiones(item.id)}
                          className="py-2 px-3 btnAz principal rounded-lg"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                          value={item.id}
                          onClick={clickDelete}
                          disabled={pause[item.id]}
                          className="py-2 px-3 text-white principal bg-red-500 hover:bg-red-600 rounded disabled:opacity-50"
                        >
                          {pause[item.id] ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                            <i className="fa-solid fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedProfesor === item.id && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 bg-gray-50">
                        <div className="text-sm">
                          <h4 className="font-semibold mb-2">Comisiones actuales:</h4>
                          {item.comisiones && item.comisiones.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {item.comisiones.map((comision) => (
                                <li key={comision.id}>{comision.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No tiene comisiones asignadas</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

export default DashProfesor;
