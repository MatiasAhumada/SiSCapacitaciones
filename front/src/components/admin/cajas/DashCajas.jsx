import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  deleteMovCaja,
  editMovCaja,
  getCajas,
  getMovimientosPorDia,
  GetMovsByVendedor,
  getResumenPorDia,
  getResumenTotal,
} from '../../../services/Cajas.service';
import { getAlu } from '../../../services/Alumnos.service';
import { getVendedores } from '../../../services/Vendedores.service';
import Pagination from '../../Pagination/Pagination';
import Swal from 'sweetalert2';
import { ModalEditar } from '../../caja/ModalEditar';

const DashCajas = () => {
  const { id } = useParams();
  const idVend = localStorage.getItem('token');
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alu, setAlu] = useState([]);
  const [vend, setVend] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [vendedorFiltro, setVendedorFiltro] = useState('');
  const [datosFiltro, setDatosFiltro] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [formEdit, setFormEdit] = useState({
    fecha: fecha,
    tipo: '',
    metodoPago: '',
    monto: '',
    descripcion: '',
    alumnoComisionId: '',
    vendedorId: idVend,
  });

  const onFiltrar = async () => {
    await getMovimientosPorDia(fechaFiltro).then((data) => {
      if (data.length == 0) {
        Swal.fire({
          title: 'No hay movimientos en esa fecha',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setTableItems(data);
    });
    await getResumenPorDia(fechaFiltro).then((data) => {
      setDatosFiltro(data);
    });
  };

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // useEffect para carga inicial de datos estáticos
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      await getVendedores().then((data) => setVend(data));
      await getAlu().then((data) => setAlu(data));
      await getResumenTotal().then((data) => setDatosFiltro(data));
      await getCajas(1, itemsPerPage).then((data) => {
        setTableItems(data.data || data);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      });
    };
    cargarDatosIniciales();
  }, [id]);

  useEffect(() => {
    fetchCajas(currentPage, itemsPerPage, vendedorFiltro || null);
  }, [currentPage, vendedorFiltro, fechaFiltro]);
  // Evitar scroll cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isModalOpen]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clickDelete = async (e) => {
    e.preventDefault();
    const movId = e.target.value;

    setPause((prev) => ({ ...prev, [movId]: true }));

    try {
      await deleteMovCaja(movId);

      Swal.fire({
        title: 'Movimiento Eliminado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });

      fetchCajas(currentPage, itemsPerPage, vendedorFiltro || null);

      if (fechaFiltro) {
        await getResumenPorDia(fechaFiltro).then((data) => setDatosFiltro(data));
      } else {
        await getResumenTotal().then((data) => setDatosFiltro(data));
      }
    } catch (error) {
      Swal.fire({
        title: 'Error al eliminar',
        icon: 'error',
        text: error?.response?.data?.message || 'Error desconocido',
      });
    } finally {
      setPause((prev) => {
        const newPause = { ...prev };
        delete newPause[movId];
        return newPause;
      });
    }
  };

  const handleEdit = (mov) => {
    setIsModalOpen(true);
    setEditMode(mov.id);
    setFormEdit({
      fecha: mov.fecha,
      tipo: mov.tipo,
      metodoPago: mov.metodoPago,
      monto: mov.monto,
      descripcion: mov.descripcion,
      alumnoComisionId: mov.alumnoComision?.alumno?.id || '',
      vendedorId: mov.vendedor.id,
    });
    console.log(mov);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({
      ...formEdit,
      [name]: value,
    });
  };

  const handleAlumnoChange = (e) => {
    setFormEdit((prev) => ({
      ...prev,
      alumnoComisionId: e.target.value,
    }));
  };

  const handleVendedorChange = (e) => {
    setFormEdit((prev) => ({
      ...prev,
      vendedorId: e.target.value,
    }));
  };

  const handleSave = async (item) => {
    if (!isModalOpen) return;
    try {
      await editMovCaja(editMode, formEdit);
      Swal.fire({
        title: 'Caja Editada',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      setIsModalOpen(false);
      fetchCajas(currentPage, itemsPerPage, vendedorFiltro || null);
      //actualizar totales
      if (fechaFiltro) {
        await getResumenPorDia(fechaFiltro).then((data) => setDatosFiltro(data));
      } else {
        await getResumenTotal().then((data) => setDatosFiltro(data));
      }
    } catch (error) {
      Swal.fire({ title: 'Error al actualizar', icon: 'error' });
      console.log(error);
    } finally {
      setEditMode(null);
    }
  };

  const handleFiltrarVendedor = (e) => {
    const value = e.target.value;
    setVendedorFiltro(value);
    setCurrentPage(1);
  };

  const fetchCajas = async (page, limit = itemsPerPage, vendedorId = null) => {
    setLoading(true);
    await getCajas(page, limit, vendedorId).then((data) => {
      setTableItems(data.data || data);
      setTotalPages(data.totalPages || 1);
    });
    setLoading(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <>
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
              Historial de cajas
            </h3>
            <p className="text-gray-600 mt-2">En esta tabla estaran los movimientos realizados.</p>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={onFiltrar}
                className="px-4 py-2 text-white principal btnAz md:text-sm"
              >
                Filtrar por Fecha
              </button>
            </div>
            <div className="flex justify-items gap-3">
              <select
                value={vendedorFiltro}
                onChange={handleFiltrarVendedor}
                className="p-2 border rounded w-48"
              >
                <option value="">Filtrar por vendedor</option>
                {vend.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.name}
                  </option>
                ))}
              </select>
              {(vendedorFiltro || fechaFiltro) && (
                <button
                  onClick={() => {
                    setVendedorFiltro('');
                    setFechaFiltro('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {vendedorFiltro && tableItems.length > 0 && tableItems[0]?.vendedor && (
          <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">
              Vendedor Seleccionado
            </h4>
            <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Nombre:</span>
                <span className="sm:ml-2 text-gray-900 text-sm sm:text-base break-words">
                  {tableItems[0].vendedor.name}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Email:</span>
                <span className="sm:ml-2 text-gray-900 text-sm sm:text-base break-all">
                  {tableItems[0].vendedor.email || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Teléfono:</span>
                <span className="sm:ml-2 text-gray-900 text-sm sm:text-base">
                  {tableItems[0].vendedor.telefono || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <table
            key={`table-${currentPage}-${vendedorFiltro}`}
            className="w-full table-auto text-sm  text-center"
          >
            <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
              <tr>
                <th className="py-3 px-6">Fecha</th>
                <th className="py-3 px-6">Vendedor</th>
                <th className="py-3 px-6">Alumno</th>
                <th className="py-3 px-6">Tipo</th>
                <th className="py-3 px-6">Metodo de Pago</th>
                <th className="py-3 px-6">Descripcion</th>
                <th className="py-3 px-6">Monto</th>
                <th className="py-3 px-6">Comisión</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y text-center">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : (
                tableItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{formatToDisplay(item.fecha)}</td>

                    <td className="px-6 py-4 whitespace-nowrap">{item.vendedor?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.alumnoComision?.alumno.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.metodoPago}</td>
                    <td className="px-6 py-4">{item.descripcion}</td>
                    <td className="px-6 py-4 ">{item.monto}</td>
                    <td className="px-6 py-4">{item.alumnoComision?.comision?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <button
                          onClick={() => handleSave(item)}
                          className="px-4 py-2 text-white me-2 bg-green-500 hover:bg-green-600 rounded"
                        >
                          {pause[item.id] ? (
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
                            'Guardar'
                          )}
                        </button>
                      ) : (
                        <button
                          value={item.id}
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 text-white btnAz rounded me-2"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        value={item.id}
                        onClick={clickDelete}
                        className=" px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                      >
                        {pause[item.id] ? (
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
                    </td>
                  </tr>
                ))
              )}
              <tr>
                <th className="py-3 px-6">Ingresos</th>
                <th className="py-3 px-6">${datosFiltro.ingresos}</th>
              </tr>
              <tr>
                <th className="py-3 px-6">Egresos</th>
                <th className="py-3 px-6">${datosFiltro.egresos}</th>
              </tr>
              <tr>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6">${datosFiltro.total}</th>
              </tr>
            </tbody>
          </table>
          {isModalOpen && (
            <ModalEditar
              onClose={() => {
                setIsModalOpen(false);
                setEditMode(null);
              }}
              formData={formEdit}
              onChange={handleChange}
              onSave={handleSave}
              alu={alu}
              vend={vend}
            />
          )}
        </div>
      </>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Outlet />
    </div>
  );
};

export default DashCajas;
