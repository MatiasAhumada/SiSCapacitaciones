import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { editMovCaja, GetCajaByVendedor, descargarExcelCaja } from '../../services/Cajas.service';
import { getAlu } from '../../services/Alumnos.service';
import { getVendedores } from '../../services/Vendedores.service';
import { descargarComprobantePDF } from '../../services/Comprobantes.service';
import Swal from 'sweetalert2';
import AccionesDropdown from '../AccionesDropdown/AccionesDropdown';
import { ModalEditar } from '../ModalEditar/ModalEditar';
import CajaResumen from '../CajaResumen/CajaResumen';

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
    descripcion: '',
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
      console.log(data);
      const ultimaSesion = data.length > 0 ? data[data.length - 1] : null;
      setSesionCaja(ultimaSesion);
      const movimientosAplanados = data.flatMap((sesion) => sesion.movimientos || []);
      setTableItems(movimientosAplanados);
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
      id: mov.id,
      fecha: mov.fecha,
      tipo: mov.tipo || '',
      metodoPago: mov.metodoPago || '',
      monto: mov.monto || '',
      descripcion: mov.descripcion || '',
      cuota: mov.cuota || '',
      mesCuota: mov.mesCuota || '',
      alumnoComisionId: mov.alumnoComision?.id || '',
      alumnoNombre: mov.alumnoComision?.alumno?.name || '',
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

  const handlePrintPago = async (pago) => {
    setPause((prev) => ({ ...prev, [pago.id]: true }));
    try {
      await descargarComprobantePDF(pago.id);
      Swal.fire({
        icon: 'success',
        title: 'Comprobante descargado',
        text: 'El comprobante se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al descargar comprobante',
        text: error.message,
      });
    } finally {
      setPause((prev) => ({ ...prev, [pago.id]: false }));
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Caja</h1>
            <p className="text-gray-600 mt-1">Gestiona los movimientos de tu caja diaria</p>
          </div>
          <AccionesDropdown
            idVend={idVend}
            onCajaAction={() => setRefreshKey((prev) => prev + 1)}
            onDescargarExcel={descargarExcel}
          />
        </div>

        {/* Resumen integrado */}
        <CajaResumen sesionCaja={sesionCaja} />

        {/* Tabla de movimientos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Movimientos del Día</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">Fecha</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">Alumno</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">DNI</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700">Tipo</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700">
                    Método de Pago
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">Descripción</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">Monto</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">Categoría</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">Subcategoría</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatToDisplay(item.fecha)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.alumnoComision?.alumno.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.alumnoComision?.alumno.dni || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.tipo === 'Ingreso'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.metodoPago === 'Efectivo'
                            ? 'bg-green-100 text-green-800'
                            : item.metodoPago === 'Digital Tobias'
                              ? 'bg-purple-100 text-purple-800'
                              : item.metodoPago === 'Digital Javier'
                                ? 'bg-orange-100 text-orange-800'
                                : item.metodoPago === 'Credito'
                                  ? 'bg-pink-100 text-pink-800'
                                  : item.metodoPago === 'Ferro'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.metodoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.descripcion || '-'}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      ${new Intl.NumberFormat('es-AR').format(item.monto)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.subcategoria?.categoria.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.subcategoria?.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <i className="fa-solid fa-pen text-sm"></i>
                        </button>
                        {item.tipo === 'Ingreso' && (
                          <button
                            onClick={() => handlePrintPago(item)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Descargar comprobante"
                          >
                            {pause[item.id] ? (
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z" />
                              </svg>
                            ) : (
                              <i className="fa-solid fa-print text-sm"></i>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
