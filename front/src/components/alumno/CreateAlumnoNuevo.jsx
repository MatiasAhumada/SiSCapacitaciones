import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSucursales, postAlu } from "../queris/queris";

const CreateAlumnoNuevo = () => {
  const [pause, setPause] = useState(false);
  const [formAlu, setFormAlu] = useState({
    dni: "",
    name: "",
    fNac: "",
    tel: "",
    telex: "",
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
    setPause(true);    
     try {
       postAlu(formAlu).then((data) => {
         if (data) {
           console.log(data);
           setFormAlu((prev) => ({ ...prev, alumnoId: data.id, sucursalId: formAlu.sucursalId }));
           Swal.fire({
             icon: "success",
             title: "Alumno Cargado",
             showConfirmButton: false,
             timer: 1500,
           }).then(() => {
             setPause(false);
             setFormAlu({
               dni: "",
               name: "",
               fNac: "",
               tel: "",
               telex: "",
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
             });
         }
       });
     } catch (error) {
       Swal.fire({
         icon: "error",
         title: "Error al cargar alumno",
         showConfirmButton: false,
         timer: 1500,
       }).then(()=>{
         setPause(false);
       });
     }
  };

  const fieldLabels = {
    name: "Nombre Completo",
    fNac: "Fecha de Nacimiento",
    nationality: "Nacionalidad",
    address: "Dirección",
    province: "Provincia",
    locality: "Localidad",
    email: "Correo Electrónico",
  };
  const genero = [{ value: "Masculino" }, { value: "Femenino" }, { value: "Otros" }];
  const ocupacion = [{ value: "Estudiante" }, { value: "Trabajador" }, { value: "Retirado" }];

  return (
    <div className="p-4 border rounded-lg shadow-md text-center">
      <h2 className="text-lg principal">Cargar Alumno</h2>
      <p>Ingrese Informacion del alumno.</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col">
          <label htmlFor="dni" className="mb-1 text-sm">
            DNI
          </label>
          <input type="number" name="dni" value={formAlu.dni} placeholder="42499732" onChange={handleChange} className="p-2 border rounded" />
        </div>
        {Object.keys(formAlu).map(
          (key) =>
            key !== "sucursalId" &&
            key !== "dni" &&
            key !== "gender" &&
            key !== "tel" &&
            key !== "telex" &&
            key !== "age" &&
            key !== "ocupation" && (
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
        <div className="flex flex-col">
          <label htmlFor="tel" className="mb-1 text-sm">
            Telefono
          </label>
          <input type="number" name="tel" value={formAlu.tel} placeholder="3813528657" onChange={handleChange} className="p-2 border rounded" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="telex" className="mb-1 text-sm">
            Telefono Alternativo
          </label>
          <input type="number" name="telex" value={formAlu.telex} placeholder="3813528655" onChange={handleChange} className="p-2 border rounded" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="age" className="mb-1 text-sm">
            Edad
          </label>
          <input type="number" name="age" value={formAlu.age} placeholder="22" onChange={handleChange} className="p-2 border rounded" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-1 text-sm">
            Genero
          </label>
          <select name="gender" value={formAlu.gender} onChange={handleChange} className="p-2 border rounded">
            <option value="">Selecciona un genero</option>
            {genero.map((gen, idx) => (
              <option key={idx} value={gen.value}>
                {gen.value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="ocupation" className="mb-1 text-sm">
            Ocupacion
          </label>
          <select name="ocupation" value={formAlu.ocupation} onChange={handleChange} className="p-2 border rounded">
            <option value="">Selecciona una ocupación</option>
            {ocupacion.map((ocp, idx) => (
              <option key={idx} value={ocp.value}>
                {ocp.value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="sucursalId" className="mb-1 text-sm">
            Sucursal
          </label>

          <select name="sucursalId" value={formAlu.sucursalId} onChange={handleChange} className="p-2 border rounded">
            <option value="">Selecciona una sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.name}
              </option>
            ))}
          </select>
        </div>
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
            "Siguiente"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateAlumnoNuevo;
