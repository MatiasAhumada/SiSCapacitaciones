import React, { useEffect, useState } from "react";
import { getCursos } from "../../../queris/queris";
import Swal from "sweetalert2";

const Pago = ({ nextStep, prevStep, formData, setFormData }) => {
  const [pago, setPago] = useState({
    formaPago: formData.formaPago || "",
    cuotaIngreso: formData.cuotaIngreso || 0,
  });
  const [pause, setPause] = useState(false);
  const handleChange = (e) => {
    setPago({ ...pago, [e.target.name]: e.target.value });
  };
  console.log(formData);
  const handleNext = () => {
    setPause(true);
    Swal.fire({
      icon: "success",
      title: "Pago Confirmado",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setPause(false);
      setFormData((prev) => ({
        ...prev,
        formaPago: pago.formaPago,
        cuotaIngreso: Number(pago.cuotaIngreso),
      }));
      nextStep();
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md text-center w-96 mx-auto">
      <h2 className="text-lg font-bold">Información de Pago</h2>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Forma de Pago</label>
        <select
          name="formaPago"
          value={pago.formaPago}
          onChange={handleChange}
          className="mt-2 p-2 border rounded w-full"
        >
          <option value="">Seleccione una opción</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Cuota de Ingreso</label>
        <input
          type="number"
          name="cuotaIngreso"
          value={pago.cuotaIngreso}
          onChange={handleChange}
          className="mt-2 p-2 border rounded w-full"
          min="0"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
          Anterior
        </button>
        <button onClick={handleNext} className="px-4 py-2 btnAz rounded">
          {pause ? (
            <svg
              fill="white"
              className="w-6 h-6 mx-auto"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="0.75s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
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

export default Pago;
