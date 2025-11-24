import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getCursos } from '../../services/Cursos.service';
import { getSucursales } from '../../services/Sucursales.service';
import Pagination from '../Pagination/Pagination';
import { getProfes } from '../../services/Profesores.service';
import {
  deleteComision,
  getComisionBySucursal,
  getComisiones,
  putComision,
  editStatusComision,
} from '../../services/Comisiones.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const DashComisiones = () => {
  const { user } = useAuth();
  const { getSucursalActiva } = useApp();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    day: '',
    hour: '',
    cursoId: '',
    profesorId: '',
    sucursalId: user?.sucursalId,
  });
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [loading, setLoading] = useState(true);
  const [, setPause] = useState({});

  const clickDelete = async (id) => {
    const comisionId = id;

    setPause((prev) => ({ ...prev, [comisionId]: true }));
    try {
      await deleteComision(id);
      clientSuccessHandler(SUCCESS_MESSAGES.COMISION_ELIMINADA);
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[comisionId];
        return newPause;
      });
      setTableItems((prev) => prev.filter((item) => item.id !== comisionId));
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[comisionId];
        return newPause;
      });
    }
  };

  const cargarComisiones = async (page = 1, name = '', day = '', status = '', sucursalId = '') => {
    setLoading(true);
    try {
      let data;
      if (user?.isadmin) {
        const activeSucursalId = getSucursalActiva()?.id;
        if (!activeSucursalId) return;
        data = await getComisionBySucursal(activeSucursalId, page, 10, name, day, false, status);
      } else {
        data = await getComisiones(page, 10, name, day, false, status, sucursalId);
      }
      setTableItems(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_COMISIONES
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cursosData, profesoresData, sucursalesData] = await Promise.all([
          getCursos(),
          getProfes(),
          getSucursales()
        ]);
        setCursos(cursosData.data || cursosData);
        setProfesores(profesoresData);
        setSucursales(sucursalesData || []);
      } catch (error) {
        clientErrorHandler(
          error?.response?.data?.message || error?.message || ERROR_MESSAGES.ERROR_CARGAR_DATOS
        );
      }
    };
    cargarDatos();
    cargarComisiones(currentPage, searchName, selectedDay, selectedStatus, selectedSucursal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchName, selectedDay, selectedStatus, selectedSucursal]);

  const handleEdit = (comision) => {
    setEditing(comision.id);
    setEditData({
      name: comision.name,
      day: comision.day,
      hour: comision.hour,
      cursoId: comision.curso?.id || '',
      profesorId: comision.profesor?.id || '',
      sucursalId: comision.sucursal?.id || user?.sucursalId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
      hour: {
        ...prevData.hour,
        [name]: value,
      },
    }));
  };

  const handleSave = async (comisionId) => {
    setPause((prev) => ({ ...prev, [comisionId]: true }));
    try {
      await putComision(comisionId, editData);
      clientSuccessHandler(SUCCESS_MESSAGES.COMISION_ACTUALIZADA);
      setTableItems((prev) =>
        prev.map((item) =>
          item.id === comisionId
            ? {
                ...item,
                ...editData,
                curso: cursos.find((c) => c.id === editData.cursoId) || item.curso,
                profesor: profesores.find((p) => p.id === editData.profesorId) || item.profesor,
              }
            : item
        )
      );
    } catch (error) {
      clientErrorHandler(
        error?.response?.data?.message || error?.message || ERROR_MESSAGES.ERROR_ACTUALIZAR_PAGO
      );
    } finally {
      setPause((prev) => ({ ...prev, [comisionId]: false }));
      setEditing(null);
    }
  };

  const horarios = Array.from({ length: (22 - 8) * 2 + 1 }, (_, i) => {
    const horas = Math.floor(8 + i / 2);
    const minutos = i % 2 === 0 ? '00' : '30';
    return `${horas}:${minutos}`;
  });
  const dias = [
    { value: 'Lunes' },
    { value: 'Martes' },
    { value: 'Miercoles' },
    { value: 'Jueves' },
    { value: 'Viernes' },
    { value: 'Sabado' },
    { value: 'Domingo' },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 shadow-lg mb-6 border border-indigo-100">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 principal">
              Listado de Comisiones
            </h3>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              En esta tabla estarán las comisiones de esta sucursal
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="relative group flex-1">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md text-sm"
              />
            </div>
            <select
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setCurrentPage(1);
              }}
              className="sm:w-auto px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md text-sm cursor-pointer"
            >
              <option value="">Todos los días</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miercoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sabado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="sm:w-auto px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md text-sm cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
            </select>
            {!user?.isadmin && (
              <select
                value={selectedSucursal}
                onChange={(e) => {
                  setSelectedSucursal(e.target.value);
                  setCurrentPage(1);
                }}
                className="sm:w-auto px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md text-sm cursor-pointer"
              >
                <option value="">Todas las sucursales</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.name}
                  </option>
                ))}
              </select>
            )}
            {user?.isadmin && (
              <button
                onClick={() => navigate('/admin/comisiones/crear')}
                className="sm:w-auto px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 principal font-medium flex items-center justify-center gap-2 group"
              >
                <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
                <span>Nueva Comisión</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-center">
            <thead className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 text-gray-700 font-semibold border-b-2 border-indigo-200">
              <tr>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Nombre</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Día</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm hidden lg:table-cell">Hora</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm hidden xl:table-cell">Curso</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm hidden xl:table-cell">Profesor</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm hidden sm:table-cell">Alumnos</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Estado</th>
                <th className="py-3 md:py-5 px-3 md:px-6 text-xs md:text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
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
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl text-gray-300 mb-2"></i>
                    <p>No hay comisiones disponibles</p>
                  </td>
                </tr>
              ) : (
                tableItems?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-800 text-xs md:text-sm">
                      {editing === item.id ? (
                        <input
                          type="text"
                          value={editData.name}
                          name="name"
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-semibold rounded shadow-sm ${
                          item.day === 'Lunes'
                            ? 'bg-blue-200 text-blue-800'
                            : item.day === 'Martes'
                              ? 'bg-yellow-200 text-yellow-800'
                              : item.day === 'Miercoles'
                                ? 'bg-red-200 text-red-800'
                                : item.day === 'Jueves'
                                  ? 'bg-pink-200 text-pink-800'
                                  : item.day === 'Viernes'
                                    ? 'bg-purple-200 text-purple-800'
                                    : item.day === 'Sabado'
                                      ? 'bg-green-200 text-green-800'
                                      : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {editing === item.id ? (
                          <select
                            name="day"
                            value={editData?.day || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-1 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="">Seleccionar</option>
                            {dias.map((dia, idx) => (
                              <option key={idx} value={dia.value}>
                                {dia.value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.day
                        )}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                      {editing === item.id ? (
                        <>
                          <select
                            name="start"
                            value={editData.hour?.start || ''}
                            onChange={handleChange}
                            className="w-20 border border-gray-300 rounded px-1 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="">Inicio</option>
                            {horarios.map((horario, index) => (
                              <option key={index} value={horario}>
                                {horario}
                              </option>
                            ))}
                          </select>
                          <span>-</span>
                          <select
                            name="end"
                            value={editData.hour?.end || ''}
                            onChange={handleChange}
                            className="w-20 border border-gray-300 rounded px-1 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="">Fin</option>
                            {horarios.map((horario, index) => (
                              <option key={index} value={horario}>
                                {horario}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        `${item?.hour?.start || 'N/A'} - ${item?.hour?.end || 'N/A'}`
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden xl:table-cell">
                      {editing === item.id ? (
                        <select
                          name="cursoId"
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">{item.curso?.name}</option>
                          {cursos.map((curso) => (
                            <option key={curso.id} value={curso.id}>
                              {curso.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.curso?.name
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden xl:table-cell">
                      {editing === item.id ? (
                        <select
                          name="profesorId"
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {profesores.map((profesor) => (
                            <option key={profesor.id} value={profesor.id}>
                              {profesor.name} {profesor.apellido}
                            </option>
                          ))}
                        </select>
                      ) : (
                        `${item.profesor?.name} ${item.profesor?.apellido}`
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs md:text-sm">
                        {item.alumnoComisiones?.length}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <button
                        onClick={async () => {
                          try {
                            await editStatusComision({ status: !item.status, comisionId: item.id });
                            setTableItems((prev) =>
                              prev.map((c) => (c.id === item.id ? { ...c, status: !c.status } : c))
                            );
                            clientSuccessHandler('Estado actualizado');
                          } catch (error) {
                            clientErrorHandler(error?.response?.data?.message || error?.message);
                          }
                        }}
                        className={`px-2 md:px-4 py-1 md:py-2 text-white text-xs font-semibold rounded shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ${
                          item.status ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        }`}
                      >
                        <span className="hidden md:inline">{item.status ? '✓ Activa' : '✕ Inactiva'}</span>
                        <span className="md:hidden">{item.status ? '✓' : '✕'}</span>
                      </button>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          navigate(
                            user?.isadmin
                              ? `/admin/comisiones/${item.id}`
                              : `/vendedor/comisiones/${item.id}`
                          )
                        }
                        className="px-2 md:px-3 py-1.5 md:py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                        title="Ver detalles"
                      >
                        <i className="fa-solid fa-eye text-xs md:text-sm group-hover:scale-110 transition-transform"></i>
                      </button>

                      {user?.isadmin && (
                        <>
                          {editing === item.id ? (
                            <button
                              onClick={() => handleSave(item.id)}
                              className="px-2 md:px-3 py-1.5 md:py-2 ms-1 md:ms-2 text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                              title="Guardar"
                            >
                              <i className="fa-solid fa-floppy-disk text-xs md:text-sm group-hover:scale-110 transition-transform"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-2 md:px-3 py-1.5 md:py-2 ms-1 md:ms-2 text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                              title="Editar"
                            >
                              <i className="fa-solid fa-pen text-xs md:text-sm group-hover:scale-110 transition-transform"></i>
                            </button>
                          )}
                          <button
                            onClick={() => clickDelete(item.id)}
                            className="px-2 md:px-3 py-1.5 md:py-2 ms-1 md:ms-2 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                            title="Eliminar"
                          >
                            <i className="fa-solid fa-trash text-xs md:text-sm group-hover:scale-110 transition-transform"></i>
                          </button>
                        </>
                      )}
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

export default DashComisiones;
