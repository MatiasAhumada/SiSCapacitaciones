import { useEffect, useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllCursos } from '../../services/Cursos.service';
import { getProfes } from '../../services/Profesores.service';
import { postComision } from '../../services/Comisiones.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const CreateComision = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pause, setPause] = useState(false);
  const [profes, setProfes] = useState([]);
  const [cursos, setcursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [searchCurso, setSearchCurso] = useState('');
  const [showCursos, setShowCursos] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    hour: {
      start: '',
      end: '',
    },
    cursoId: '',
    profesorId: '',
    sucursalId: user?.sucursalId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      hour: {
        ...prevData.hour,
        [name]: value,
      },
      sucursalId: user?.sucursalId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);
    try {
      await postComision(formData);
      clientSuccessHandler(SUCCESS_MESSAGES.COMISION_CREADA);
      navigate('/admin/comisiones');
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CREAR_COMISION
      );
    } finally {
      setPause(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [profesData, cursosData] = await Promise.all([getProfes(), getAllCursos()]);
        setProfes(profesData);
        setcursos(cursosData || []);
        setFilteredCursos(cursosData || []);
      } catch (error) {
        clientErrorHandler(
          error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CARGAR_DATOS
        );
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.curso-dropdown')) {
        setShowCursos(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dias = [
    { value: 'Lunes' },
    { value: 'Martes' },
    { value: 'Miercoles' },
    { value: 'Jueves' },
    { value: 'Viernes' },
    { value: 'Sabado' },
    { value: 'Domingo' },
  ];
  const horarios = Array.from({ length: (22 - 8) * 2 + 1 }, (_, i) => {
    const horas = Math.floor(8 + i / 2);
    const minutos = i % 2 === 0 ? '00' : '30';
    return `${horas}:${minutos}`;
  });

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-6">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 principal">
          Nueva Comisión
        </h2>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-signature text-blue-600 mr-2"></i>
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="Programación 1"
            required
          />
        </div>
        <div>
          <label htmlFor="day" className="block mb-2 text-sm font-semibold text-gray-700 principal">
            <i className="fa-solid fa-calendar-days text-blue-600 mr-2"></i>
            Día de Dictado
          </label>
          <select
            name="day"
            value={formData.day || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
            required
          >
            <option value="">Seleccionar día</option>
            {dias.map((dia, idx) => (
              <option key={idx} value={dia.value}>
                {dia.value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 principal">
            <i className="fa-solid fa-clock text-blue-600 mr-2"></i>
            Horario
          </label>
          <div className="flex items-center gap-3">
            <select
              name="start"
              value={formData.hour.start || ''}
              onChange={handleChange}
              className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              required
            >
              <option value="">Inicio</option>
              {horarios.map((horario, index) => (
                <option key={index} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
            <span className="font-bold text-xl text-gray-400">→</span>
            <select
              name="end"
              value={formData.hour.end || ''}
              onChange={handleChange}
              className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              required
            >
              <option value="">Fin</option>
              {horarios.map((horario, index) => (
                <option key={index} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="profesorId"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-chalkboard-user text-blue-600 mr-2"></i>
            Profesor
          </label>
          <select
            name="profesorId"
            id="profesorId"
            value={formData.profesorId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
            required
          >
            <option value="">Seleccionar profesor</option>
            {Array.isArray(profes) &&
              profes.map((profe) => (
                <option key={profe.id} value={profe.id}>
                  {`${profe.name} ${profe.apellido}`}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 principal">
            <i className="fa-solid fa-book text-blue-600 mr-2"></i>
            Curso
          </label>
          <div className="relative curso-dropdown">
            <input
              type="text"
              value={searchCurso}
              onChange={(e) => {
                setSearchCurso(e.target.value);
                const filtered = cursos.filter((curso) =>
                  curso.name.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFilteredCursos(filtered);
                setShowCursos(true);
              }}
              onFocus={() => setShowCursos(true)}
              placeholder="Buscar curso..."
              className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
              required
            />
            {showCursos && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {filteredCursos.map((curso) => (
                  <div
                    key={curso.id}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, cursoId: curso.id }));
                      setSearchCurso(curso.name);
                      setShowCursos(false);
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                  >
                    <div className="font-semibold text-gray-900">{curso.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {curso.area} • {curso.duration}h • ${curso.price}
                    </div>
                  </div>
                ))}
                {filteredCursos.length === 0 && (
                  <div className="p-4 text-gray-500 text-center text-sm">
                    No se encontraron cursos
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={pause}
          className="w-full mt-2 px-6 py-3 text-white font-semibold btnAz rounded shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
        >
          {pause ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Creando...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
              <span>Crear Comisión</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateComision;
