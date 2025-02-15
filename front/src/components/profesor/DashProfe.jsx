import React from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const DashProfe = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();

  const isSubRoute = location.pathname.includes("crear") || location.pathname.includes("info");

  const click = (e) => {
    navigate(`/adm/${id}/profesores/info`, {
      state: { id: e.target.value },
    });
  };
  const clickDelete = (e) => {
    //aqui ira el fetch para eliminar el profesor
    console.log(e.target.value);
    Swal.fire({
        title: "Profesor Eliminado",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
  }
  const tableItems = [
    {
      name: "Liam James",
      email: "liamjames@example.com",
      position: "Software engineer",
      salary: "$100K",
    },
    {
      name: "Olivia Emma",
      email: "oliviaemma@example.com",
      position: "Product designer",
      salary: "$90K",
    },
    {
      name: "William Benjamin",
      email: "william.benjamin@example.com",
      position: "Front-end developer",
      salary: "$80K",
    },
    {
      name: "Henry Theodore",
      email: "henrytheodore@example.com",
      position: "Laravel engineer",
      salary: "$120K",
    },
    {
      name: "Amelia Elijah",
      email: "amelia.elijah@example.com",
      position: "Open source manager",
      salary: "$75K",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
          <div className="items-start justify-between md:flex">
            <div className="max-w-lg">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">Equipo de Profesores</h3>
              <p className="text-gray-600 mt-2">En esta tabla estaran todos los profesores de esta sucursal</p>
            </div>
            <div className="mt-3 md:mt-0">
              <button
                onClick={() => navigate(`/adm/${id}/profesores/crear`)}
                className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
              >
                Nuevo Profesor
              </button>
            </div>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Nombre</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Número de telefono</th>
                  <th className="py-3 px-6">Curso</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {tableItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.salary}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button value={idx} onClick={clickDelete} className=" px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default DashProfe;
