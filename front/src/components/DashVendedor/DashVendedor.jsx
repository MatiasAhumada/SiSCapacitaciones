import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getVendSucID, descargarInscripcionesExcel, putVendedor } from '../../services/Vendedores.service';
import { ModalEditarGenerico } from '../ModalEditar/ModalEditarGenerico';
import Pagination from '../Pagination/Pagination';
import { Spinner } from '../Spinner/Spinner';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';

const DashVendedor = () => {
  const { getSucursalActiva } = useApp();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const click = (idVend) => {
    navigate(`/admin/vendedores/info/${idVend}`);
  };

  const handleDownloadExcel = async (vendedorId) => {
    setDownloadingId(vendedorId);
    try {
      const blob = await descargarInscripcionesExcel(vendedorId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscripciones-vendedor-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      clientSuccessHandler(SUCCESS_MESSAGES.EXCEL_DESCARGADO);
    } catch (error) {
      clientErrorHandler(error?.message || ERROR_MESSAGES.ERROR_GENERAR_EXCEL);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleEditClick = (vendedor) => {
    setEditData({
      name: vendedor.name,
      email: vendedor.email,
      tel: vendedor.tel,
    });
    setEditingId(vendedor.id);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await putVendedor(editingId, editData);
      clientSuccessHandler(SUCCESS_MESSAGES.VENDEDOR_ACTUALIZADO);
      const sucursalId = getSucursalActiva()?.id;
      if (sucursalId) {
        const data = await getVendSucID(sucursalId, currentPage, 10);
        setTableItems(data.data || []);
      }
      setShowEditModal(false);
    } catch (error) {
      clientErrorHandler(error.response?.data?.message || error.message);
    }
  };

  const editFields = [
    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Nombre' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
    { name: 'tel', label: 'Teléfono', type: 'tel', placeholder: 'Teléfono' },
  ];

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;

    const peticion = async () => {
      setLoading(true);
      try {
        const data = await getVendSucID(sucursalId, currentPage, 10);
        setTableItems(data.data || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        setTableItems([]);
        clientErrorHandler(
          error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_VENDEDORES
        );
      } finally {
        setLoading(false);
      }
    };
    peticion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getSucursalActiva()?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-users text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 principal">Equipo de Vendedores</h1>
              <p className="text-gray-600 mt-1">Gestiona y visualiza el desempeño de tu equipo</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-user"></i>
                      Vendedor
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-envelope"></i>
                      Email
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-phone"></i>
                      Teléfono
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-white">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-chart-line"></i>
                      Inscripciones
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-white">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-cog"></i>
                      Acciones
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4">
                          <Spinner color="#2563eb" />
                        </div>
                        <p className="text-gray-600 font-medium">Cargando vendedores...</p>
                      </div>
                    </td>
                  </tr>
                ) : tableItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <i className="fa-solid fa-users text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium">No hay vendedores registrados</p>
                        <p className="text-gray-400 text-sm mt-1">Agrega vendedores para comenzar</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{item.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{item.tel}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">
                            <i className="fa-solid fa-graduation-cap mr-2"></i>
                            {item.inscripciones?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => click(item.id)}
                            className="group relative p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Ver detalles"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            className="group relative p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Editar vendedor"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadExcel(item.id)}
                            disabled={downloadingId === item.id}
                            className="group relative p-2.5 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            title="Descargar Excel"
                          >
                            {downloadingId === item.id ? (
                              <Spinner color="white" />
                            ) : (
                              <i className="fa-solid fa-file-excel"></i>
                            )}
                          </button>
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
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {showEditModal && (
        <ModalEditarGenerico
          title="Editar Vendedor"
          formData={editData}
          fields={editFields}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          onChange={handleEditChange}
        />
      )}
    </div>
  );
};

export default DashVendedor;
