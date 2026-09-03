import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getDeudores } from '../../services/Comisiones.service';
import Pagination from '../Pagination/Pagination';
import { Spinner } from '../Spinner/Spinner';
import { clientErrorHandler } from '../../utils/notificationHandler';

const COLORES = {
  yellow: 'border-amber-200 bg-amber-50 text-amber-800',
  red: 'border-red-200 bg-red-50 text-red-800',
};

const DashDeudores = () => {
  const { user } = useAuth();
  const { getSucursalActiva } = useApp();
  const navigate = useNavigate();
  const [deudores, setDeudores] = useState([]);
  const [dni, setDni] = useState('');
  const [debouncedDni, setDebouncedDni] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sucursalId = getSucursalActiva()?.id || '';
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(deudores.length / itemsPerPage));
  const paginaActual = deudores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedDni(dni.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [dni]);

  useEffect(() => {
    if (user?.isAdmin && !sucursalId) {
      setLoading(false);
      return;
    }

    const cargarDeudores = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getDeudores(sucursalId, debouncedDni);
        setDeudores(data || []);
      } catch (requestError) {
        const message = requestError?.message || 'No se pudo cargar la vista de deudores';
        setError(message);
        clientErrorHandler(message);
      } finally {
        setLoading(false);
      }
    };

    cargarDeudores();
  }, [debouncedDni, reload, sucursalId, user?.isAdmin]);

  useEffect(() => {
    const refrescarAlVolver = () => {
      if (document.visibilityState === 'visible') setReload((valor) => valor + 1);
    };
    window.addEventListener('focus', refrescarAlVolver);
    return () => window.removeEventListener('focus', refrescarAlVolver);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner color="black" />
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-screen-xl px-4 py-6 md:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          Seguimiento
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Alumnos deudores</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Alumnos activos con cuota pendiente según el semáforo de su comisión.
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <label
          htmlFor="filtro-dni-deudores"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Buscar por DNI
        </label>
        <input
          id="filtro-dni-deudores"
          type="search"
          value={dni}
          onChange={(event) => setDni(event.target.value)}
          placeholder="Ingresá un DNI"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        />
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : paginaActual.length === 0 ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-800">
          No hay alumnos deudores para los filtros seleccionados.
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">Deudores encontrados</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {deudores.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {paginaActual.map((deudor) => (
              <article
                key={deudor.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold capitalize text-gray-900">
                      {deudor.alumno.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">DNI: {deudor.alumno.dni}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${COLORES[deudor.semaforo]}`}
                  >
                    {deudor.semaforo === 'yellow' ? 'Por vencer' : 'Debe'}
                  </span>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-700">
                  <p className="font-semibold">{deudor.comision.name}</p>
                  <p className="mt-1 text-gray-500">Día: {deudor.comision.day}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`${user?.isAdmin ? '/admin' : '/vendedor'}/alumno/${deudor.alumno.id}`)
                  }
                  className="mt-4 min-h-11 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Ver ficha del alumno
                </button>
              </article>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
};

export default DashDeudores;
