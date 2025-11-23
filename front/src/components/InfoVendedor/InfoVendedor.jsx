import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteVend, getVendID, descargarInscripcionesExcel } from '../../services/Vendedores.service';
import Button from '../Common/Button';
import { Spinner } from '../Spinner/Spinner';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const InfoVendedor = () => {
  const { vendedorId } = useParams();
  const navigate = useNavigate();
  const [pause, setPause] = useState(false);
  const [tableItems, setTableItems] = useState([]);
  const [dataVend, setDataVend] = useState({
    id: '',
    name: '',
    totalInscripciones: 0,
  });
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const cargarDatos = async (desde, hasta) => {
    setLoadingData(true);
    try {
      const data = await getVendID(vendedorId, desde, hasta);
      setTableItems(data.inscripciones || []);
      setDataVend({
        id: data.id,
        name: data.name,
        totalInscripciones: data.totalInscripciones || 0,
      });
    } catch (error) {
      clientErrorHandler(
        error?.response?.data?.message || error?.message || ERROR_MESSAGES.ERROR_CARGAR_DATOS
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!vendedorId) return;
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendedorId]);

  const aplicarFiltro = () => {
    cargarDatos(fechaDesde, fechaHasta);
  };

  const limpiarFiltro = () => {
    setFechaDesde('');
    setFechaHasta('');
    cargarDatos();
  };

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const blob = await descargarInscripcionesExcel(vendedorId, fechaDesde, fechaHasta);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscripciones-${dataVend.name}-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      clientSuccessHandler(SUCCESS_MESSAGES.EXCEL_DESCARGADO);
    } catch (error) {
      clientErrorHandler(error?.message || ERROR_MESSAGES.ERROR_GENERAR_EXCEL);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handClick = async (e) => {
    e.preventDefault();
    setPause(true);
    try {
      await deleteVend(e.target.value);
      clientSuccessHandler(SUCCESS_MESSAGES.VENDEDOR_ELIMINADO);
      navigate('/admin/vendedores');
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {dataVend.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 principal">{dataVend.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">
                    <i className="fa-solid fa-graduation-cap mr-2"></i>
                    {dataVend.totalInscripciones} inscripciones
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handClick}
              value={dataVend.id}
              disabled={pause}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {pause ? (
                <>
                  <Spinner color="white" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-trash"></i>
                  <span>Eliminar Vendedor</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-list"></i>
                Inscripciones Realizadas
              </h2>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                <div className="flex flex-col flex-1 min-w-[140px]">
                  <label className="text-xs text-white mb-1">Desde</label>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded text-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-white focus:bg-white/30 transition-all"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-[140px]">
                  <label className="text-xs text-white mb-1">Hasta</label>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded text-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:border-white focus:bg-white/30 transition-all"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <Button
                    onClick={aplicarFiltro}
                    disabled={loadingData}
                    className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded shadow-md transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {loadingData ? 'Filtrando...' : 'Filtrar'}
                  </Button>
                  <Button
                    onClick={limpiarFiltro}
                    disabled={loadingData}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded shadow-md transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    Limpiar
                  </Button>
                  <Button
                    onClick={handleDownloadExcel}
                    disabled={downloadingExcel}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-md transition-all disabled:opacity-50 flex items-center gap-2 justify-center whitespace-nowrap"
                  >
                    {downloadingExcel ? (
                      <>
                        <Spinner color="white" />
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-file-excel"></i>
                        <span>Excel</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-user"></i>
                      Alumno
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-phone"></i>
                      Teléfono
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-id-card"></i>
                      DNI
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-book"></i>
                      Curso
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-users"></i>
                      Comisión
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingData ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <Spinner color="#2563eb" />
                        </div>
                        <p className="text-gray-600 font-medium">Cargando inscripciones...</p>
                      </div>
                    </td>
                  </tr>
                ) : tableItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <i className="fa-solid fa-inbox text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium">No hay inscripciones para mostrar</p>
                        <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de fecha</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{item.alumno.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{item.alumno.tel}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{item.alumno.dni}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{item.comision.curso.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {item.comision.name}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoVendedor;
