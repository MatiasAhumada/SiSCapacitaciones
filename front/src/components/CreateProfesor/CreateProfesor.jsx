import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { postProfes } from '../../services/Profesores.service';
import logo from '../../assets/simplificado_a_color.png';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const CreateProfesor = () => {
  const { sucursales } = useApp();
  const navigate = useNavigate();
  const [pause, setPause] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    tel: '',
    sucursalId: '',
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
      const updatedFormData = {
        ...formData,
        sucursalId: formData.sucursalId,
      };

      await postProfes(updatedFormData);
      clientSuccessHandler(SUCCESS_MESSAGES.PROFESOR_CREADO);
      navigate('/admin/profesores');
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CREAR_PROFESOR
      );
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>
        <h2 className="my-auto principal">Registro de Profesores</h2>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
          <label htmlFor="name" className="block mb-2 text-sm principal">
            Nombre
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="Nombre del profesor"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="apellido" className="block mb-2 text-sm principal text-[#111827]">
            Apellido
          </label>
          <div className="relative text-gray-400">
            <input
              type="string"
              name="apellido"
              id="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="Apellido del profesor"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="tel" className="block mb-2 text-sm principal text-[#111827]">
            Teléfono
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="tel"
              id="tel"
              value={formData.tel}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="3813528650"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="sucursal" className="block mb-2 text-sm principal text-[#111827]">
            Sucursal
          </label>
          <div className="relative text-gray-400">
            <select
              name="sucursalId"
              id="sucursalId"
              value={formData.sucursalId}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              required
            >
              <option value="">Seleccionar sucursal</option>
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>
                  {suc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={pause}
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 disabled:opacity-50"
        >
          {pause ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
              Registrando...
            </div>
          ) : (
            'Registrar Profesor'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProfesor;
