import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  deleteMovCaja,
  editMovCaja,
  getCajas,
  GetMovsByVendedor,
  getMovimientosPorDia,
  getResumenPorDia,
  getResumenTotal,
} from '../../../helpers/Cajas.service';
import { getAlu } from '../../../helpers/Alumnos.service';
import { getVendedores } from '../../../helpers/Vendedores.service';
import Pagination from '../../Pagination/Pagination';
import Swal from 'sweetalert2';

const DashCajas = () => {
  const { id } = useParams();
  const idVend = localStorage.getItem('token');
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [alu, setAlu] = useState([]);
  const [vend, setVend] = useState([]);
  const [todosLosMovimientos, setTodosLosMovimientos] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [vendedorFiltro, setVendedorFiltro] = useState('');
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [filtrandoPorVendedor, setFiltrandoPorVendedor] = useState(false);
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
    if (filtrandoPorVendedor && vendedorFiltro) {
      fetchMovimientosPorVendedor(vendedorFiltro, currentPage);
    } else {
      fetchCajas(currentPage);
    }
  }, [currentPage, filtrandoPorVendedor, vendedorFiltro]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clickDelete = async (e) => {
    e.preventDefault();
    const movId = e.target.value;

    setPause((prev) => ({ ...prev, [movId]: true }));

    await deleteMovCaja(e.target.value).then(() => {
      try {
        Swal.fire({
          title: 'Movimiento Eliminado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause((prev) => {
            const newPause = { ...prev };
            delete newPause[movId];
            return newPause;
          });

          setTableItems((prev) => prev.filter((item) => item.id !== movId));
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleEdit = (mov) => {
    setEditMode(mov.id);
    setFormEdit({
      fecha: fecha,
      tipo: mov.tipo,
      metodoPago: mov.metodoPago,
      monto: mov.monto,
      descripcion: mov.descripcion,
      alumnoComisionId: mov.alumnoComision.alumno.id,
      vendedorId: mov.vendedor.id,
    });
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
    setPause((prev) => ({ ...prev, [item.id]: true }));
    await editMovCaja(item.id, formEdit).then((data) => {
      try {
        Swal.fire({
          title: 'Caja Editada',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({ title: 'Error al actualizar', icon: 'error' });
      } finally {
        setPause((prev) => ({ ...prev, [item.id]: false }));
        setEditMode(null);
      }
    });
  };

  const handleFiltrarVendedor = async (e) => {
    const value = e.target.value;
    setVendedorFiltro(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setVendedorSeleccionado(null);
      setFiltrandoPorVendedor(false);
      fetchCajas(1);
      return;
    }

    const vendedor = vend.find((v) => v.id === value);
    setVendedorSeleccionado(vendedor);
    setFiltrandoPorVendedor(true);
    fetchMovimientosPorVendedor(value, 1);
  };

  const fetchMovimientosPorVendedor = async (vendedorId, page) => {
    setLoading(true);
    await GetMovsByVendedor(vendedorId, page, itemsPerPage).then((data) => {
      setTableItems(data.data || data);
      setTotalPages(data.totalPages || 1);
    });
    setLoading(false);
  };

  const fetchCajas = async (page) => {
    setLoading(true);
    await getCajas(page, itemsPerPage).then((data) => {
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
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>

        {vendedorSeleccionado && (
          <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">Vendedor Seleccionado</h4>
            <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Nombre:</span>
                <span className="sm:ml-2 text-gray-900 text-sm sm:text-base break-words">{vendedorSeleccionado.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Email:</span>
                <span className="sm:ml-2 text-gray-900 text-sm sm:text-base break-all">{vendedorSeleccionado.email || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium text-gray-700 text-sm sm:text-base">Teléfono:</span>
                <span className="sm:ml-2 text-gray-900 text-sm sm:text-base">{vendedorSeleccionado.telefono || 'N/A'}</span>
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
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y text-center">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : (
                tableItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input
                          type="text"
                          name="fecha"
                          id="fecha"
                          disabled
                          defaultValue={formatToDisplay(fecha)}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        formatToDisplay(item.fecha)
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select
                          name="vendedorId"
                          value={formEdit.vendedorId}
                          onChange={handleVendedorChange}
                        >
                          <option value="">Seleccione un vendedor</option>
                          {vend.map((vendedor) => (
                            <option key={vendedor.id} value={vendedor.id}>
                              {vendedor.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.vendedor?.name || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select
                          name="alumnoComisionId"
                          value={formEdit.alumnoComisionId}
                          onChange={handleAlumnoChange}
                        >
                          <option value="">Seleccione un alumno</option>
                          {alu.map((alumno) => (
                            <option key={alumno.id} value={alumno.id}>
                              {alumno.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.alumnoComision?.alumno.name || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select name="tipo" value={formEdit.tipo} onChange={handleChange}>
                          <option value="">Seleccione</option>
                          <option value="Ingreso">Ingreso</option>
                          <option value="Egreso">Egreso</option>
                          <option value="Transferencia">Transferencia de caja</option>
                        </select>
                      ) : (
                        item.tipo
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select
                          name="metodoPago"
                          value={formEdit.metodoPago}
                          onChange={handleChange}
                        >
                          <option value="">Seleccione</option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Debito">Debito</option>
                          <option value="Credito">Credito</option>
                        </select>
                      ) : (
                        item.metodoPago
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editMode === item.id ? (
                        <input
                          type="text"
                          name="descripcion"
                          value={formEdit.descripcion || ''}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        item.descripcion
                      )}
                    </td>
                    <td className="px-6 py-4 ">
                      {editMode === item.id ? (
                        <input
                          type="number"
                          name="monto"
                          value={formEdit.monto || ''}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        item.monto
                      )}
                    </td>
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
        </div>
      </>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Outlet />
    </div>
  );
};

export default DashCajas;
