import { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import {
  descargarExcelAdmin,
  descargarExcelCaja,
  GetByVendedorMock,
  descargarComprobanteEgreso,
} from '../../services/Cajas.service';
import { Spinner } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import { CardSelectVendedor } from '../CardSelectVendedor/CardSelectVendedor';
import { getMockVendedores } from '../../services/Cajas.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const ListadoCajas = () => {
  const [sellerCajas, setSellerCajas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingComprobanteId, setLoadingComprobanteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSelectedVendedor, setIsSelectedVendedor] = useState(false);
  const [selectedIdVendedor, setSelectedIdVendedor] = useState('');
  const [vend, setVend] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [debouncedFilterDate, setDebouncedFilterDate] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterDate(filterDate);
    }, 2000);

    return () => clearTimeout(timer);
  }, [filterDate]);

  useEffect(() => {
    const fetchVendedores = async () => {
      if (isSelectedVendedor) return;
      if (!user?.isAdmin && user?.id) {
        setSelectedIdVendedor(user.id);
        setIsSelectedVendedor(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const vendData = await getMockVendedores();
        setVend(vendData || []);
      } catch (error) {
        setError('Error al cargar los vendedores. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCajas = async () => {
      if (!isSelectedVendedor) return;
      /* if (!user?.id) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }*/

      setLoading(true);
      setError(null);
      try {
        const { data, totalPages } = await GetByVendedorMock(
          selectedIdVendedor,
          currentPage,
          10,
          debouncedFilterDate
        );
        setSellerCajas(data || []);
        setTotalPages(totalPages);
      } catch (err) {
        setError('Error al cargar las cajas. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
    fetchCajas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdVendedor, currentPage, isSelectedVendedor, debouncedFilterDate]);

  const handleVendedorSelect = (vendedor) => {
    setSelectedIdVendedor(vendedor.id);
    setIsSelectedVendedor(true);
    setCurrentPage(1);
  };

  const handleDownload = async (id_caja) => {
    setLoadingId(id_caja);
    try {
      let blob;

      if (isSelectedVendedor) {
        blob = await descargarExcelCaja(id_caja);
      } else {
        blob = await descargarExcelAdmin(user.id);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caja-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      clientSuccessHandler(SUCCESS_MESSAGES.EXCEL_DESCARGADO);
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

      clientErrorHandler(errorMessage);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDownloadComprobanteEgreso = async (movimientoId) => {
    setLoadingComprobanteId(movimientoId);
    try {
      const blob = await descargarComprobanteEgreso(movimientoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `egreso-${movimientoId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      clientSuccessHandler(SUCCESS_MESSAGES.COMPROBANTE_EGRESO_DESCARGADO);
    } catch (error) {
      clientErrorHandler(ERROR_MESSAGES.ERROR_DESCARGAR_COMPROBANTE_EGRESO);
    } finally {
      setLoadingComprobanteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
        <Spinner color={'black'} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased">
      <div className="flex justify-center min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
        {isSelectedVendedor ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-5xl border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Cajas de{' '}
              {sellerCajas.length > 0
                ? sellerCajas[0].admin?.name || sellerCajas[0].vendedor?.name
                : 'Vendedor'}
            </h2>

            <div className="mb-6">
              <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por fecha:
              </label>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {sellerCajas.length > 0 ? (
              <>
                <div className="space-y-4">
                  {sellerCajas.map((caja) => (
                    <Disclosure
                      as="div"
                      key={caja.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      {({ open }) => (
                        <>
                          <DisclosureButton className="flex w-full justify-between items-center p-4 text-left text-lg font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                            <span>
                              Fecha:{' '}
                              <span className="font-mono text-gray-700 text-sm">
                                {caja.fecha_apertura}
                              </span>
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                                caja.fecha_cierre
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {caja.fecha_cierre ? 'Cerrada' : 'Abierta'}
                            </span>

                            {open ? (
                              <ChevronUpIcon className="w-6 h-6 text-gray-500 ml-2" />
                            ) : (
                              <ChevronDownIcon className="w-6 h-6 text-gray-500 ml-2" />
                            )}
                          </DisclosureButton>
                          <DisclosurePanel className="px-4 pt-2 pb-4 text-sm text-gray-700 border-t border-gray-200">
                            <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-start">
                              {/* Columna de detalles */}
                              <div>
                                <p className="font-semibold text-gray-800 mb-2">
                                  Detalles Generales:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                  <li>
                                    ID de Caja:{' '}
                                    <span className="font-mono text-gray-600">
                                      {caja.id.substring(0, 8)}...
                                    </span>
                                  </li>
                                  <li>Fecha Apertura: {caja.fecha_apertura}</li>
                                  <li>
                                    Fecha Cierre: {caja.fecha_cierre ? caja.fecha_cierre : 'N/A'}
                                  </li>
                                  <li>
                                    Usuario:{' '}
                                    {caja.admin
                                      ? `${caja.admin.name} (${caja.admin.email || 'sin email'})`
                                      : `${caja.vendedor?.name} (${caja.vendedor?.email || 'sin email'})`}
                                  </li>
                                </ul>
                              </div>

                              {/* Columna de totales */}
                              <div>
                                <p className="font-semibold text-gray-800 mb-2">
                                  Totales por Medio de Pago:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                  <li>
                                    Efectivo:{' '}
                                    <span className="font-bold text-green-700">
                                      ${caja.total_efectivo}
                                    </span>
                                  </li>
                                  <li>
                                    Digital Javier:{' '}
                                    <span className="font-bold text-green-700">
                                      ${caja.total_digital_javier}
                                    </span>
                                  </li>
                                  <li>
                                    Digital Tobias:{' '}
                                    <span className="font-bold text-green-700">
                                      ${caja.total_digital_tobias}
                                    </span>
                                  </li>
                                  <li>
                                    Ferro:{' '}
                                    <span className="font-bold text-green-700">
                                      ${caja.total_ferro}
                                    </span>
                                  </li>
                                  <li>
                                    Crédito:{' '}
                                    <span className="font-bold text-green-700">
                                      ${caja.total_credito}
                                    </span>
                                  </li>

                                  <li className="font-bold mt-2">
                                    Total Ingresos:{' '}
                                    <span className="text-green-700">${caja.total_ingresos}</span>
                                  </li>
                                  <li className="font-bold mt-2">
                                    Total Egresos:{' '}
                                    <span className="text-red-700">${caja.total_egresos}</span>
                                  </li>
                                </ul>
                              </div>

                              {/* Columna de acciones */}
                              <div className="flex justify-center lg:justify-end items-center">
                                <button
                                  onClick={() => handleDownload(caja.id)}
                                  className="p-2 rounded bg-green-100 hover:bg-green-200 text-green-700 transition"
                                >
                                  {loadingId === caja.id ? (
                                    <Spinner color={'black'} className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <ArrowDownTrayIcon className="w-5 h-5 text-green-600" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <h4 className="font-semibold text-gray-800 mb-2 mt-4">
                              Movimientos de Caja:
                            </h4>
                            {caja.movimientos && caja.movimientos.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-md bg-white">
                                {caja.movimientos.map((movimiento) => (
                                  <div
                                    key={movimiento.id}
                                    className={`flex justify-between items-center p-2 rounded-lg ${
                                      movimiento.tipo === 'Ingreso' ||
                                      movimiento.tipo === 'Apertura'
                                        ? 'bg-emerald-50 text-emerald-800'
                                        : 'bg-red-50 text-red-800'
                                    }`}
                                  >
                                    <div className="flex-1">
                                      <p className="font-semibold capitalize">
                                        {movimiento.tipo} - {movimiento.metodo_pago}
                                      </p>
                                      <p className="text-xs text-gray-600">{movimiento.fecha}</p>
                                      <p className="text-xs text-gray-600">{movimiento.vendedor}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-bold text-lg ${
                                          movimiento.tipo === 'Ingreso' ||
                                          movimiento.tipo === 'Apertura'
                                            ? 'text-emerald-700'
                                            : 'text-red-700'
                                        }`}
                                      >
                                        {movimiento.tipo === 'Egreso' ? '- ' : '+ '}$
                                        {movimiento.monto}
                                      </span>
                                      {movimiento.tipo === 'Egreso' && (
                                        <button
                                          onClick={() =>
                                            handleDownloadComprobanteEgreso(movimiento.id)
                                          }
                                          className="p-1.5 rounded bg-red-100 hover:bg-red-200 transition"
                                          title="Descargar comprobante de egreso"
                                        >
                                          {loadingComprobanteId === movimiento.id ? (
                                            <Spinner color={'red'} className="w-4 h-4" />
                                          ) : (
                                            <DocumentTextIcon className="w-4 h-4 text-red-600" />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600">
                                No hay movimientos registrados para esta caja.
                              </p>
                            )}
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
                {sellerCajas.length > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600 text-lg">
                No tienes cajas asignadas o no hay cajas disponibles.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-5xl border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Cajas</h2>
              <p className="text-lg text-gray-600">Selecciona un vendedor para ver sus cajas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vend.map((vendedor) => (
                <CardSelectVendedor
                  key={vendedor.id}
                  vendedor={vendedor}
                  onSelect={() => handleVendedorSelect(vendedor)}
                  isSelected={selectedIdVendedor === vendedor.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListadoCajas;
