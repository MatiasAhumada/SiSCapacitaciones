import React from "react";
import Swal from "sweetalert2";

const Alumno = ({ nextStep }) => {
  const clickHandler = () => {
    Swal.fire({
      icon: "success",
      title: "Alumno Cargado",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => nextStep());
  };
  return (
    <div className="p-4 border rounded-lg shadow-md ">
      <h2 className="text-lg principal">Cargar Alumno</h2>
      <p>Introduce tu información de perfil.</p>
      <div className="flex justify-end mt-4">
        <button onClick={clickHandler} className="px-4 py-2 bg-blue-500 text-white rounded">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Alumno;
