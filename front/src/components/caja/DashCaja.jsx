import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { editMovCaja, GetCajaByVendedor, descargarExcelCaja } from '../../helpers/Cajas.service';
import { getAlu } from '../../helpers/Alumnos.service';
import { getVendedores } from '../../helpers/Vendedores.service';
import Swal from 'sweetalert2';
import AccionesDropdown from './Dropdowns/AccionesDropdown';
import FiltrosDropDown from './Dropdowns/FiltrosDropDown';
import CajaResumen from './Dropdowns/CajaResumen';
import { ModalEditar } from './ModalEditar';

const DashCaja = () => {
  const idVend = localStorage.getItem('token');
  const fecha = new Date();
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alu, setAlu] = useState([]);
  const [vend, setVend] = useState([]);
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
  const [sesionCaja, setSesionCaja] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const recargarDatos = async () => {
    try {
      const data = await GetCajaByVendedor(idVend);
      const ultimaSesion = data.length > 0 ? data[data.length - 1] : null;
      setSesionCaja(ultimaSesion);
      const movimientosAplanados = data.flatMap((sesion) => sesion.movimientos || []);
      setTableItems(movimientosAplanados);
      console.log(movimientosAplanados);
    } catch (error) {
      const msg = error?.response?.data?.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      });
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [aluData, vendData] = await Promise.all([getAlu(), getVendedores()]);
        setAlu(aluData);
        setVend(vendData);
      } catch (error) {
        const msg = error?.response?.data?.message || 'Error al obtener los datos.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
        });
      }
    };
    cargarDatos();
    recargarDatos();
  }, [refreshKey]);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isModalOpen]);

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
      vendedorId: mov.vendedor?.id || idVend,
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

  const handleSave = async () => {
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
      setTimeout(() => {
        recargarDatos();
      }, 100);
    } catch (error) {
      console.error('Error al editar:', error);
      Swal.fire({ title: 'Error al actualizar', icon: 'error' });
    } finally {
      setEditMode(null);
    }
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

  const descargarExcel = async () => {
    try {
      const blob = await descargarExcelCaja(sesionCaja.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caja-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Excel descargado',
        text: 'El archivo se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      let errorMessage = 'No se pudo descargar el Excel';

      // Verificar si es un error de respuesta del servidor
      if (error?.response?.status === 400 || error?.response?.status === 404) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error?.response?.data) {
        // Si hay datos en la respuesta pero es un blob de error
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al generar Excel',
        text: errorMessage,
        confirmButtonText: 'Entendido',
      });
    }
  };
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <CajaResumen sesionCaja={sesionCaja}></CajaResumen>
      {!isSubRoute && (
        <>
          <div className="items-start justify-between flex flex-col md:flex-row">
            <div className="max-w-lg mt-5">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">CAJA</h3>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 md:ml-auto mt-4 md:mt-0">
              <FiltrosDropDown onFiltrar={filtrar} />
              <AccionesDropdown
                idVend={idVend}
                onCajaAction={() => setRefreshKey((prev) => prev + 1)}
                onDescargarExcel={descargarExcel}
              />
            </div>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Fecha</th>
                  <th className="py-3 px-6">Alumno</th>
                  <th className="py-3 px-6">Dni</th>
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
                    <td className="px-6 py-4 whitespace-nowrap">{formatToDisplay(item.fecha)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.alumnoComision?.alumno.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.alumnoComision?.alumno.dni || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.metodoPago}</td>
                    <td className="px-6 py-4">{item.descripcion || '-'}</td>
                    <td className="px-6 py-4">{item.monto}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.subcategoria?.categoria.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.subcategoria?.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 text-white btnAz rounded me-2"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
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
      {isModalOpen && (
        <ModalEditar
          formData={formEdit}
          onClose={() => {
            setIsModalOpen(false);
            setEditMode(null);
          }}
          onSave={handleSave}
          onChange={handleChange}
          vend={vend}
          alu={alu}
        />
      )}
    </div>
  );
};

export default DashCaja;
