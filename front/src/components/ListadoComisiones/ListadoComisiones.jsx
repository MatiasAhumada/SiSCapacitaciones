import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  editStateComision,
  getComisionId,
  postAsistenciaComision,
  transferirAlumno,
  getComisionBySucursal,
} from '../../services/Comisiones.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Pagination from '../Pagination/Pagination';
import Swal from 'sweetalert2';
import TransferModal from './TransferModal';
import ComisionHeader from './ComisionHeader';
import AsistenciaControls from './AsistenciaControls';
import AlumnoRow from './AlumnoRow';

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
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [comisionesDisponibles, setComisionesDisponibles] = useState([]);
  const [nuevaComisionId, setNuevaComisionId] = useState('');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dniFiltro]);

  useEffect(() => {
    fetchAlumnos(currentPage, dniFiltro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      alumnosComision.flatMap((item) =>
        item.asistencias.map((asistencia) => asistencia.fecha.split('T')[0])
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

  const handleAsistenciaChange = (updates) => {
    setAsistencia({ ...asistencia, ...updates });
  };

  const handleAsistenciaCheck = (alumnoId) => {
    setAsistencia({
      ...asistencia,
      alumnosComisionIds: [...asistencia.alumnosComisionIds, alumnoId],
    });
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
    } catch {
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

  const handleTransferClick = async (alumno) => {
    setSelectedAlumno(alumno);
    try {
      const data = await getComisionBySucursal(comisionDate.sucursal.id);
      setComisionesDisponibles(data.data.filter((c) => c.id !== comisionId));
      setShowTransferModal(true);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las comisiones',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleTransferConfirm = async () => {
    if (!nuevaComisionId) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una comisión',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      await transferirAlumno(selectedAlumno.id, nuevaComisionId);
      Swal.fire({
        icon: 'success',
        title: 'Alumno transferido',
        text: 'El alumno fue transferido exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
      setShowTransferModal(false);
      setNuevaComisionId('');
      setReload(!reload);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al transferir',
        text: 'Hubo un error al transferir el alumno',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
      <ComisionHeader comision={comisionDate} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-3 w-full lg:w-80">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Filtrar por DNI"
              value={dniFiltro}
              onChange={handleFiltrarDni}
              className="pl-11 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition-all duration-200 w-full"
            />
          </div>
          <AsistenciaControls
            asistencia={asistencia}
            onAsistenciaChange={handleAsistenciaChange}
            showAsistencia={onAsistenciaClicked}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            className="px-5 py-3 text-white font-medium rounded bg-red-600 hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <i className="fa-solid fa-file-pdf"></i>
            Exportar PDF
          </button>

          {onAsistenciaClicked ? (
            <button
              onClick={onGuardar}
              className="px-5 py-3 text-white font-medium rounded bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-save"></i>
              Guardar
            </button>
          ) : (
            <button
              onClick={onAsist}
              className="px-5 py-3 text-white font-medium rounded bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-clipboard-check"></i>
              Asistencia
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold border-b-2 border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left">Acciones</th>
                <th className="py-4 px-6 text-left">Nombre</th>
                <th className="py-4 px-6 text-left">DNI</th>
                <th className="py-4 px-6 text-left">Teléfono</th>
                <th className="py-4 px-6 text-center">Estado</th>
                {allDates.map((date) => (
                  <th key={date} className="py-4 px-6 text-center">
                    {date}
                  </th>
                ))}
                {onAsistenciaClicked && (
                  <th className="py-4 px-6 text-center">
                    <input
                      className="py-2 px-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="date"
                      onChange={(e) => handleAsistenciaChange({ fecha: e.target.value })}
                    />
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-200">
              {alumnosComision?.map((item) => (
                <AlumnoRow
                  key={item.id}
                  item={item}
                  allDates={allDates}
                  formatFecha={formatFecha}
                  getRowBgColor={getRowBgColor}
                  onNavigate={navegacion}
                  onTransfer={handleTransferClick}
                  onStateChange={clickEdit}
                  onAsistenciaCheck={handleAsistenciaCheck}
                  pause={pause}
                  showAsistencia={onAsistenciaClicked}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {showTransferModal && (
        <TransferModal
          alumno={selectedAlumno?.alumno}
          comisiones={comisionesDisponibles}
          selectedComisionId={nuevaComisionId}
          onComisionChange={setNuevaComisionId}
          onConfirm={handleTransferConfirm}
          onCancel={() => {
            setShowTransferModal(false);
            setNuevaComisionId('');
          }}
        />
      )}
    </div>
  );
};

export default ListadoComisiones;
