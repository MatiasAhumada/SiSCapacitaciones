import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const InfoVendedor = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  const tableItems = [
    {
      name: "Liam James",
      email: "liamjames@example.com",
      position: "Software engineer",
      salary: "$100K",
      curse: "2",
    },
    {
      name: "Olivia Emma",
      email: "oliviaemma@example.com",
      position: "Product designer",
      salary: "$90K",
      curse: "2",
    },
    {
      name: "William Benjamin",
      email: "william.benjamin@example.com",
      position: "Front-end developer",
      salary: "$80K",
      curse: "2",
    },
    {
      name: "Henry Theodore",
      email: "henrytheodore@example.com",
      position: "Laravel engineer",
      salary: "$120K",
      curse: "2",
    },
    {
      name: "Amelia Elijah",
      email: "amelia.elijah@example.com",
      position: "Open source manager",
      salary: "$75K",
      curse: "2",
    },
  ];

  const handClick = () => {
    Swal.fire({
      title: "Eliminado!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    }); 
  };
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-xl font-bold sm:text-2xl principal">Vendedor</h3>
          <p className="text-gray-600 mt-2">{"datos desde el back"}</p>
        </div>
        <div className="mt-3 md:mt-0">
          <button onClick={handClick} className="inline-block px-4 py-2 text-white bg-red-600 hover:bg-red-700 principal rounded md:text-sm">
            Eliminar
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
            {tableItems.map((item, idx) => (
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
