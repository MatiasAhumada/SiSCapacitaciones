import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteComision, deleteCurso, getComisionBySucursal, getCursos, getSucursalId } from "../../queris/queris";

const DashComisiones = () => {
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const navigate = useNavigate();

  const { id } = useParams();

  const location = useLocation();

  const isSubRoute = location.pathname.includes("crear");

  const clickDelete = async (e) => {
    e.preventDefault();
    const comisionId = e.target.value;

    setPause((prev) => ({ ...prev, [comisionId]: true }));

    await deleteComision(e.target.value).then(() => {
      try {
        Swal.fire({
          title: "Comision Eliminada",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause((prev) => {
            const newPause = { ...prev };
            delete newPause[comisionId];
            return newPause;
          });

          setTableItems((prev) => prev.filter((item) => item.id !== comisionId));
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    const sucursal = async () => {
      await getComisionBySucursal(id).then((data) => {
        setTableItems(data);
        console.log(data);
      });
    };
    sucursal();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
          <div className="items-start justify-between md:flex">
            <div className="max-w-lg">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">Listado de Cursos</h3>
              <p className="text-gray-600 mt-2">En esta tabla estaran todos cursos para todas las sucursales</p>
            </div>
            <div className="mt-3 md:mt-0">
              <button onClick={() => navigate(`/adm/${id}/cursos/crear`)} className="inline-block px-4 py-2 text-white principal btnAz md:text-sm">
                Nueva Comision
              </button>
            </div>
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Nombre</th>
                  <th className="py-3 px-6">Dia</th>
                  <th className="py-3 px-6">Hora</th>
                  <th className="py-3 px-6">Curso</th>
                  <th className="py-3 px-6">Profesor</th>
                  <th className="py-3 px-6">Alumnos</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {tableItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          item.day === "Lunes"
                            ? "bg-blue-200 text-blue-800"
                            : item.day === "Martes"
                            ? "bg-yellow-200 text-yellow-800"
                            : item.day === "Miercoles"
                            ? "bg-red-200 text-red-800"
                            : item.day === "Jueves"
                            ? "bg-pink-200 text-pink-800"
                            : item.day === "Viernes"
                            ? "bg-purple-200 text-purple-800"
                            : item.day === "Sabado"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {item.day}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.hour}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={"px-3 py-1 text-sm font-semibold rounded-full "}>{item.curso?.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.profesor.name + " " + item.profesor.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.alumnos?.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        value={item.id}
                        onClick={clickDelete}
                        className=" px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                      >
                        {pause[item.id] ? (
                          <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                          "Eliminar"
                        )}
                      </button>
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

export default DashComisiones;
