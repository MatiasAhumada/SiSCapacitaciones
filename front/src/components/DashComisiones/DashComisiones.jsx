import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Swal from 'sweetalert2';
import { getCursos } from '../../services/Cursos.service';
import Pagination from '../Pagination/Pagination';
import { getProfes } from '../../services/Profesores.service';
import {
  deleteComision,
  getComisionBySucursal,
  getComisiones,
  putComision,
} from '../../services/Comisiones.service';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [, setPause] = useState({});

  const clickDelete = async (id) => {
    const comisionId = id;

    setPause((prev) => ({ ...prev, [comisionId]: true }));
    await deleteComision(id).then(() => {
      try {
        Swal.fire({
          title: 'Comision Eliminada',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause((prev) => {
            const newPause = { ...prev };
            delete newPause[comisionId];
            return newPause;
          });
          setTableItems((prev) => prev.filter((item) => item.id !== comisionId));
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const cargarComisiones = async (page = 1, name = '', day = '') => {
    setLoading(true);
    try {
      let data;
      if (user?.isadmin) {
        // Admin: solo comisiones de su sucursal activa
        const sucursalId = getSucursalActiva()?.id;
        if (!sucursalId) return;
        data = await getComisionBySucursal(sucursalId, page, 10, name, day);
      } else {
        // Vendedor: todas las comisiones
        data = await getComisiones(page, 10, name, day);
      }
      setTableItems(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar comisiones',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cursosData, profesoresData] = await Promise.all([getCursos(), getProfes()]);
        setCursos(cursosData.data || cursosData);
        setProfesores(profesoresData);
      } catch {
        console.error('Error al cargar datos');
      }
    };
    cargarDatos();
    cargarComisiones(currentPage, searchName, selectedDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchName, selectedDay]);

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
      Swal.fire({
        title: 'Comisión actualizada',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
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
    } catch {
      Swal.fire({ title: 'Error al actualizar', icon: 'error' });
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
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Listado de Comisiones
          </h3>
          <p className="text-gray-600 mt-2">
            En esta tabla estaran las comisiones de esta sucursal
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
          {user?.isadmin && (
            <button
              onClick={() => navigate('/admin/comisiones/crear')}
              className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
            >
              Nueva Comision
            </button>
          )}
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">Dia</th>
              <th className="py-3 px-6">Hora</th>
              <th className="py-3 px-6">Curso</th>
              <th className="py-3 px-6">Profesor</th>
              <th className="py-3 px-6">Alumnos</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
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
                    Cargando comisiones...
                  </div>
                </td>
              </tr>
            ) : tableItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No hay comisiones disponibles
                </td>
              </tr>
            ) : (
              tableItems?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    {editing === item.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        name="name"
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                          className="border rounded px-2"
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editing === item.id ? (
                      <>
                        <select
                          name="start"
                          value={editData.hour?.start || ''}
                          onChange={handleChange}
                          className="border rounded px-2"
                        >
                          <option value=""> Inicio</option>
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
                          className="border rounded px-2"
                        >
                          <option value=""> Fin</option>
                          {horarios.map((horario, index) => (
                            <option key={index} value={horario}>
                              {horario}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      `${item?.hour?.start || 'Hora no definida'} - ${item?.hour?.end || 'Hora no definida'}`
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editing === item.id ? (
                      <select
                        name="cursoId"
                        onChange={handleChange}
                        className="border rounded px-2"
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
                  <td className="px-6 py-4">
                    {editing === item.id ? (
                      <select
                        name="profesorId"
                        onChange={handleChange}
                        className="border rounded px-2"
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
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumnoComisiones?.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        navigate(
                          user?.isadmin
                            ? `/admin/comisiones/${item.id}`
                            : `/vendedor/comisiones/${item.id}`
                        )
                      }
                      className="px-4 py-2 text-white principal bg-blue-500 hover:bg-blue-600 md:text-sm rounded"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>

                    {user?.isadmin && (
                      <>
                        {editing === item.id ? (
                          <button
                            onClick={() => handleSave(item.id)}
                            className="px-4 py-2 text-white bg-green-500 rounded ms-3"
                          >
                            <i className="fa-solid fa-floppy-disk"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-4 py-2 text-white btnAz rounded ms-3"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        )}
                        <button
                          onClick={() => clickDelete(item.id)}
                          className="px-4 py-2 ms-3 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                        >
                          <i className="fa-solid fa-trash"></i>
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default DashComisiones;
