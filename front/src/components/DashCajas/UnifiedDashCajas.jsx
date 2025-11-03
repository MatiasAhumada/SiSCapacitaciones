import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCaja } from '../../context/CajaContext';
import { editMovCaja, GetByVendedorMock, descargarExcelCaja } from '../../services/Cajas.service';
import { getAlu } from '../../services/Alumnos.service';
import { getVendedores } from '../../services/Vendedores.service';
import { descargarComprobantePDF } from '../../services/Comprobantes.service';
import Swal from 'sweetalert2';
import AccionesDropdown from '../AccionesDropdown/AccionesDropdown';
import { ModalEditar } from '../ModalEditar/ModalEditar';
import CajaResumen from '../CajaResumen/CajaResumen';
import Pagination from '../Pagination/Pagination';

const UnifiedDashCajas = () => {
  const { user } = useAuth();
  const { registrarDescargarExcel } = useCaja();
  const isAdmin = user?.isAdmin;
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alu, setAlu] = useState([]);
  const [vend, setVend] = useState([]);
  const [formEdit, setFormEdit] = useState({
    fecha: '',
    tipo: '',
    metodoPago: '',
    monto: '',
    descripcion: '',
    alumnoComisionId: '',
    vendedorId: user?.id,
  });
  const [sesionCaja, setSesionCaja] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const navigate = useNavigate();

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const recargarDatos = async () => {
    if (!user?.id) return;
    try {
      const response = await GetByVendedorMock(user.id, currentPage, limit);
      setSesionCaja(response.sesionCaja);
      setTableItems(response.movimientos || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      const msg = error?.response?.data?.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      });
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [aluData, vendData] = await Promise.all([getAlu(), getVendedores()]);
        setAlu(aluData);
        setVend(vendData);
      } catch (error) {
        const msg = error?.response?.data?.message || 'Error al obtener los datos.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
        });
      }
    };
    cargarDatos();
    recargarDatos();
  }, [refreshKey, user?.id, currentPage]);

  useEffect(() => {
    registrarDescargarExcel(descargarExcel);
  }, [sesionCaja]);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isModalOpen]);

  const handleEdit = (mov) => {
    setIsModalOpen(true);
    setEditMode(mov.id);
    setFormEdit({
      id: mov.id,
      fecha: mov.fecha,
      tipo: mov.tipo || '',
      metodoPago: mov.metodoPago || '',
      monto: mov.monto || '',
      descripcion: mov.descripcion || '',
      cuota: mov.cuota || '',
      mesCuota: mov.mesCuota || '',
      alumnoComisionId: mov.alumnoComision?.id || '',
      alumnoNombre: mov.alumnoComision?.alumno?.name || '',
      vendedorId: mov.vendedor?.id || user?.id,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({
      ...formEdit,
      [name]: value,
    });
  };

  const handlePrintPago = async (pago) => {
    setPause((prev) => ({ ...prev, [pago.id]: true }));
    try {
      await descargarComprobantePDF(pago.id);
      Swal.fire({
        icon: 'success',
        title: 'Comprobante descargado',
        text: 'El comprobante se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al descargar comprobante',
        text: error.message,
      });
    } finally {
      setPause((prev) => ({ ...prev, [pago.id]: false }));
    }
  };

  const handleSave = async () => {
    if (!isModalOpen) return;

    try {
      await editMovCaja(editMode, formEdit);
      Swal.fire({
        title: 'Caja Editada',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      setIsModalOpen(false);
      setTimeout(() => {
        recargarDatos();
      }, 100);
    } catch (error) {
      console.error('Error al editar:', error);
      Swal.fire({ title: 'Error al actualizar', icon: 'error' });
    } finally {
      setEditMode(null);
    }
  };

  const descargarExcel = async () => {
    try {
      const blob = await descargarExcelCaja(sesionCaja.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caja-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Excel descargado',
        text: 'El archivo se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      let errorMessage = 'No se pudo descargar el Excel';

      if (error?.response?.status === 400 || error?.response?.status === 404) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error?.response?.data) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al generar Excel',
        text: errorMessage,
        confirmButtonText: 'Entendido',
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={isAdmin ? 'max-w-screen-xl mx-auto px-4 md:px-8' : 'min-h-screen bg-gray-50'}>
      <div className={isAdmin ? '' : 'max-w-7xl mx-auto px-4 py-6'}>
        <div className={isAdmin ? 'items-start justify-between flex flex-col md:flex-row' : 'flex items-center justify-between mb-8'}>
          <div className={isAdmin ? 'max-w-lg mt-5' : ''}>
            <h3 className={isAdmin ? 'text-gray-800 text-xl font-bold sm:text-2xl principal' : 'text-3xl font-bold text-gray-900'}>
              {isAdmin ? 'CAJA' : 'Dashboard de Caja'}
            </h3>
            {!isAdmin && <p className="text-gray-600 mt-1">Gestiona los movimientos de tu caja diaria</p>}
          </div>

          {!isAdmin && (
            <AccionesDropdown
              idVend={user?.id}
              onCajaAction={() => setRefreshKey((prev) => prev + 1)}
              onDescargarExcel={descargarExcel}
            />
          )}
        </div>

        {!isAdmin && <CajaResumen sesionCaja={sesionCaja} />}

        <div className={isAdmin ? 'mt-12 shadow-sm border rounded-lg overflow-x-auto' : 'bg-white rounded-xl shadow-lg overflow-hidden'}>
          {!isAdmin && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Movimientos del Día</h2>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-center">
              <thead className={isAdmin ? 'bg-gray-50 text-gray-600 font-medium border-b principal' : 'bg-gray-100'}>
                <tr>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-left font-semibold text-gray-700'}>Fecha</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-left font-semibold text-gray-700'}>Alumno</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-left font-semibold text-gray-700'}>Dni</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-center font-semibold text-gray-700'}>Tipo</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-center font-semibold text-gray-700'}>Metodo de Pago</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-left font-semibold text-gray-700'}>Descripcion</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-right font-semibold text-gray-700'}>Monto</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-left font-semibold text-gray-700'}>Categoria</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-left font-semibold text-gray-700'}>Sub Categorias</th>
                  <th className={isAdmin ? 'py-3 px-6' : 'py-4 px-6 text-center font-semibold text-gray-700'}>{isAdmin ? '' : 'Acciones'}</th>
                </tr>
              </thead>
              <tbody className={isAdmin ? 'text-gray-600 divide-y text-center' : 'divide-y divide-gray-200'}>
                {tableItems.map((item, index) => (
                  <tr key={item.id} className={isAdmin ? '' : `hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-sm text-gray-900'}>
                      {formatToDisplay(item.fecha)}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-sm font-medium text-gray-900'}>
                      {item.alumnoComision?.alumno.name || '-'}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-sm text-gray-600'}>
                      {item.alumnoComision?.alumno.dni || '-'}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-center'}>
                      {isAdmin ? (
                        item.tipo
                      ) : (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.tipo === 'Ingreso'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.tipo}
                        </span>
                      )}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-center'}>
                      {isAdmin ? (
                        item.metodoPago
                      ) : (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.metodoPago === 'Efectivo'
                              ? 'bg-green-100 text-green-800'
                              : item.metodoPago === 'Digital Tobias'
                                ? 'bg-purple-100 text-purple-800'
                                : item.metodoPago === 'Digital Javier'
                                  ? 'bg-orange-100 text-orange-800'
                                  : item.metodoPago === 'Credito'
                                    ? 'bg-pink-100 text-pink-800'
                                    : item.metodoPago === 'Ferro'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.metodoPago}
                        </span>
                      )}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4' : 'px-6 py-4 text-sm text-gray-600'}>{item.descripcion || '-'}</td>
                    <td className={isAdmin ? 'px-6 py-4' : 'px-6 py-4 text-right text-sm font-semibold text-gray-900'}>
                      {isAdmin ? item.monto : `$${new Intl.NumberFormat('es-AR').format(item.monto)}`}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-sm text-gray-600'}>
                      {item.subcategoria?.categoria.nombre || '-'}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-sm text-gray-600'}>
                      {item.subcategoria?.nombre || '-'}
                    </td>
                    <td className={isAdmin ? 'px-6 py-4 whitespace-nowrap' : 'px-6 py-4 text-center'}>
                      {isAdmin ? (
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 text-white btnAz rounded me-2"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <i className="fa-solid fa-pen text-sm"></i>
                          </button>
                          {item.tipo === 'Ingreso' && (
                            <button
                              onClick={() => handlePrintPago(item)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Descargar comprobante"
                            >
                              {pause[item.id] ? (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                  <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z" />
                                </svg>
                              ) : (
                                <i className="fa-solid fa-print text-sm"></i>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {isModalOpen && (
        <ModalEditar
          formData={formEdit}
          onClose={() => {
            setIsModalOpen(false);
            setEditMode(null);
          }}
          onSave={handleSave}
          onChange={handleChange}
          vend={vend}
          alu={alu}
        />
      )}
    </div>
  );
};

export default UnifiedDashCajas;
