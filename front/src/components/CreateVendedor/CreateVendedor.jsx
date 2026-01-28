import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { postVend } from '../../services/Vendedores.service';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import logo from '../../assets/simplificado_a_color.png';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const CreateVendedor = () => {
  const { sucursales } = useApp();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tel: '',
    sucursal: [],
    isAdmin: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sucursal') {
      setFormData({
        ...formData,
        [name]: [value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedFormData = {
        ...formData,
        sucursal: formData.sucursal,
      };

      await postVend(updatedFormData);
      clientSuccessHandler(SUCCESS_MESSAGES.VENDEDOR_CREADO);
      navigate('/admin/vendedores');
    } catch (error) {
      clientErrorHandler(
        error.response?.data?.message || error.message || ERROR_MESSAGES.ERROR_CREAR_VENDEDOR
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-6">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 principal">
          Nuevo Vendedor
        </h2>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-user text-blue-600 mr-2"></i>
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="Nombre del vendedor"
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-envelope text-blue-600 mr-2"></i>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="javier@gmail.com"
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor="tel" className="block mb-2 text-sm font-semibold text-gray-700 principal">
            <i className="fa-solid fa-phone text-blue-600 mr-2"></i>
            Teléfono
          </label>
          <input
            type="tel"
            name="tel"
            id="tel"
            value={formData.tel}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
            placeholder="3813528650"
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label
            htmlFor="sucursal"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-building text-blue-600 mr-2"></i>
            Sucursal
          </label>
          <select
            name="sucursal"
            id="sucursal"
            value={formData.sucursal[0] || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
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
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-gray-700 principal"
          >
            <i className="fa-solid fa-lock text-blue-600 mr-2"></i>
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              className="w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 hover:shadow-md"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPwd((s) => !s)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              tabIndex={0}
            >
              {showPwd ? (
                <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-6 py-3 text-white font-semibold btnAz rounded shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
        >
          {loading ? (
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
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform duration-300"></i>
              <span>Registrar Vendedor</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateVendedor;
