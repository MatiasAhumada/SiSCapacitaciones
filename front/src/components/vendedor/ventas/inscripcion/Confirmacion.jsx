import React, { useEffect, useState } from "react";
import { getAluID, getComisionId, getSucursalId, getVendID, postInscripcion } from "../../../queris/queris";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Confirmacion = ({ formData, prevStep }) => {
  const [datos, setDatos] = useState({
    vendedor: "",
    alumno: "",
    comision: "",
    sucursal: "",
    curso: "",
  });
  const [pause, setPause] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendedor = await getVendID(formData.vendedorId);
        const alumno = await getAluID(formData.alumnoId);
        const comision = await getComisionId(formData.comisionId);
        const sucursal = await getSucursalId(formData.sucursalId);

        setDatos({
          vendedor: vendedor.name,
          alumno: alumno.name,
          comision: comision.name,
          sucursal: sucursal.name,
          curso: comision.curso.name,
        });
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    fetchData();
  }, [formData]);
  const navigate = useNavigate();
  const handleClick = async () => {
    setPause(true);
    Swal.fire({
        icon: "success",
        title: "Inscripción Cargada",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setPause(false);
        navigate("/inicioVendedor");
      });
    // await postInscripcion(formData).then((data) => {
    //   try {
    //     Swal.fire({
    //       icon: "success",
    //       title: "Inscripción Cargada",
    //       showConfirmButton: false,
    //       timer: 1500,
    //     }).then(() => {
    //       setPause(false);
    //       navigate("/inicioVendedor");
    //     });
    //   } catch (error) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Error al cargar inscripción",
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //   }
    // });
  };
  return (
    <div className="p-4 border rounded-lg shadow-md text-center w-96 mx-auto">
      <h2 className="text-lg font-bold">Resumen de la Inscripción</h2>
      <p>
        <strong>Fecha de Registro:</strong> {formData.fechaRegistro}
      </p>
      <p>
        <strong>Forma de Pago:</strong> {formData.formaPago}
      </p>
      <p>
        <strong>Cuota de Ingreso:</strong> ${formData.cuotaIngreso}
      </p>
      <p>
        <strong>Vendedor:</strong> {datos.vendedor}
      </p>
      <p>
        <strong>Alumno:</strong> {datos.alumno}
      </p>
      <p>
        <strong>Comisión:</strong> {datos.comision}
      </p>
      <p>
        <strong>Sucursal:</strong> {datos.sucursal}
      </p>
      <p>
        <strong>Curso:</strong> {datos.curso}
      </p>
      <div className="flex justify-end mt-4">
        <button className="px-4 py-2 btnAz rounded" onClick={handleClick}>
          {pause ? (
            <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            "Confirmar Inscripción"
          )}
        </button>
      </div>
    </div>
  );
};

export default Confirmacion;
