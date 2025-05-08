import { useEffect, useState } from "react";
import logo from "../assets/simplificado_a_color.png";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getCursos, getSucursalId, postProfes } from "../queris/queris";
const CrearProfes = () => {
  const { id } = useParams();
  const [pause, setPause] = useState(false);
  const [suc, setSuc] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    dni: "",
    sucursalId: id,
   
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
      sucursalId: id,
    };

     setPause(true);
     await postProfes(updatedFormData).then(() => {
       try {
         Swal.fire({
           title: "Profesor Registrado",
           icon: "success",
           showConfirmButton: false,
           timer: 1500,
         }).then(() => {
           setPause(false);
         });
       } catch (error) {
         console.log(error);
       }
     });
  };
  useEffect(() => {
    getSucursalId(id).then((data) => {
      setSuc(data.name);
    });
  }, [id]);

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
              placeholder="Nombre del profesor"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="apellido" className="block mb-2 text-sm  principal text-[#111827]">
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
          <label htmlFor="dni" className="block mb-2 text-sm  principal text-[#111827]">
            DNI
          </label>
          <div className="relative text-gray-400">
            <input
              type="number"
              name="dni"
              id="dni"
              value={formData.dni}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="3813528650"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="Sucursal" className="block mb-2 text-sm  principal text-[#111827]">
            Sucursal
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="sucursal"
              id="sucursal"
              disabled
              value={suc}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              autoComplete="off"
            />
          </div>
        </div>
       
        {/* <div className="pb-6">
          <label htmlFor="curso" className="block mb-2 text-sm text-[#111827] principal">
            Curso
          </label>
          <div className="relative text-gray-400">
            <select
              name="curso"
              id="curso"
              value={formData.curso || ""}
              onChange={handleChange}
              className="pl-4 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 py-3 px-4"
            >
              <option value="">Selecciona un curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.name}
                </option>
              ))}
            </select>
          </div>
        </div> */}
        <button
          type="submit"
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
        >
          {pause ? (
            <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            "Registrar Profesor"
          )}
        </button>
      </form>
    </div>
  );
};

export default CrearProfes;
