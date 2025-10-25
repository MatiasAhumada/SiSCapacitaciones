import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteVend, getVendID } from '../../services/Vendedores.service';
import Button from '../common/Button';
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

  const cargarDatos = async (desde, hasta) => {
    const data = await getVendID(vendedorId, desde, hasta);
    setTableItems(data.inscripciones || []);
    setDataVend({
      id: data.id,
      name: data.name,
      totalInscripciones: data.totalInscripciones || 0,
    });
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
    await deleteVend(e.target.value).then((data) => {
      try {
        Swal.fire({
          title: 'Eliminado!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          navigate('/admin/vendedores');
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
        });
      }
    });
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
            className="inline-block px-4 py-2 text-white bg-red-600 hover:bg-red-700 principal rounded md:text-sm"
          >
            {pause ? (
              <svg
                fill="white"
                className="w-6 h-6 mx-auto"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="0.75s"
                    values="0 12 12;360 12 12"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Filtrar
          </Button>
          <Button
            onClick={limpiarFiltro}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm"
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
            {tableItems.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-6 py-4 whitespace-nowrap">{item.alumno.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.alumno.tel}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.alumno.dni}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.comision.curso.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.comision.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoVendedor;