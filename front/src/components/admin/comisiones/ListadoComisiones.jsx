import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComisionId } from "../../queris/queris";
import { jsPDF } from "jspdf";

import autoTable from "jspdf-autotable";

const ListadoComisiones = () => {
  const [alumnosComision, setAlumnosComision] = useState([]);
  const [comisionDate, setComisionDate] = useState([]);
  const [asistencias, setAsintencias] = useState([
    {
      fecha: "",
      presente: false,
      alumnoComisionId: "",
    },
  ]);
  const { comId } = useParams();

  useEffect(() => {
    const alumnosCom = async () => {
      await getComisionId(comId).then((data) => {
        setAlumnosComision(data.alumnoComisiones);
        setComisionDate(data);
      });
    };
    alumnosCom();
  }, []);
  console.log(alumnosComision);
  const allDates = Array.from(
    new Set(alumnosComision.flatMap((item) => item.asistencias.map((asistencia) => asistencia.fecha.split("T")[0])))
  ).sort();
  const generatePDF = () => {
    const doc = new jsPDF();

    // Obtener todas las fechas únicas
    const fechas = Array.from(new Set(alumnosComision.flatMap((item) => item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString()))));

    // Crear encabezado con nombres de columnas
    const headers = ["Alumno", "DNI", "Telefono", ...fechas];

    // Crear filas con datos de asistencia
    const rows = alumnosComision.map((item) => {
      console.log(item);
      const row = [item.alumno.name,item.alumno.dni, item.alumno.tel];
      fechas.forEach((fecha) => {
        const asistencia = item.asistencias.find((a) => new Date(a.fecha).toLocaleDateString() === fecha);
        row.push(asistencia ? (asistencia.presente ? "P" : "A") : "A");
      });
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
    });

    doc.save(`Asistencia-${comisionDate.name}.pdf`);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <>
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h2 className="text-gray-800 text-xl font-bold sm:text-2xl principal">{comisionDate.name}</h2>
            <h4 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
              Dias {comisionDate.day} {comisionDate.hour?.start} - {comisionDate.hour?.end}
            </h4>
            <h5 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
              Profesor {comisionDate.profesor?.name} {comisionDate.profesor?.apellido}
            </h5>
          </div>
          <div className="mt-3 md:mt-0">
            <button onClick={generatePDF} className="inline-block px-4 py-2 text-white principal rounded bg-red-500 hover:bg-red-600 md:text-sm">
              PDF
            </button>
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
              {alumnosComision?.map((item) => (
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
