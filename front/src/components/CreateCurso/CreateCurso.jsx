import { useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import { useNavigate } from 'react-router-dom';
import { postCurso } from '../../services/Cursos.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const CreateCurso = () => {
  const areas = ['Digital', 'Idiomas', 'Salud', 'Administrativa', 'Belleza', 'Técnica'];
  const tipos = ['Presencial', 'Distancia'];

  const navigate = useNavigate();
  const [pause, setPause] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    area: '',
    tipo: '',
    price: '',
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
      await postCurso(formData);
      clientSuccessHandler(SUCCESS_MESSAGES.CURSO_CREADO);
      navigate('/admin/cursos');
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CREAR_CURSO
      );
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-6">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 principal">
          Nuevo Curso
        </h2>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-book text-blue-600 mr-2"></i>
            Nombre del Curso
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="Ej: Programación Web"
            required
          />
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-calendar text-blue-600 mr-2"></i>
            Duración (Meses)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="Ej: 6"
            min="1"
            required
          />
        </div>

        <div>
          <label
            htmlFor="area"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-layer-group text-blue-600 mr-2"></i>
            Área
          </label>
          <select
            name="area"
            id="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
            required
          >
            <option value="">Seleccionar área</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="tipo"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-graduation-cap text-blue-600 mr-2"></i>
            Tipo de Curso
          </label>
          <select
            name="tipo"
            id="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
            required
          >
            <option value="">Seleccionar tipo</option>
            {tipos.map((tipo, idx) => (
              <option key={idx} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-dollar-sign text-blue-600 mr-2"></i>
            Precio
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="Ej: 15000"
            min="0"
            step="0.01"
            required
          />
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
              <span>Crear Curso</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCurso;
