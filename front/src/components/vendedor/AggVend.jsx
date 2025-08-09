import { useEffect, useState } from 'react';
import logo from '../../assets/simplificado_a_color.png';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getSucursalId, postVend } from '../queris/queris';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const AggVend = () => {
  const { id } = useParams();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tel: '',
    sucursal: '',
    isAdmin: false,
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
    const updatedFormData = {
      ...formData,
      sucursal: [id],
    };

    await postVend(updatedFormData).then((data) => {
      try {
        console.log(data);
        Swal.fire({
          title: 'Vendedor Registrado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    getSucursalId(id).then((data) => {
      setFormData((prev) => ({
        ...prev,
        sucursal: data.name,
      }));
    });
  }, []);

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
          <label htmlFor="email" className="block mb-2 text-sm  principal">
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
          <label htmlFor="email" className="block mb-2 text-sm  principal text-[#111827]">
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
          <label htmlFor="email" className="block mb-2 text-sm  principal text-[#111827]">
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
          <label htmlFor="email" className="block mb-2 text-sm  principal text-[#111827]">
            Sucursal
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="sucursal"
              id="sucursal"
              disabled
              value={formData.sucursal}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-6 relative ">
          <label htmlFor="password" className="block mb-2 text-sm  text-[#111827] principal">
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
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 "
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
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
        >
          Registrar Vendedor
        </button>
      </form>
    </div>
  );
};

export default AggVend;
