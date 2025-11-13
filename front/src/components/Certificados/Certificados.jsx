import { useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import Swal from 'sweetalert2';
import { getCertId, postCert } from '../../services/Certificados.service';

const Certificados = () => {
  const [pause, setPause] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [certificado, setCertificado] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    nombre: '',
    dni: '',
    curso: '',
    fechaInicio: '',
    fechaFin: '',
    horas: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);

    try {
      await postCert(formData);
      Swal.fire({
        title: 'Certificado Creado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      setFormData({
        numero: '',
        nombre: '',
        dni: '',
        curso: '',
        fechaInicio: '',
        fechaFin: '',
        horas: '',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error al crear certificado',
        icon: 'error',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setPause(false);
    }
  };

  const handleBuscar = async () => {
    if (!busqueda) return;

    setPause(true);
    try {
      const data = await getCertId(busqueda);
      setCertificado(data);
      Swal.fire({
        title: 'Certificado Encontrado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: 'Certificado no encontrado',
        icon: 'error',
        text: error.response?.data?.message || error.message,
      });
      setCertificado(null);
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Gestión de Certificados
          </h3>
          <p className="text-gray-600 mt-2">Crear y buscar certificados de cursos</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buscar Certificado */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-4">Buscar Certificado</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Número de certificado"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleBuscar}
              className="px-4 py-2 btnAz text-white rounded"
              disabled={pause}
            >
              {pause ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {certificado && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h5 className="font-semibold">Certificado #{certificado.numero}</h5>
              <p>
                <strong>Nombre:</strong> {certificado.nombre}
              </p>
              <p>
                <strong>DNI:</strong> {certificado.dni}
              </p>
              <p>
                <strong>Curso:</strong> {certificado.curso}
              </p>
              <p>
                <strong>Horas:</strong> {certificado.horas}
              </p>
              <p>
                <strong>Fecha Inicio:</strong> {certificado.fechaInicio}
              </p>
              <p>
                <strong>Fecha Fin:</strong> {certificado.fechaFin}
              </p>
            </div>
          )}
        </div>

        {/* Crear Certificado */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Logo" width="40" />
            <h4 className="text-lg font-semibold">Crear Certificado</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Curso</label>
              <input
                type="text"
                name="curso"
                value={formData.curso}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Horas</label>
              <input
                type="number"
                name="horas"
                value={formData.horas}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button type="submit" className="w-full btnAz text-white py-2 rounded" disabled={pause}>
              {pause ? 'Creando...' : 'Crear Certificado'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
