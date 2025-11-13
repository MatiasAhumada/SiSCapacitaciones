import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAluComID } from '../../services/Comisiones.service';
import { descargarComprobantePDF } from '../../services/Comprobantes.service';
import { deleteMovCaja, editMovCaja } from '../../services/Cajas.service';
import { getVendedores } from '../../services/Vendedores.service';
import { ModalEditar } from '../ModalEditar/ModalEditar';
import { Spinner } from '../Spinner/Spinner';
import Swal from 'sweetalert2';

const DashAlumno = () => {
  const { alumnoId } = useParams();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [vendedores, setVendedores] = useState([]);

  const handleEditPago = (pago) => {
    setFormData({
      id: pago.id,
      fecha: pago.fecha,
      vendedorId: pago.vendedor?.id || '',
      alumnoComisionId: pago.alumnoComision?.id || '',
      alumnoNombre: pago.alumnoComision?.alumno?.name || alumno?.alumno?.name || alumno?.name || '',
      tipo: 'Ingreso',
      metodoPago: pago.metodoPago || '',
      descripcion: pago.descripcion || '',
      monto: pago.monto || '',
      cuota: pago.cuota || '',
      mesCuota: pago.mesCuota || '',
    });
    setIsModalOpen(true);
  };

  const handlePrintPago = async (pago) => {
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
    }
  };

  const handleDeletePago = async (pagoId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteMovCaja(pagoId);
        Swal.fire({
          icon: 'success',
          title: 'Pago eliminado',
          text: 'El pago se ha eliminado correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
        // Recargar datos
        const data = await getAluComID(alumnoId);
        setAlumno(data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar pago',
          text: error.response?.data?.message || error.message,
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      await editMovCaja(formData.id, formData);
      Swal.fire({
        icon: 'success',
        title: 'Pago actualizado',
        text: 'El pago se ha actualizado correctamente',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsModalOpen(false);
      // Recargar datos
      const data = await getAluComID(alumnoId);
      setAlumno(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar pago',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (!alumnoId) return;

      try {
        const [alumnoData, vendedoresData] = await Promise.all([
          getAluComID(alumnoId),
          getVendedores(),
        ]);
        setAlumno(alumnoData);
        setVendedores(vendedoresData);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: error.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [alumnoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner color="black" />
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Alumno no encontrado</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
          Información del Alumno
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información Personal */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 principal">Datos Personales</h4>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-600">Nombre:</span>
              <span className="ml-2">{alumno.alumno?.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">DNI:</span>
              <span className="ml-2">{alumno.alumno?.dni}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Teléfono:</span>
              <span className="ml-2">{alumno.alumno?.tel}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2">{alumno.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Edad:</span>
              <span className="ml-2">{alumno.age}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Dirección:</span>
              <span className="ml-2">{alumno.address}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Localidad:</span>
              <span className="ml-2">{alumno.locality}</span>
            </div>
          </div>
        </div>

        {/* Comisión */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 principal">Comisión</h4>
          {alumno.comision ? (
            <div className="p-3 bg-gray-50 rounded border">
              <div className="font-medium">{alumno.comision.name}</div>
              <div className="text-sm text-gray-600">Día: {alumno.comision.day}</div>
              <div className="text-sm text-gray-600">
                Horario: {alumno.comision.hour?.start}-{alumno.comision.hour?.end}
              </div>
              <div className="text-sm">
                Estado:
                <span
                  className={`ml-1 px-2 py-1 rounded text-xs ${
                    alumno.state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {alumno.state ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No tiene comisión asignada</p>
          )}
        </div>
      </div>

      {/* Pagos */}
      {alumno.pagos && alumno.pagos.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-bold mb-6 principal">Historial de Pagos</h4>

          {/* Vista Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Fecha
                    </th>
                    <th className="py-4 px-6 text-left font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Monto
                    </th>
                    <th className="py-4 px-6 text-left font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Método
                    </th>
                    <th className="py-4 px-6 text-left font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Cuota
                    </th>
                    <th className="py-4 px-6 text-left font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Mes
                    </th>
                    <th className="py-4 px-6 text-center font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alumno.pagos.map((pago, index) => (
                    <tr
                      key={pago.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(pago.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">${pago.monto}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            pago.metodoPago === 'Efectivo'
                              ? 'bg-green-100 text-green-800'
                              : pago.metodoPago === 'Transferencia'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {pago.metodoPago}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{pago.cuota}</td>
                      <td className="px-6 py-4 text-gray-900">{pago.mesCuota}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditPago(pago)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Editar pago"
                          >
                            <i className="fa-solid fa-pen text-sm"></i>
                          </button>
                          <button
                            onClick={() => handlePrintPago(pago)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Imprimir comprobante"
                          >
                            <i className="fa-solid fa-print text-sm"></i>
                          </button>
                          <button
                            onClick={() => handleDeletePago(pago.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            title="Eliminar pago"
                          >
                            <i className="fa-solid fa-trash text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vista Mobile */}
          <div className="md:hidden space-y-4">
            {alumno.pagos.map((pago) => (
              <div
                key={pago.id}
                className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-lg text-green-600">${pago.monto}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(pago.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPago(pago)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <i className="fa-solid fa-pen text-sm"></i>
                    </button>
                    <button
                      onClick={() => handlePrintPago(pago)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                    >
                      <i className="fa-solid fa-print text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDeletePago(pago.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <i className="fa-solid fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Método:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        pago.metodoPago === 'Efectivo'
                          ? 'bg-green-100 text-green-800'
                          : pago.metodoPago === 'Transferencia'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pago.metodoPago}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cuota:</span>
                    <span className="ml-2 font-medium">{pago.cuota}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Mes:</span>
                    <span className="ml-2 font-medium">{pago.mesCuota}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <ModalEditar
          formData={formData}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onChange={handleChange}
          vend={vendedores}
          alu={[alumno]}
          isFromAlumno={true}
        />
      )}
    </div>
  );
};

export default DashAlumno;
