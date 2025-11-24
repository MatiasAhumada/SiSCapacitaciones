import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { deleteProfesId, getProfesSucId, putProfesor } from '../../services/Profesores.service';
import Pagination from '../Pagination/Pagination';
import { Spinner } from '../Spinner/Spinner';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';
import { ModalEditarGenerico } from '../ModalEditar/ModalEditarGenerico';

const DashProfesor = () => {
  const { getSucursalActiva } = useApp();
  const [profesores, setProfesores] = useState([]);
  const [pause, setPause] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProfesor, setExpandedProfesor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    const profesorId = e.target.value;

    setPause((prev) => ({ ...prev, [profesorId]: true }));

    try {
      await deleteProfesId(profesorId);
      clientSuccessHandler(SUCCESS_MESSAGES.PROFESOR_ELIMINADO);
      setProfesores((prev) => prev.filter((item) => item.id !== profesorId));
    } catch (error) {
      clientErrorHandler(error.response?.data?.message || error.message);
    } finally {
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[profesorId];
        return newPause;
      });
    }
  };

  const handleEditClick = (profesor) => {
    setEditData({
      name: profesor.name,
      apellido: profesor.apellido,
      tel: profesor.tel,
      email: profesor.email || '',
      direccion: profesor.direccion || '',
    });
    setEditingId(profesor.id);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await putProfesor(editingId, editData);
      clientSuccessHandler(SUCCESS_MESSAGES.PROFESOR_ACTUALIZADO);
      const sucursalId = getSucursalActiva()?.id;
      if (sucursalId) {
        const response = await getProfesSucId(sucursalId, currentPage, 10);
        setProfesores(response.data || []);
      }
      setShowEditModal(false);
    } catch (error) {
      clientErrorHandler(error.response?.data?.message || error.message);
    }
  };

  const editFields = [
    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Nombre' },
    { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Apellido' },
    { name: 'tel', label: 'Teléfono', type: 'tel', placeholder: 'Teléfono' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Dirección' },
  ];

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;

    const fetchProfesores = async () => {
      setLoading(true);
      try {
        const data = await getProfesSucId(sucursalId, currentPage, 10);
        setProfesores(data.data || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        setProfesores([]);
        clientErrorHandler(
          error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_PROFESORES
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getSucursalActiva()?.id]);

  const filteredProfesores = profesores.filter(
    (profesor) =>
      profesor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-chalkboard-user text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 principal">Equipo de Profesores</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y visualiza los profesores de esta sucursal
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-gray-400 text-lg"></i>
            </div>
            <input
              type="text"
              placeholder="Buscar profesor por nombre o apellido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
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
                      Profesor
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
                      <i className="fa-solid fa-users"></i>
                      Comisiones
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
                          <Spinner color="#4f46e5" />
                        </div>
                        <p className="text-gray-600 font-medium">Cargando profesores...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProfesores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <i className="fa-solid fa-user-slash text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium">No se encontraron profesores</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {searchTerm
                            ? 'Intenta con otro término de búsqueda'
                            : 'Agrega profesores para comenzar'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProfesores.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <tr
                        className={`hover:bg-blue-50 transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {item.name.charAt(0).toUpperCase()}
                              {item.apellido.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {item.name} {item.apellido}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{item.email || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{item.tel}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                setExpandedProfesor(expandedProfesor === item.id ? null : item.id)
                              }
                              className="inline-flex items-center px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                            >
                              <i className="fa-solid fa-users mr-2"></i>
                              {item.cantidadComisiones}
                              <i
                                className={`fa-solid ${expandedProfesor === item.id ? 'fa-chevron-up' : 'fa-chevron-down'} ml-2`}
                              ></i>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditClick(item)}
                              className="group relative p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Editar profesor"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.target.value = item.id;
                                handleDelete(e);
                              }}
                              disabled={pause[item.id]}
                              className="group relative p-2.5 bg-red-600 hover:bg-red-700 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                              title="Eliminar profesor"
                            >
                              {pause[item.id] ? (
                                <Spinner color="white" />
                              ) : (
                                <i className="fa-solid fa-trash"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedProfesor === item.id && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <i className="fa-solid fa-graduation-cap text-blue-600"></i>
                              <h4 className="font-semibold text-gray-700">Comisiones activas:</h4>
                            </div>
                            {item.comisiones && item.comisiones.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {item.comisiones.map((comision) => (
                                  <span
                                    key={comision.id}
                                    className="inline-flex items-center px-3 py-2 rounded-lg bg-white text-gray-700 text-sm font-medium border border-blue-200 shadow-sm"
                                  >
                                    <i className="fa-solid fa-circle-check text-green-500 mr-2 text-xs"></i>
                                    {comision.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic text-sm">
                                No tiene comisiones activas asignadas
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
          title="Editar Profesor"
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

export default DashProfesor;
