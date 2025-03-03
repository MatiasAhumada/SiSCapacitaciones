import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteVend, getVendID } from "../queris/queris";
const InfoVendedor = () => {
  const location = useLocation();

  const { id } = location.state || {};

  const [pause, setPause] = useState(false);

  const [tableItems, setTableItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const peticion = async () => {
      await getVendID(id).then((data) => {
        setTableItems(data);
      });
    };
    peticion();
  }, []);

  // console.log(tableItems);

  const handClick = async (e) => {
    e.preventDefault();
    setPause(true);
    await deleteVend(e.target.value).then((data) => {
      try {
        Swal.fire({
          title: "Eliminado!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          //navigate(`/adm/${id}`);
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
        });
      }
    });
  };
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex mb-5">
        <div className="max-w-lg">
          <h3 className="text-xl font-bold sm:text-2xl principal mt-4">{tableItems.name}</h3>
        </div>
        <div className="mt-3 md:mt-0">
          <button
            onClick={handClick}
            value={tableItems.id}
            className="inline-block px-4 py-2 text-white bg-red-600 hover:bg-red-700 principal rounded md:text-sm"
          >
            {pause ? (
              <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
      <h3 className="font-bold sm:text-2xl principal mt-4">Alumnos Vendidos</h3>
      <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b principal text-center">
            <tr>
              <th className="py-3 px-6">Nombre y Apellido</th>
              <th className="py-3 px-6">Telefono</th>
              <th className="py-3 px-6">DNI</th>
              <th className="py-3 px-6">Curso</th>
              <th className="py-3 px-6">Comision</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {tableItems.inscripciones?.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.salary}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.curse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoVendedor;
