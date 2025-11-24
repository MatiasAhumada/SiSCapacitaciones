import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { deleteProfesId, getProfesSucId } from '../../services/Profesores.service';
import Pagination from '../Pagination/Pagination';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';
import ProfesorCard from './ProfesorCard';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

const DashProfesor = () => {
  const { getSucursalActiva } = useApp();
  const [profesores, setProfesores] = useState([]);
  const [pause, setPause] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    const sucursalId = getSucursalActiva()?.id;
    if (!sucursalId) return;

    const fetchProfesores = async () => {
      setLoading(true);
      try {
        const data = await getProfesSucId(sucursalId, currentPage, 9);
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

  const filteredProfesores = profesores.filter(profesor => 
    profesor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <i className="fa-solid fa-chalkboard-user text-white text-3xl"></i>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Equipo de Profesores
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona y visualiza los profesores de esta sucursal
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filteredProfesores.length === 0 ? (
          <EmptyState hasSearchTerm={searchTerm.length > 0} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProfesores.map((profesor) => (
                <ProfesorCard
                  key={profesor.id}
                  profesor={profesor}
                  onDelete={handleDelete}
                  isDeleting={pause[profesor.id]}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashProfesor;
