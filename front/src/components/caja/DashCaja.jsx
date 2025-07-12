import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  editMovCaja,
  getAlu,
  GetCajaByVendedor,
} from '../queris/queris';
import Swal from 'sweetalert2';
import AccionesDropdown from './Dropdowns/AccionesDropdown';
import FiltrosDropDown from './Dropdowns/FiltrosDropDown';

const DashCaja = () => {
  const idVend = localStorage.getItem('token');
  const fecha = new Date();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [alu, setAlu] = useState([]);
  const [formEdit, setFormEdit] = useState({
    fecha: '',
    tipo: '',
    metodoPago: '',
    monto: '',
    dexcripcion: '',
    alumnoComisionId: '',
    vendedorId: idVend,
  });
  const [filtrados, setFiltrados] = useState(tableItems);

  const navigate = useNavigate();
  const isSubRoute = location.pathname.includes('crear');

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const peticion = async () => {
      await GetCajaByVendedor(idVend).then((data) => {
        setTableItems(data.movimientos);
      });
    };
    const alumnos = async () => {
      await getAlu().then((data) => {
        try {
          setAlu(data);
        } catch (error) {
          console.log(error);
        }
      });
    };
    alumnos();
    peticion();
  }, []);

  const handleEdit = (mov) => {
    setEditMode(mov.id);
    setFormEdit({
      fecha: fecha,
      tipo: mov.tipo,
      metodoPago: mov.metodoPago,
      monto: mov.monto,
      descripcion: mov.descripcion,
      alumnoComisionId: mov.alumnoComisionId,
      vendedorId: idVend,
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
    console.log(e.target.value);
    setFormEdit((prev) => ({
      ...prev,
      alumnoComisionId: e.target.value,
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
  const filtrar = async (filtros, setPaused) => {
    const filtrosVacios = Object.values(filtros).every((v) => v.trim() === '');
    if (filtrosVacios) {
      setPaused(true);
      const data = await GetCajaByVendedor(idVend); // ⏳ espera la respuesta
      setTableItems(data.movimientos); // ✅ actualiza tabla
      setPaused(false);
      return;
    }
    const filtrado = tableItems.filter((item) => {
      return (
        (!filtros.alumno ||
          item.alumnoComision?.alumno?.dni?.toString().includes(filtros.alumno)) &&
        (!filtros.tipo || item.tipo.toLowerCase().includes(filtros.tipo.toLowerCase())) &&
        (!filtros.metodoPago ||
          item.metodoPago.toLowerCase().includes(filtros.metodoPago.toLowerCase())) &&
        (!filtros.descripcion ||
          item.descripcion?.toLowerCase().includes(filtros.descripcion.toLowerCase())) &&
        (!filtros.fecha || formatToDisplay(item.fecha).startsWith(filtros.fecha)) &&
        (!filtros.categoria ||
          item.subcategoria?.categoria?.nombre?.toLowerCase() ===
            filtros.categoria.toLowerCase()) &&
        (!filtros.subcategoria ||
          item.subcategoria?.nombre?.toLowerCase() === filtros.subcategoria.toLowerCase())
      );
    });

    setTableItems(filtrado);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
          <div className="items-start justify-between flex flex-col md:flex-row ">
            <div className="max-w-lg">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
                Historial de cajas
              </h3>
              <p className="text-gray-600 mt-2">
                En esta tabla estarán los movimientos realizados.
              </p>
            </div>
            <FiltrosDropDown onFiltrar={filtrar}></FiltrosDropDown>
            <AccionesDropdown idVend={idVend}></AccionesDropdown>
          </div>

          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Fecha</th>
                  <th className="py-3 px-6">Alumno</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Metodo de Pago</th>
                  <th className="py-3 px-6">Descripcion</th>
                  <th className="py-3 px-6">Monto</th>
                  <th className="py-3 px-6">Categoria</th>
                  <th className="py-3 px-6">Sub Categorias</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y text-center">
                {tableItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input
                          type="text"
                          name="fecha"
                          id="fecha"
                          disabled
                          value={formatToDisplay(fecha)}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        <>{formatToDisplay(item.fecha)}</>
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
                          {alu.map((alumnoComision) => (
                            <option key={alumnoComision.id} value={alumnoComision.id}>
                              {alumnoComision.name}
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
                          <option value="ingreso">Ingreso</option>
                          <option value="egreso">Egreso</option>
                          <option value="transferencia">Transferencia de caja</option>
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
                          <option value="efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia</option>
                          <option value="debito">Debito</option>
                          <option value="credito">Credito</option>
                        </select>
                      ) : (
                        item.metodoPago
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input
                          type="text"
                          name="descripcion"
                          value={formEdit.descripcion || ''}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        item.descripcion || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                        <input
                          type="number"
                          name="monto"
                          value={formEdit.monto || ''}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        item.subcategoria?.categoria.nombre || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input
                          type="number"
                          name="subcategoriaId"
                          value={formEdit.subcategoriaId || ''}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        item.subcategoria?.nombre || '-'
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
                            <i className="fa-solid fa-floppy-disk"></i>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 text-white btnAz rounded me-2"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      )}
                      {item.tipo == 'Egreso' ? (
                        <>
                          <button
                            value={item.id}
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
                              <i className="fa-solid fa-print"></i>
                            )}
                          </button>
                        </>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default DashCaja;
