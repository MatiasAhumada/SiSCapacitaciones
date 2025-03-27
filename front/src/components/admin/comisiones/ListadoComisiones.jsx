import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComisionId } from "../../queris/queris";

const ListadoComisiones = () => {
  const [comision, setComision] = useState([]);
  const { comId } = useParams();

  useEffect(() => {
    const alumnosCom = async () => {
      await getComisionId(comId).then((data) => {
        setComision(data.alumnoComisiones);
      });
    };
    alumnosCom();
  }, []);
  console.log(comision);
  const allDates = Array.from(new Set(comision.flatMap((item) => item.asistencias.map((asistencia) => asistencia.fecha.split("T")[0])))).sort();
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <>
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">Listado de Alumnos de la Comision</h3>
          </div>
        </div>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm  text-center">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
              <tr>
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-6">DNI</th>
                <th className="py-3 px-6">Telefono</th>
                <th className="py-3 px-6">Estado</th>
                {allDates.map((date) => (
                  <th key={date} className="py-3 px-6">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {comision?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{item.alumno.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.tel}</td>
                  <td className="px-6 py-4">{!item.alumno.state ? "Activo" : "Inactivo"}</td>
                  {allDates.map((date) => {
                    const asistencia = item.asistencias.find((a) => a.fecha.split("T")[0] === date);
                    return (
                      <td key={date} className="px-6 py-4">
                        {asistencia ? (asistencia.presente ? "✔️" : "❌") : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
};

export default ListadoComisiones;
