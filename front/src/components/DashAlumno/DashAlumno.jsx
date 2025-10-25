import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAluID } from '../../services/Alumnos.service';
import { Spinner } from '../Spinner/Spinner';
import Swal from 'sweetalert2';

const DashAlumno = () => {
  const { alumnoId } = useParams();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAlumno = async () => {
      if (!alumnoId) return;
      
      try {
        const data = await getAluID(alumnoId);
        setAlumno(data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar alumno',
          text: error.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarAlumno();
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
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Alumno no encontrado
          </h3>
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
              <span className="ml-2">{alumno.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">DNI:</span>
              <span className="ml-2">{alumno.dni}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Teléfono:</span>
              <span className="ml-2">{alumno.tel}</span>
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

        {/* Comisiones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 principal">Comisiones</h4>
          {alumno.alumnoComisiones && alumno.alumnoComisiones.length > 0 ? (
            <div className="space-y-3">
              {alumno.alumnoComisiones.map((ac) => (
                <div key={ac.id} className="p-3 bg-gray-50 rounded border">
                  <div className="font-medium">{ac.comision?.name}</div>
                  <div className="text-sm text-gray-600">
                    Curso: {ac.comision?.curso?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Horario: {ac.comision?.day} {ac.comision?.hour?.start}-{ac.comision?.hour?.end}
                  </div>
                  <div className="text-sm">
                    Estado: 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      ac.state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ac.state ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tiene comisiones asignadas</p>
          )}
        </div>
      </div>

      {/* Pagos */}
      {alumno.pagos && alumno.pagos.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4 principal">Historial de Pagos</h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-6 text-left">Fecha</th>
                  <th className="py-3 px-6 text-left">Monto</th>
                  <th className="py-3 px-6 text-left">Método</th>
                  <th className="py-3 px-6 text-left">Cuota</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {alumno.pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td className="px-6 py-4">
                      {new Date(pago.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">${pago.monto}</td>
                    <td className="px-6 py-4">{pago.metodoPago}</td>
                    <td className="px-6 py-4">{pago.cuota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashAlumno;