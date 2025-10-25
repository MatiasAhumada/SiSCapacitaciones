import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { postVend } from '../../services/Vendedores.service';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import logo from '../../assets/simplificado_a_color.png';

const CreateVendedor = () => {
  const { user } = useAuth();
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
      Swal.fire({
        title: 'Vendedor Registrado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate('/admin/vendedores');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar vendedor',
        text: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>
        <h2 className="my-auto principal">Registro de Vendedores</h2>
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
              placeholder="Nombre del vendedor"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="email" className="block mb-2 text-sm principal text-[#111827]">
            Email
          </label>
          <div className="relative text-gray-400">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="javier@gmail.com"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="tel" className="block mb-2 text-sm principal text-[#111827]">
            Telefono de contacto
          </label>
          <div className="relative text-gray-400">
            <input
              type="number"
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
              name="sucursal"
              id="sucursal"
              value={formData.sucursal[0] || ''}
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
        <div className="pb-6 relative">
          <label htmlFor="password" className="block mb-2 text-sm text-[#111827] principal">
            Contraseña
          </label>
          <div className="relative text-gray-400">
            <input
              type={showPwd ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              autoComplete="new-password"
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
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando...
            </div>
          ) : (
            'Registrar Vendedor'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateVendedor;