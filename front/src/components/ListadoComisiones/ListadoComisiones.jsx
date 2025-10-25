import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  editStateComision,
  getComisionId,
  postAsistenciaComision,
} from '../../services/Comisiones.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Spinner } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import Swal from 'sweetalert2';

const ListadoComisiones = () => {
  const { comisionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [onAsistenciaClicked, setOnAsistenciaClicked] = useState(false);
  const [alumnosComision, setAlumnosComision] = useState([]);
  const [comisionDate, setComisionDate] = useState([]);
  const [pause, setPause] = useState({});
  const [reload, setReload] = useState(false);
  const [asistencia, setAsistencia] = useState({
    alumnosComisionIds: [],
    profesorId: '',
    comisionId: '',
    estadoProfesor: '',
    descripcion: '',
    fecha: '',
  });
  const [dniFiltro, setDniFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  const navegacion = (alumno) => {
    const isAdmin = user?.isAdmin;
    const redirectionPath = isAdmin
      ? `/admin/alumno/${alumno.id}`
      : `/vendedor/alumno/${alumno.id}`;

    navigate(redirectionPath);
  };

  const fetchAlumnos = async (page = 1, dni = '') => {
    try {
      const data = await getComisionId(comisionId, page, itemsPerPage, dni);
      setAlumnosComision(data.data);
      setComisionDate(data.comision || {});
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAlumnos(currentPage, dniFiltro);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dniFiltro]);

  useEffect(() => {
    fetchAlumnos(currentPage, dniFiltro);
  }, [currentPage, comisionId, reload]);

  const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const day = String(fecha.getUTCDate()).padStart(2, '0');
    const month = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const year = fecha.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const allDates = Array.from(
    new Set(
      alumnosComision.flatMap(
        (item) => item.asistencias.map((asistencia) => asistencia.fecha.split('T')[0])
      )
    )
  )
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => {
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year}`;
    });

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(12);
    doc.text(`Profesor: ${comisionDate.profesor.name} ${comisionDate.profesor.apellido}`, 14, 20);
    doc.text(`Horario: ${comisionDate.hour.start} - ${comisionDate.hour.end}`, 14, 28);
    doc.text(`Días: ${comisionDate.day}`, 14, 36);

    const fechas = Array.from(
      new Set(
        alumnosComision.flatMap((item) =>
          item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString())
        )
      )
    );

    const headers = ['Alumno', 'DNI', 'Telefono', ...fechas];

    const rows = alumnosComision.map((item) => {
      const row = [item.alumno.name, item.alumno.dni, item.alumno.tel];
      fechas.forEach((fecha) => {
        const asistencia = item.asistencias.find(
          (a) => new Date(a.fecha).toLocaleDateString() === fecha
        );
        row.push(asistencia ? (asistencia.presente ? 'P' : 'A') : 'A');
      });
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 42,
    });

    doc.save(`Asistencia-${comisionDate.name}.pdf`);
  };

  const clickEdit = async (e, ID) => {
    e.preventDefault();
    const { name } = e.target;
    setPause((prev) => ({ ...prev, [ID]: true }));
    const nuevoEstado = name === 'activo' ? false : true;
    const change = {
      estado: nuevoEstado,
      alumnoCom: ID,
    };

    try {
      await editStateComision(change).then(() => {
        try {
          setAlumnosComision((prev) =>
            prev.map((item) => (item.id === ID ? { ...item, state: nuevoEstado } : item))
          );
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setPause((prev) => ({ ...prev, [ID]: false }));
    }
  };

  const getRowBgColor = (alumno) => {
    const now = new Date();
    const day = now.getDate();
    const mesActual = now.getMonth();
    const yearActual = now.getFullYear();
    const mesAnterior = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const yearMesAnterior = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const pagoMesAnterior = alumno.pagos.some((pago) => {
      const fechaPago = new Date(pago.fecha);
      return fechaPago.getMonth() === mesAnterior && fechaPago.getFullYear() === yearMesAnterior;
    });

    const pagoMesActual = alumno.pagos.some((pago) => {
      const fechaPago = new Date(pago.fecha);
      return fechaPago.getMonth() === mesActual && fechaPago.getFullYear() === yearActual;
    });

    if (!pagoMesAnterior) return 'bg-red-200';
    if (day <= 10) return 'bg-green-200';
    if (day <= 15 && !pagoMesActual) return 'bg-yellow-200';
    if (day > 15 && !pagoMesActual) return 'bg-red-200';
    return 'bg-green-200';
  };

  const handleFiltrarDni = (e) => {
    const value = e.target.value;
    setDniFiltro(value);
    setCurrentPage(1);
  };

  const onAsist = (e) => {
    e.preventDefault();
    setAsistencia({
      ...asistencia,
      profesorId: comisionDate.profesor?.id,
      comisionId: comisionDate.id,
    });
    setOnAsistenciaClicked(true);
  };

  const onGuardar = async () => {
    try {
      await postAsistenciaComision(asistencia);
      Swal.fire({
        icon: 'success',
        title: 'Asistencia guardada',
        text: 'La asistencia se guardó correctamente',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar la asistencia',
        text: 'Hubo un error al guardar la asistencia',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setReload(!reload);
    }
    setOnAsistenciaClicked(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-0">
        <div className="max-w-lg">
          <h2 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            {comisionDate.name}
          </h2>
          <h4 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Dias {comisionDate.day} {comisionDate.hour?.start} - {comisionDate.hour?.end}
          </h4>
          <h5 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Profesor {comisionDate.profesor?.name} {comisionDate.profesor?.apellido}
          </h5>
        </div>
        <div className="flex flex-col md:ml-auto md:flex-row md:items-start md:gap-6 w-full md:w-auto">
          <div className="flex flex-col gap-2 w-full md:w-64">
            <input
              type="text"
              placeholder="Filtrar por DNI"
              value={dniFiltro}
              onChange={handleFiltrarDni}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               transition-all duration-200 w-full"
            />

            {onAsistenciaClicked && (
              <>
                <select
                  value={asistencia.estadoProfesor}
                  onChange={(e) =>
                    setAsistencia({ ...asistencia, estadoProfesor: e.target.value })
                  }
                  className={`px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all duration-200 w-full 
                   ${asistencia.estadoProfesor === '' ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  <option value="" className="text-gray-500">
                    Asistencia profesor
                  </option>
                  <option value="Presente" className="text-gray-900">
                    Presente
                  </option>
                  <option value="Ausente" className="text-gray-900">
                    Ausente
                  </option>
                  <option value="Feriado" className="text-gray-900">
                    Feriado
                  </option>
                </select>

                {asistencia.estadoProfesor === 'Ausente' && (
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={asistencia.descripcion}
                    onChange={(e) =>
                      setAsistencia({ ...asistencia, descripcion: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 w-full"
                  />
                )}
              </>
            )}
          </div>

          <div className="mt-1 md:mt-0 flex justify-center md:justify-start">
            <div className="flex flex-col md:flex-row gap-2 w-fit">
              <button
                onClick={generatePDF}
                className="px-3 py-1 text-white principal rounded bg-red-500 hover:bg-red-600 text-sm"
              >
                PDF
              </button>

              {onAsistenciaClicked ? (
                <button
                  onClick={onGuardar}
                  className="min-w-[120px] px-3 py-1 text-white principal rounded bg-green-500 hover:bg-green-600 text-sm"
                >
                  Guardar
                </button>
              ) : (
                <button
                  onClick={onAsist}
                  className="min-w-[120px] px-3 py-1 text-white principal rounded btnAz text-sm"
                >
                  Asistencia
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
            <tr>
              <th className="py-3 px-6"></th>
              <th className="py-3 px-6">Nombre</th>
              <th className="py-3 px-6">DNI</th>
              <th className="py-3 px-6">Telefono</th>
              <th className="py-3 px-6">Estado</th>
              {allDates.map((date) => (
                <th key={date} className="py-3 px-6">
                  {date}
                </th>
              ))}
              {onAsistenciaClicked ? (
                <th className="py-1">
                  <input
                    className="py-3 px-2 text-gray-600 rounded focus:outline-blue-600 focus ring-blue-400"
                    type="date"
                    onChange={(e) => setAsistencia({ ...asistencia, fecha: e.target.value })}
                  />
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {alumnosComision?.map((item) => {
              return (
                <tr key={item.id} className={getRowBgColor(item)}>
                  <td className="px-6 py-4">
                    <button
                      value={item.id}
                      onClick={() => navegacion(item)}
                      className="px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                    >
                      {pause[item.id] ? (
                        <Spinner color="white" />
                      ) : (
                        <i className="fa-solid fa-plus"></i>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">{item.alumno.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.tel}</td>
                  <td className="px-6 py-4">
                    <button
                      name={item.state ? 'activo' : 'inactivo'}
                      onClick={(e) => clickEdit(e, item.id)}
                      className={`text-xs px-2 py-0.5 rounded text-white 
                      ${item.state ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                      disabled={pause[item.id]}
                    >
                      {pause[item.id] ? (
                        <Spinner color="white" />
                      ) : item.state ? (
                        'Activo'
                      ) : (
                        'Inactivo'
                      )}
                    </button>
                  </td>
                  {allDates.map((date) => {
                    const asistencia = item.asistencias.find(
                      (a) => formatFecha(a.fecha) === date
                    );

                    return (
                      <td key={date} className="px-6 py-4">
                        {asistencia ? (asistencia.presente ? '✔️' : '❌') : '❌'}
                      </td>
                    );
                  })}
                  {onAsistenciaClicked ? (
                    <th className="text-center py-2">
                      <input
                        className="w-6 h-6"
                        style={{ accentColor: '#2563eb' }}
                        onChange={() =>
                          setAsistencia({
                            ...asistencia,
                            alumnosComisionIds: [...asistencia.alumnosComisionIds, item.id],
                          })
                        }
                        type="checkbox"
                      />
                    </th>
                  ) : null}
                </tr>
              );
            })}
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

export default ListadoComisiones;