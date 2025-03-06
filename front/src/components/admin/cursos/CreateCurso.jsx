import { useEffect, useState } from "react";
import logo from "../../assets/simplificado_a_color.png";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getCursos, getSucursalId, postCurso, postProfes } from "../../queris/queris";

const CreateCurso = () => {
  const areas = ["Digital", "Idiomas", "Salud", "Administrativa", "Belleza", "Técnica"];
  const tipos = ["Presencial", "Distancia"];

  const navigate = useNavigate();
  const { id } = useParams();
  const [pause, setPause] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    area: "",
    tipo: "",
    price: "",
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
    await postCurso(formData).then(() => {
      try {
        Swal.fire({
          title: "Curso Creado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          navigate(`/adm/${id}`);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>

        <h2 className="my-auto principal">Creacion de curso</h2>
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
              placeholder="Nombre del curso"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="apellido" className="block mb-2 text-sm  principal text-[#111827]">
            Duracion en Meses
          </label>
          <div className="relative text-gray-400">
            <input
              type="number"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="10"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="pb-2">
          <label className="block mb-2 text-sm principal">Área</label>
          <select
            type="text"
            name="area"
            id="area"
            value={formData.area}
            onChange={handleChange}
            className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 rounded-lg p-2.5 w-full"
          >
            <option value="">Seleccionar área</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="pb-2">
          <label className="block mb-2 text-sm principal">Tipo</label>
          <select
            type="text"
            name="tipo"
            id="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 rounded-lg p-2.5 w-full"
          >
            <option value="">Seleccionar tipo</option>
            {tipos.map((tipo, idx) => (
              <option key={idx} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="pb-6">
          <label htmlFor="curso" className="block mb-2 text-sm text-[#111827] principal">
            Precio
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              autoComplete="off"
            />
          </div>
        </div>
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
            "Crear Curso"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCurso;
