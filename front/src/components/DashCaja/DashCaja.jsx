import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { editMovCaja, GetCajaByVendedor, descargarExcelCaja } from '../../services/Cajas.service';
import { getAlu } from '../../services/Alumnos.service';
import { getVendedores } from '../../services/Vendedores.service';
import { descargarComprobantePDF } from '../../services/Comprobantes.service';
import { ModalEditar } from '../ModalEditar/ModalEditar';
import CajaResumen from '../CajaResumen/CajaResumen';
import Pagination from '../Pagination/Pagination';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const DashCaja = () => {
  const { user } = useAuth();
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
  const [filtroVendedor, setFiltroVendedor] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

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
      const vendedorId = user.isAdmin && filtroVendedor ? filtroVendedor : user.id;
      const hayFiltrosAdmin = user.isAdmin && (filtroVendedor || filtroFecha);
      const data = await GetCajaByVendedor(vendedorId, currentPage, 10, filtroFecha, hayFiltrosAdmin);
      const ultimaSesion = data.length > 0 ? data[0] : null;
      setSesionCaja(ultimaSesion);
      if (ultimaSesion) {
        setTableItems(ultimaSesion.movimientos || []);
        setTotalPages(ultimaSesion.totalPages || 1);
      } else {
        setTableItems([]);
        setTotalPages(1);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      clientErrorHandler(msg || ERROR_MESSAGES.ERROR_CARGAR_DATOS);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [aluData, vendData] = await Promise.all([getAlu(), getVendedores()]);
        setAlu(aluData);
        setVend(vendData);
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message;
        clientErrorHandler(msg || ERROR_MESSAGES.ERROR_CARGAR_DATOS);
      }
    };
    cargarDatos();
    recargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, currentPage, user?.id, filtroVendedor, filtroFecha]);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isModalOpen]);

  const handleEdit = (mov) => {
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
      vendedorId: mov.vendedor?.id || user?.id || '',
    });
    setIsModalOpen(true);
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
      clientSuccessHandler(SUCCESS_MESSAGES.COMPROBANTE_DESCARGADO);
    } catch (error) {
      clientErrorHandler(error.message || ERROR_MESSAGES.ERROR_DESCARGAR_COMPROBANTE);
    } finally {
      setPause((prev) => ({ ...prev, [pago.id]: false }));
    }
  };

  const handleSave = async () => {
    if (!isModalOpen || !formEdit.id) return;

    try {
      await editMovCaja(formEdit.id, formEdit);
      clientSuccessHandler(SUCCESS_MESSAGES.CAJA_EDITADA);
      setIsModalOpen(false);
      setEditMode(null);
      setTimeout(() => {
        recargarDatos();
      }, 100);
    } catch (error) {
      clientErrorHandler(
        error?.response?.data?.message || error?.message || ERROR_MESSAGES.ERROR_ACTUALIZAR_CAJA
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-6 shadow-lg mb-6 border border-indigo-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 principal">
              Dashboard de Caja
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Gestiona los movimientos de tu caja diaria
            </p>
          </div>
        </div>

        {user?.isAdmin && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-xl shadow-lg p-4 md:p-6 mb-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fa-solid fa-filter text-purple-600"></i>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-700">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-600 mb-2">
                  Vendedor
                </label>
                <select
                  value={filtroVendedor}
                  onChange={(e) => {
                    setFiltroVendedor(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white hover:border-purple-300 shadow-sm"
                >
                  <option value="">📋 Todos los vendedores</option>
                  {vend.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                      👤 {vendedor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-600 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => {
                    setFiltroFecha(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white hover:border-purple-300 shadow-sm"
                />
              </div>
            </div>
            {(filtroVendedor || filtroFecha) && (
              <button
                onClick={() => {
                  setFiltroVendedor('');
                  setFiltroFecha('');
                  setCurrentPage(1);
                }}
                className="mt-4 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-all duration-300 text-sm"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        <CajaResumen sesionCaja={sesionCaja} />

        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 px-4 md:px-6 py-4 md:py-5 border-b-2 border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <i className="fa-solid fa-list text-indigo-600"></i>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-700">Movimientos del Día</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs md:text-sm">Fecha</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs md:text-sm">Alumno</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs md:text-sm hidden sm:table-cell">DNI</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs md:text-sm hidden md:table-cell">Vendedor</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-center text-xs md:text-sm">Tipo</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-center text-xs md:text-sm hidden lg:table-cell">Método</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs md:text-sm hidden xl:table-cell">Descripción</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-right text-xs md:text-sm">Monto</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs md:text-sm hidden xl:table-cell">Categoría</th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-center text-xs md:text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableItems.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                          <i className="fa-solid fa-inbox text-5xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500 font-medium">No hay movimientos disponibles</p>
                        <p className="text-gray-400 text-sm mt-1">Los movimientos aparecerán aquí</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                        {formatToDisplay(item.fecha)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                        {item.alumnoComision?.alumno.name || '-'}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                        {item.alumnoComision?.alumno.dni || '-'}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 hidden md:table-cell">
                        {item.vendedor?.name || '-'}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded shadow-sm ${
                            item.tipo === 'Ingreso'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.tipo}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-center hidden lg:table-cell">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded shadow-sm ${
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
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 hidden xl:table-cell">
                        {item.descripcion || '-'}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                        ${new Intl.NumberFormat('es-AR').format(item.monto)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 hidden xl:table-cell">
                        {item.subcategoria?.categoria.nombre || '-'}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            title="Editar"
                          >
                            <i className="fa-solid fa-pen text-xs md:text-sm"></i>
                          </button>
                          {item.tipo === 'Ingreso' && (
                            <button
                              onClick={() => handlePrintPago(item)}
                              className="p-1.5 md:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                              title="Descargar comprobante"
                            >
                              {pause[item.id] ? (
                                <svg className="w-3 h-3 md:w-4 md:h-4 animate-spin" viewBox="0 0 24 24">
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
                                <i className="fa-solid fa-print text-xs md:text-sm"></i>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-6 md:mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
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

export default DashCaja;
