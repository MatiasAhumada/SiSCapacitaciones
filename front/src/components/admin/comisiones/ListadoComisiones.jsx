import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { editStateComision, getComisionId } from '../../../helpers/Comisiones.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Spinner } from '../../Spinner/Spinner';

const ListadoComisiones = () => {
  const { id } = useParams();
   const [onAsistenciaClicked, setOnAsistenciaClicked] = useState(false);
  const [alumnosComision, setAlumnosComision] = useState([]);
  const [comisionDate, setComisionDate] = useState([]);
  const [pause, setPause] = useState({});
  const [asistencias, setAsintencias] = useState([
    {
      fecha: '',
      presente: false,
      alumnoComisionId: '',
    },
  ]);
  const [todosLosAlumnos, setTodosLosAlumnos] = useState([]);
  const [dniFiltro, setDniFiltro] = useState('');

  const { comId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navegacion = (alumno) => {
    const currentPath = location.pathname;
    const isAdmin = currentPath.includes('adm');
    //console.log(isAdmin);isAdmin ? pathSegments[2] :

    const pathSegments = currentPath.split('/');
    const userId = pathSegments[1];
    const redirectionPath = isAdmin
      ? `/adm/${id}/alumno/${alumno.id}`
      : `/${userId}/alumno/${alumno.id}`;

    navigate(redirectionPath);
  };
  useEffect(() => {
    const alumnosCom = async () => {
      await getComisionId(comId).then((data) => {
        setAlumnosComision(data.alumnoComisiones);
        setTodosLosAlumnos(data.alumnoComisiones);
        setComisionDate(data);
      });
    };
    alumnosCom();
  }, []);

  const allDates = Array.from(
    new Set(
      alumnosComision.flatMap((item) =>
        item.asistencias.map((asistencia) => asistencia.fecha.split('T')[0])
      )
    )
  ).sort();

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    // Datos extra a mostrar
    const profesor = 'Prof. Juan Pérez';
    const horario = '18:00 - 20:00';
    const dia = 'Lunes y Miércoles';

    // Texto arriba del PDF
    doc.setFontSize(12);
    doc.text(`Profesor: ${comisionDate.profesor.name} ${comisionDate.profesor.apellido}`, 14, 20);
    doc.text(`Horario: ${comisionDate.hour.start} - ${comisionDate.hour.end}`, 14, 28);
    doc.text(`Días: ${comisionDate.day}`, 14, 36);

    // Obtener todas las fechas únicas
    const fechas = Array.from(
      new Set(
        alumnosComision.flatMap((item) =>
          item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString())
        )
      )
    );

    // Crear encabezado con nombres de columnas
    const headers = ['Alumno', 'DNI', 'Telefono', ...fechas];

    // Crear filas con datos de asistencia
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
nst [onAsistencia, setOnAsistencia] = useState(false);
    doc.save(`Asistencia-${comisionDate.name}.pdf`);
  };
  const verMas = (e) => {
    e.preventDefault();
    const alumnoId = e.target.value;
    setPause((prev) => ({ ...prev, [alumnoId]: true }));
    const asistencia = alumnosComision.find((a) => a.id === alumnoId);
    setAsintencias(asistencia.asistencias);
    console.log(alumnosComision);
    setPause((prev) => {
      const newPause = { ...prev };
      delete newPause[alumnoId];
      return newPause;
    });
  };
  const clickEdit = async (e, ID) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPause((prev) => ({ ...prev, [ID]: true }));
<button
      onClick={onAsist}
      className="px-3 py-1 text-white principal rounded btnAz text-sm"
    >
      Asistencia
    </button>
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

    if (!value.trim()) {
      setAlumnosComision(todosLosAlumnos);
      return;
    }

    const filtrados = todosLosAlumnos.filter((item) => item.alumno?.dni.includes(value));
    setAlumnosComision(filtrados);
  };

  const onAsist = (e) => {
    e.preventDefault();
    setOnAsistenciaClicked(true);
    console.log('botón click');
  };
   

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <>
        <div className="items-start justify-between md:flex">
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
          <div className="mt-6 mb-2">
            <input
              type="text"
              placeholder="Filtrar por DNI"
              value={dniFiltro}
              onChange={handleFiltrarDni}
              className="px-4 py-2 border rounded w-full md:w-64"
            />
          </div>
      <div className="mt-4 md:mt-0 flex justify-center">
  <div className="flex flex-col md:flex-row gap-2 w-fit">
    <button
      onClick={generatePDF}
      className="px-3 py-1 text-white principal rounded bg-red-500 hover:bg-red-600 text-sm"
    >
      PDF
    </button>
    
    { onAsistenciaClicked?
    <button
      onClick={null}
      className="min-w-[120px] px-3 py-1 text-white principal rounded bg-green-500 hover:bg-green-600 text-sm"
    >
      Guardar
    </button>
    : <button
      onClick={onAsist}
      className="min-w-[120px] px-3 py-1 text-white principal rounded btnAz text-sm"
    >
      Asistencia
    </button>
    }
  </div>
</div>
        </div>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm  text-center">
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
                        disabled={pause[item.id]} // evita doble click
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
                        (a) => a.fecha.split('T')[0] === date
                      );
                      return (
                        <td key={date} className="px-6 py-4">
                          {asistencia ? (asistencia.presente ? '✔️' : '❌') : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
};

export default ListadoComisiones;
