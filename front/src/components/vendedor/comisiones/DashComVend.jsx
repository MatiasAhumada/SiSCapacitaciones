import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  deleteComision,
  getComisiones,
  getCursos,
  getProfes,
  putComision,
} from '../../queris/queris';

const DashComVend = () => {
  const { id, idVend } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    day: '',
    hour: { start: '', end: '' },
    cursoId: '',
    profesorId: '',
    sucursalId: id,
  });
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [search, setSearch] = useState('');

  const isSubRoute = location.pathname.includes('crear');

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

  const filteredItems = tableItems?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const sucursal = async () => {
      await getComisiones().then((data) => {
        setTableItems(data);
      });
    };
    const cursos = async () => {
      await getCursos().then((data) => {
        setCursos(data);
      });
    };
    const profesores = async () => {
      await getProfes().then((data) => {
        setProfesores(data);
      });
    };
    profesores();
    cursos();
    sucursal();
  }, []);

  const handleEdit = (comision) => {
    setEditing(comision.id);
    setEditData({
      name: comision.name,
      day: comision.day,
      hour: comision.hour,
      cursoId: comision.curso?.id || '',
      profesorId: comision.profesor?.id || '',
      sucursalId: comision.sucursal?.id || id,
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
    } catch (error) {
      Swal.fire({ title: 'Error al actualizar', icon: 'error' });
    } finally {
      setPause((prev) => ({ ...prev, [comisionId]: false }));
      setEditing(null);
    }
  };
  const dias = [
    { value: 'Lunes' },
    { value: 'Martes' },
    { value: 'Miercoles' },
    { value: 'Jueves' },
    { value: 'Viernes' },
    { value: 'Sabado' },
    { value: 'Domingo' },
  ];
  const horarios = Array.from({ length: (22 - 8) * 2 + 1 }, (_, i) => {
    const horas = Math.floor(8 + i / 2);
    const minutos = i % 2 === 0 ? '00' : '30';
    return `${horas}:${minutos}`;
  });
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
          <div className="items-start justify-between md:flex md:flex-row flex-col gap-4">
            <div className="max-w-lg order-1 md:order-none">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
                Listado de Comisiones
              </h3>
              <p className="text-gray-600 mt-2">
                En esta tabla estarán las comisiones de esta sucursal
              </p>
            </div>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-1 text-sm order-2 md:order-none md:mt-0 mt-2"
            />

            <div className="order-3 md:order-none">
              <button
                onClick={() => navigate(`/${idVend}/comisiones/crear`)}
                className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
              >
                Nueva Comision
              </button>
            </div>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Nombre</th>
                  <th className="py-3 px-6">Dia</th>
                  <th className="py-3 px-6">Hora</th>
                  {/* <th className="py-3 px-6">Curso</th> */}
                  <th className="py-3 px-6">Profesor</th>
                  <th className="py-3 px-6">Alumnos</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {filteredItems?.map((item) => (
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
                      {/* BOTON VER MAS  */}
                      <button
                        value={item.id}
                        onClick={() => navigate(`/${idVend}/comisiones/${item.id}`)}
                        className=" px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
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
                          <i className="fa-solid fa-plus"></i>
                        )}
                      </button>

                      {editing === item.id ? (
                        // BOTON GUARDAR

                        <button
                          onClick={() => handleSave(item.id)}
                          className="px-4 py-2 text-white bg-green-500 rounded ms-3"
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
                            <i className="fa-solid fa-floppy-disk"></i>
                          )}
                        </button>
                      ) : (
                        // BOTON EDITAR
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 text-white btnAz rounded ms-3"
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
                            <i className="fa-solid fa-pen"></i>
                          )}
                        </button>
                      )}
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

export default DashComVend;
