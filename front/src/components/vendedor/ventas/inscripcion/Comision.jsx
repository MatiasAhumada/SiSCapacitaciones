import React, { useEffect, useState } from "react";
import { getComisiones, getComisionId } from "../../../queris/queris";
import Swal from "sweetalert2";

const Comision = ({ nextStep, prevStep, formData, setFormData }) => {
  const [comisiones, setComisiones] = useState([]);
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    getComisiones().then((data) => {
      setComisiones(data);
    });
  }, []);

  const handleSelectChange = (e) => {
    const comisionId = e.target.value;
    if (comisionId) {
      getComisionId(comisionId).then((data) => {
        setComisionSeleccionada(data);
      });
    } else {
      setComisionSeleccionada(null);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    setPause(true);
    Swal.fire({
      icon: "success",
      title: "Comisión Seleccionada",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setPause(false);
      setFormData({ ...formData, comisionId: e.target.value });
      nextStep();
    });
  };
  return (
    <div className="p-4 border rounded-lg shadow-md text-center w-96 mx-auto">
      <h2 className="text-lg font-bold">Seleccionar Comisión</h2>
      <p>Elige una comisión para ver sus detalles.</p>

      <select onChange={handleSelectChange} className="mt-4 p-2 border rounded w-full">
        <option value="">Selecciona una comisión</option>
        {comisiones.map((comision) => (
          <option key={comision.id} value={comision.id}>
            {comision.name}
          </option>
        ))}
      </select>

      {comisionSeleccionada && (
        <div className="mt-4 p-4 border rounded bg-gray-100 text-left">
          <p>
            <strong>Nombre:</strong> {comisionSeleccionada.name}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {comisionSeleccionada.fecInit}
          </p>
          <p>
            <strong>Sucursal:</strong> {comisionSeleccionada.sucursal.name}
          </p>
          <p>
            <strong>Curso:</strong> {comisionSeleccionada.curso.name}
          </p>
          <p>
            <strong>Profesor:</strong> {comisionSeleccionada.profesor.name}
          </p>
          <p>
            <strong>Alumnos Inscritos:</strong>
          </p>
          <ul className="list-disc ml-4">
            {comisionSeleccionada.alumnos.length > 0 ? (
              comisionSeleccionada.alumnos.map((alumno) => <li key={alumno.id}>{alumno.name}</li>)
            ) : (
              <li>No hay alumnos inscritos</li>
            )}
          </ul>
          <div className="flex justify-end mt-4">
            <button onClick={handleClick} value={comisionSeleccionada.id} className="px-4 py-2 btnAz rounded">
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
      )}
    </div>
  );
};

export default Comision;
