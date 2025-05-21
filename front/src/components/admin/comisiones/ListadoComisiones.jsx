import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { editStateComision, getComisionId } from "../../queris/queris";
import { jsPDF } from "jspdf";

import autoTable from "jspdf-autotable";

const ListadoComisiones = () => {
  const [alumnosComision, setAlumnosComision] = useState([]);
  const [comisionDate, setComisionDate] = useState([]);
  const [pause, setPause] = useState({});
  const [asistencias, setAsintencias] = useState([
    {
      fecha: "",
      presente: false,
      alumnoComisionId: "",
    },
  ]);

  const { comId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navegacion = (alumno) => {
    const currentPath = location.pathname;
    const isAdmin = currentPath.startsWith("/adm");

    const pathSegments = currentPath.split("/");
    const userId = isAdmin ? pathSegments[2] : pathSegments[1];

    const redirectionPath = isAdmin ? `/adm/${userId}/alumno/${alumno.id}` : `/${userId}/alumno/${alumno.id}`;

    navigate(redirectionPath);
  };
  console.log(comisionDate);
  useEffect(() => {
    const alumnosCom = async () => {
      await getComisionId(comId).then((data) => {
        setAlumnosComision(data.alumnoComisiones);
        setComisionDate(data);
      });
    };
    alumnosCom();
  }, []);

  const allDates = Array.from(
    new Set(alumnosComision.flatMap((item) => item.asistencias.map((asistencia) => asistencia.fecha.split("T")[0])))
  ).sort();

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    // Datos extra a mostrar
    const profesor = "Prof. Juan Pérez";
    const horario = "18:00 - 20:00";
    const dia = "Lunes y Miércoles";

    // Texto arriba del PDF
    doc.setFontSize(12);
    doc.text(`Profesor: ${comisionDate.profesor.name} ${comisionDate.profesor.apellido}`, 14, 20);
    doc.text(`Horario: ${comisionDate.hour.start} - ${comisionDate.hour.end}`, 14, 28);
    doc.text(`Días: ${comisionDate.day}`, 14, 36);

    // Obtener todas las fechas únicas
    const fechas = Array.from(new Set(alumnosComision.flatMap((item) => item.asistencias.map((a) => new Date(a.fecha).toLocaleDateString()))));

    // Crear encabezado con nombres de columnas
    const headers = ["Alumno", "DNI", "Telefono", ...fechas];

    // Crear filas con datos de asistencia
    const rows = alumnosComision.map((item) => {
      console.log(item);
      const row = [item.alumno.name, item.alumno.dni, item.alumno.tel];
      fechas.forEach((fecha) => {
        const asistencia = item.asistencias.find((a) => new Date(a.fecha).toLocaleDateString() === fecha);
        row.push(asistencia ? (asistencia.presente ? "P" : "A") : "A");
      });
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 42,
    });

    doc.save(`Asistencia-${comisionDate.name}.pdf`);
  };
  const verMas = (e) => {
    e.preventDefault();
    const alumnoId = e.target.value;
    setPause((prev) => ({ ...prev, [alumnoId]: true }));
    const asistencia = alumnosComision.find((a) => a.id === alumnoId);
    setAsintencias(asistencia.asistencias);
    console.log(alumnosComision);
    setPause((prev) => {
      const newPause = { ...prev };
      delete newPause[alumnoId];
      return newPause;
    });
  };
  const clickEdit = async (e, ID) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPause((prev) => ({ ...prev, [ID]: true }));

    const nuevoEstado = name === "activo" ? false : true;
    const change = {
      estado: nuevoEstado,
      alumnoCom: ID,
    };

    try {
      await editStateComision(change).then(() => {
        try {
          setAlumnosComision((prev) => prev.map((item) => (item.id === ID ? { ...item, state: nuevoEstado } : item)));
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setPause((prev) => ({ ...prev, [ID]: false }));
    }
  };
  
  const getRowBgColor = (alumno) => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const pagosEsteMes = alumno.pagos.some((pago) => {
      const fechaPago = new Date(pago.fecha);
      return fechaPago.getMonth() === month && fechaPago.getFullYear() === year;
    });

    if (day < 10 || pagosEsteMes) return "bg-green-200";
    if (day >= 11 && day <= 15 && !pagosEsteMes) return "bg-yellow-200";
    if (day >= 16 && !pagosEsteMes) return "bg-red-200";
    return "";
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
                <th className="py-3 px-6"></th>
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
                <tr key={item.id} className={getRowBgColor(item)}>
                  <td className="px-6 py-4">
                    <button
                      value={item.id}
                      onClick={() => navegacion(item)}
                      className="px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
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
                        <i className="fa-solid fa-plus"></i>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">{item.alumno.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.alumno.tel}</td>
                  <td className="px-6 py-4">
                    <button
                      name={item.state ? "activo" : "inactivo"}
                      onClick={(e) => clickEdit(e, item.id)}
                      className={`text-xs px-2 py-0.5 rounded text-white 
                        ${item.state ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                      disabled={pause[item.id]} // evita doble click
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
                      ) : item.state ? (
                        "Activo"
                      ) : (
                        "Inactivo"
                      )}
                    </button>
                  </td>
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
