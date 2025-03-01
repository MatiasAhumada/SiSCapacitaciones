import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSucursales, postAlu } from "../../../queris/queris";

const Alumno = ({ nextStep, formData , setFormData}) => {
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
  }, []);
  const handleChange = (e) => {
    setFormAlu({ ...formAlu, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = () => {
    try {
      console.log(formData);
       postAlu(formAlu).then((data) => {
        
        if (data) {
          setFormData({ ...formData, alumnoId: data.id });
          Swal.fire({
            icon: "success",
            title: "Alumno Cargado",
            showConfirmButton: false,
            timer: 1500,
          })
           .then(() => nextStep());
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
       <select
          name="sucursalId"
          value={formAlu.sucursalId}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Selecciona una sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.name}
            </option>
          ))}
        </select>
    </div>
    <div className="flex justify-end mt-4">
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
        Siguiente
      </button>
    </div>
  </div>

  );
};

export default Alumno;
