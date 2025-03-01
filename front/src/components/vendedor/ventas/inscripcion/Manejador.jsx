import React, { useState } from "react";
import Alumno from "./Alumno";
import Curso from "./Curso";
import Comision from "./Comision";
import Confirmacion from "./Confirmacion";

const stepsItems = ["Alumno", "Curso", "Comision", "Confirmacion"];
const Manejador = () => {
  
  const [formData, setFormData] = useState({
    fechaRegistro: "",
    formaPago: "",
    cuotaIngreso: 0,
    vendedorId: "",
    alumnoId: "",
    comisionId: "",
    sucursalId: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, stepsItems.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0">
      {/* 🔵 BANNER DE PASOS */}
      <ul aria-label="Steps" className="flex items-center  font-medium">
        {stepsItems.map((item, idx) => (
          <li key={idx} aria-current={currentStep === idx + 1 ? "step" : false} className="flex-1 flex gap-x-2 items-center">
            <div className="flex items-center flex-col gap-x-2">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep > idx + 1 ? "bgColor borderColor" : currentStep === idx + 1 ? "borderColor" : ""
                }`}
              >
                {currentStep > idx + 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span className={currentStep === idx + 1 ? "textColor" : ""}>{idx + 1}</span>
                )}
              </div>
            </div>
            <div className="h-8 flex items-center">
              <h3 className={`text-sm ${currentStep === idx + 1 ? "font-bold" : "font-light"}`}>{item}</h3>
            </div>
            {idx + 1 < stepsItems.length && <hr className="w-full border md:block" />}
          </li>
        ))}
      </ul>

      {/* 🔄 RENDERIZAR EL PASO ACTUAL */}
      <div className="mt-6  flex justify-center w-100">
        {currentStep === 1 && <Alumno nextStep={nextStep}  formData={formData} setFormData={setFormData}/>}
        {currentStep === 2 && <Curso nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />}
        {currentStep === 3 && <Comision nextStep={nextStep} prevStep={prevStep}  formData={formData} setFormData={setFormData}/>}
        {currentStep === 4 && <Confirmacion prevStep={prevStep} />}
      </div>
    </div>
  );
};

export default Manejador;
