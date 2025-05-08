import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSucursales, postAlu } from "../../queris/queris";
import { useNavigate, useParams } from "react-router-dom";

const CreateAlumno = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [pause, setPause] = useState(false);

  const [formAlu, setFormAlu] = useState({
    dni: "",
    name: "",
    fNac: "",
    tel: "",
    ocupation: "",
    nationality: "",
    address: "",
    province: "",
    locality: "",
    email: "",
    age: "",
    gender: "",
    sucursalId: "",
  });

  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    getSucursales().then((data) => {
      setSucursales(data);
    });
  }, [id]);
  const handleChange = (e) => {
    setFormAlu({ ...formAlu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setPause(true);
    try {
      await postAlu(formAlu).then((data) => {
        if (data) {
          Swal.fire({
            icon: "success",
            title: "Alumno Cargado",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setPause(false);
            navigate(`/adm/${id}/alumnos`);
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar alumno",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const fieldLabels = {
    dni: "DNI",
    name: "Nombre",
    fNac: "Fecha de Nacimiento",
    tel: "Teléfono",
    ocupation: "Ocupación",
    nationality: "Nacionalidad",
    address: "Dirección",
    province: "Provincia",
    locality: "Localidad",
    email: "Correo Electrónico",
    age: "Edad",
    gender: "Género",
  };
  return (
    <div className="p-4 border rounded-lg shadow-md text-center">
      <h2 className="text-lg principal">Cargar Alumno</h2>
      <p>Ingrese Informacion del alumno.</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.keys(formAlu).map(
          (key) =>
            key !== "sucursalId" && (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="mb-1 text-sm">
                  {fieldLabels[key]}
                </label>
                <input
                  type={key === "fNac" ? "date" : "text"}
                  name={key}
                  value={formAlu[key]}
                  onChange={handleChange}
                  placeholder={fieldLabels[key]}
                  className="p-2 border rounded"
                />
              </div>
            )
        )}
        <select name="sucursalId" value={formAlu.sucursalId} onChange={handleChange} className="p-2 border rounded">
          <option value="">Selecciona una sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleSubmit} className="px-4 py-2 btnAz rounded">
          {pause ? (
            <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            "Cargar Alumno"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateAlumno;
