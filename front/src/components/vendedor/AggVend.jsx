import React, { useEffect, useState } from "react";
import logo from "../assets/simplificado_a_color.png";
import { fetchSucursal } from "../queris/queris";
import { useParams } from "react-router-dom";
const AggVend = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    telefono: "",
    sucursal: "",
  });
  const { id } = useParams();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    //aqui ira la peticion al back asi crea un nuevo empleado
    console.log(formData);
  };
  useEffect(() => {
    //aqui se hara la peticion al back para traer las sucursales

    // fetchSucursal(id).then((data) => {
    //   setFormData((prev) => ({
    //     ...prev,
    //     sucursal: data.sucursal, // Asumiendo que la respuesta tenga una propiedad "sucursal"
    //   }));
    // });
    setFormData((prev) => ({
      ...prev,
      sucursal: "sucursal del back", // Asumiendo que la respuesta tenga una propiedad "sucursal"
    }));
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
              name="telefono"
              id="telefono"
              value={formData.telefono}
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
        <div className="pb-6">
          <label htmlFor="password" className="block mb-2 text-sm  text-[#111827] principal">
            Contraseña
          </label>
          <div className="relative text-gray-400">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••"
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              autoComplete="new-password"
            />
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
