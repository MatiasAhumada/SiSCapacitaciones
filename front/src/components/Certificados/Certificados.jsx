import { useState, useEffect } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import { getCertId, postCert } from '../../services/Certificados.service';
import { getAluID } from '../../services/Alumnos.service';
import { getAllCursos } from '../../services/Cursos.service';
import { Spinner } from '../Spinner/Spinner';
import { clientErrorHandler, clientSuccessHandler, clientWarningHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const Certificados = () => {
  const [pause, setPause] = useState(false);
  const [pauseAlumno, setPauseAlumno] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [certificado, setCertificado] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [dniAlumno, setDniAlumno] = useState('');
  const [formData, setFormData] = useState({
    numero: '',
    link: '',
    alumnoId: '',
    cursoId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cursosData = await getAllCursos();
        setCursos(cursosData);
      } catch (error) {
        clientErrorHandler(error.message || ERROR_MESSAGES.ERROR_CARGAR_DATOS);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAlumnoClick = async (e) => {
    e.preventDefault();
    setPauseAlumno(true);
    try {
      const data = await getAluID(dniAlumno);
      setAlumnoSeleccionado(data);
      setFormData((prev) => ({
        ...prev,
        alumnoId: data.id,
      }));
    } catch (error) {
      clientErrorHandler(error.message || ERROR_MESSAGES.ERROR_ALUMNO_NO_ENCONTRADO);
      setAlumnoSeleccionado(null);
    } finally {
      setPauseAlumno(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);

    try {
      if (!formData.numero) throw new Error('El número de certificado es obligatorio');
      if (!formData.link) throw new Error('El link es obligatorio');
      if (!alumnoSeleccionado) throw new Error('Debe buscar y seleccionar un alumno');
      if (!formData.cursoId) throw new Error('Debe seleccionar un curso');

      await postCert(formData);
      clientSuccessHandler(SUCCESS_MESSAGES.CERTIFICADO_GENERADO);
      setFormData({
        numero: '',
        link: '',
        alumnoId: '',
        cursoId: '',
      });
      setAlumnoSeleccionado(null);
      setDniAlumno('');
    } catch (error) {
      clientErrorHandler(error.message || ERROR_MESSAGES.ERROR_CREAR_CERTIFICADO);
    } finally {
      setPause(false);
    }
  };

  const handleBuscar = async () => {
    if (!busqueda) {
      clientWarningHandler(ERROR_MESSAGES.NUMERO_CERTIFICADO_REQUERIDO);
      return;
    }

    setPause(true);
    try {
      const data = await getCertId(busqueda);
      if (data?.link) {
        window.open(data.link, '_blank');
        clientSuccessHandler(SUCCESS_MESSAGES.CERTIFICADO_ENCONTRADO);
      }
      setCertificado(data);
    } catch (error) {
      clientErrorHandler(error.message || ERROR_MESSAGES.ERROR_BUSCAR_CERTIFICADO);
      setCertificado(null);
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex mb-8">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
            Gestión de Certificados
          </h3>
          <p className="text-gray-600 mt-2">Crear y buscar certificados de cursos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buscar Certificado */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Logo" width="40" />
            <h4 className="text-lg font-semibold principal">Buscar Certificado</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Número de Certificado
              </label>
              <input
                type="text"
                placeholder="Ingrese el número"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleBuscar}
              className="w-full btnAz text-white py-3 rounded-lg font-medium flex items-center justify-center"
              disabled={pause}
            >
              {pause ? <Spinner color="white" /> : 'Buscar Certificado'}
            </button>
          </div>
        </div>

        {/* Crear Certificado */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Logo" width="40" />
            <h4 className="text-lg font-semibold principal">Crear Certificado</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Número de Certificado
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ej: CERT-2024-001"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Link del Certificado
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Alumno</label>
              <div className="relative">
                <input
                  type="number"
                  value={dniAlumno}
                  onChange={(e) => setDniAlumno(e.target.value)}
                  className="w-full p-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DNI del alumno"
                />
                <button
                  type="button"
                  onClick={handleAlumnoClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btnAz text-white text-sm px-4 py-1.5 rounded-md min-w-[100px] flex items-center justify-center"
                >
                  {pauseAlumno ? <Spinner color="white" /> : 'Buscar'}
                </button>
              </div>
              {alumnoSeleccionado && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  Alumno: {alumnoSeleccionado.name} - DNI: {alumnoSeleccionado.dni}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Curso</label>
              <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione un curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full btnAz text-white py-3 rounded-lg font-medium flex items-center justify-center"
              disabled={pause}
            >
              {pause ? <Spinner color="white" /> : 'Crear Certificado'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
