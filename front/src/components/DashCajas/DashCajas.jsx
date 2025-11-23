import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { editMovCaja, GetCajaByVendedor, descargarExcelCaja } from '../../services/Cajas.service';
import { getAlu } from '../../services/Alumnos.service';
import { getVendedores } from '../../services/Vendedores.service';
import AccionesDropdown from '../AccionesDropdown/AccionesDropdown';
import { ModalEditar } from '../ModalEditar/ModalEditar';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const DashCajas = () => {
  const { user } = useAuth();
  const [tableItems, setTableItems] = useState([]);
  const [pause] = useState({});
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
    vendedorId: user?.id,
  });
  const [sesionCaja, setSesionCaja] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    if (!user?.id) return;
    try {
      const response = await GetCajaByVendedor(user.id);
      const data = response.data || response;
      const ultimaSesion = data.length > 0 ? data[data.length - 1] : null;
      setSesionCaja(ultimaSesion);
      const movimientosAplanados = data.flatMap((sesion) => sesion.movimientos || []);
      setTableItems(movimientosAplanados);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      clientErrorHandler(msg || ERROR_MESSAGES.ERROR_CARGAR_DATOS);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [aluData, vendData] = await Promise.all([getAlu(), getVendedores()]);
        setAlu(aluData);
        setVend(vendData);
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message;
        clientErrorHandler(msg || ERROR_MESSAGES.ERROR_CARGAR_DATOS);
      }
    };
    cargarDatos();
    recargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, user?.id]);

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
      vendedorId: mov.vendedor?.id || user?.id,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({
      ...formEdit,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!isModalOpen) return;

    try {
      await editMovCaja(editMode, formEdit);
      clientSuccessHandler(SUCCESS_MESSAGES.CAJA_EDITADA);
      setIsModalOpen(false);
      setTimeout(() => {
        recargarDatos();
      }, 100);
    } catch (error) {
      clientErrorHandler(
        error?.response?.data?.message || error?.message || ERROR_MESSAGES.ERROR_ACTUALIZAR_CAJA
      );
    } finally {
      setEditMode(null);
    }
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

      clientSuccessHandler(SUCCESS_MESSAGES.EXCEL_DESCARGADO);
    } catch (error) {
      let errorMessage = 'No se pudo descargar el Excel';

      if (error?.response?.status === 400 || error?.response?.status === 404) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error?.response?.data) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }

      clientErrorHandler(errorMessage);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {/* CajaResumen component removed */}
      <div className="items-start justify-between flex flex-col md:flex-row">
        <div className="max-w-lg mt-5">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">CAJA</h3>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 md:ml-auto mt-4 md:mt-0">
          <AccionesDropdown
            idVend={user?.id}
            onCajaAction={() => setRefreshKey((prev) => prev + 1)}
            onDescargarExcel={descargarExcel}
          />
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-center">
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
                <td className="px-6 py-4 whitespace-nowrap">{item.subcategoria?.nombre || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-white btnAz rounded me-2"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  {item.tipo == 'Egreso' && (
                    <button
                      value={item.id}
                      className="px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default DashCajas;
