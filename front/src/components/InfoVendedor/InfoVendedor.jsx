import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteVend, getVendID } from '../../services/Vendedores.service';
import Button from '../Common/Button';
import Swal from 'sweetalert2';

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
      console.error('Error al cargar datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!vendedorId) return;
    cargarDatos();
  }, [vendedorId]);

  const aplicarFiltro = () => {
    cargarDatos(fechaDesde, fechaHasta);
  };

  const limpiarFiltro = () => {
    setFechaDesde('');
    setFechaHasta('');
    cargarDatos();
  };

  const handClick = async (e) => {
    e.preventDefault();
    setPause(true);
    try {
      await deleteVend(e.target.value);
      Swal.fire({
        title: 'Eliminado!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate('/admin/vendedores');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-center justify-between md:flex mb-5">
        <div className="max-w-lg">
          <h3 className="text-xl font-bold sm:text-2xl principal mt-4">{dataVend.name}</h3>
        </div>
        <div className="mt-4 md:mt-0">
          <label className="text-sm font-medium text-gray-900 principal">
            Total de inscripciones: {dataVend.totalInscripciones}
          </label>
        </div>
        <div className="mt-3 md:mt-0">
          <button
            onClick={handClick}
            value={dataVend.id}
            disabled={pause}
            className="inline-block px-4 py-2 text-white bg-red-600 hover:bg-red-700 principal rounded md:text-sm disabled:opacity-50"
          >
            {pause ? (
              <div className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              </div>
            ) : (
              'Eliminar'
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="font-bold sm:text-2xl principal mt-4">Inscripciones Realizadas</h3>
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:items-end">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <Button
            onClick={aplicarFiltro}
            disabled={loadingData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
          >
            {loadingData ? 'Filtrando...' : 'Filtrar'}
          </Button>
          <Button
            onClick={limpiarFiltro}
            disabled={loadingData}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm disabled:opacity-50"
          >
            Limpiar
          </Button>
        </div>
      </div>
      <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal text-center">
            <tr>
              <th className="py-3 px-6">Nombre y Apellido</th>
              <th className="py-3 px-6">Telefono</th>
              <th className="py-3 px-6">DNI</th>
              <th className="py-3 px-6">Curso</th>
              <th className="py-3 px-6">Comision</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {loadingData ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando inscripciones...
                  </div>
                </td>
              </tr>
            ) : tableItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay inscripciones para mostrar
                </td>
              </tr>
            ) : (
              tableItems.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.tel}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.comision.curso.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.comision.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoVendedor;