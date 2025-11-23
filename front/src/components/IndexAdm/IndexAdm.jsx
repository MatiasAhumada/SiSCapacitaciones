import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getSucursalId } from '../../services/Sucursales.service';
import { Spinner } from '../Spinner/Spinner';
import DashboardMetrics from '../DashboardMetrics/DashboardMetrics';
import StatCard from './StatCard';

const IndexAdm = () => {
  const { sucursalSeleccionada } = useApp();
  const [sede, setSede] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sucursalId = sucursalSeleccionada?.id;
    if (!sucursalId) return;

    setLoading(true);
    getSucursalId(sucursalId)
      .then((data) => setSede(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sucursalSeleccionada?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <Spinner color="black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Dashboard - {sede.name || 'Cargando...'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Resumen general de la sucursal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Profesores"
          value={sede.profesorComisiones}
          icon="fa-solid fa-chalkboard-user"
          color="blue"
        />
        <StatCard
          title="Alumnos"
          value={sede.alumnos}
          icon="fa-solid fa-user-graduate"
          color="green"
        />
        <StatCard
          title="Vendedores"
          value={sede.vendedores}
          icon="fa-solid fa-users"
          color="purple"
        />
        <StatCard
          title="Comisiones Activas"
          value={sede.comisiones}
          icon="fa-solid fa-book-open"
          color="orange"
        />
      </div>

      {/* Metrics */}
      <DashboardMetrics />
    </div>
  );
};

export default IndexAdm;
