import React, { useEffect, useState } from "react";
import { getComisiones, getComisionId, getCursos, getProfes, getSucursales, postComision, putComision } from "../../../queris/queris";
import Swal from "sweetalert2";

const Comision = ({ nextStep, prevStep, formData, setFormData }) => {
  const [comisiones, setComisiones] = useState([]);
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  const [pause, setPause] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [next, setNext] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});
  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [nuevaComision, setNuevaComision] = useState({
    day: "",
    hour: {
      start: "",
      end: "",
    },
    name: "",
    profesorId: "",
    cursoId: "",
    sucursalId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const comData = await getComisiones();
      setComisiones(comData);
      setMostrarFormulario(comData.length === 0);

      const profData = await getProfes();
      setProfesores(profData);

      const cursoData = await getCursos();
      setCursos(cursoData);

      const sucursalData = await getSucursales();
      setSucursales(sucursalData);
    };

    fetchData();
  }, []);

  const handleSelectChange = (e) => {
    const comisionId = e.target.value;
    if (comisionId) {
      getComisionId(comisionId).then((data) => {
        setComisionSeleccionada(data);
      });
    } else {
      setComisionSeleccionada(null);
    }
  };

  const handleChange = (e) => {
    setDatosEditados({ ...datosEditados, [e.target.name]: e.target.value });
  };

  const handleEditClick = async (e) => {
    e.preventDefault();
    setEditando(true);
    setNext(true);
    setDatosEditados({ ...comisionSeleccionada });
  };

  const edit = async (e) => {
    await putComision(datosEditados.id, datosEditados).then((data) => {
      console.log(data);
      try {
        Swal.fire({
          icon: "success",
          title: "Comisión Seleccionada",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          setFormData({ ...formData, comisionId: e.target.value });
          nextStep();
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setPause(true);
    edit(e);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaComision((prevData) => ({
      ...prevData,
      [name]: value,
      hour: {
        ...prevData.hour,
        [name]: value,
      },
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setPause(true);
    await postComision(nuevaComision).then((data) => {
      try {
        Swal.fire({
          icon: "success",
          title: "Comision creada",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          setFormData({ ...formData, comisionId: data.id });
        });
      } catch (error) {
        console.log(error);
      }
    });
    nextStep();
  };
  const handleNextClick = () => {
    Swal.fire({
      icon: "success",
      title: "Comisión Seleccionada",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setPause(false);
      setFormData({ ...formData, comisionId: comisionSeleccionada.id });
      nextStep();
    });
  };
  const dias = [
    { value: "Lunes" },
    { value: "Martes" },
    { value: "Miercoles" },
    { value: "Jueves" },
    { value: "Viernes" },
    { value: "Sabado" },
    { value: "Domingo" },
  ];
  const horarios = Array.from({ length: (22 - 8) * 2 + 1 }, (_, i) => {
    const horas = Math.floor(8 + i / 2);
    const minutos = i % 2 === 0 ? "00" : "30";
    return `${horas}:${minutos}`;
  });
  return (
    <div className="p-4 border rounded-lg shadow-md text-center w-96 mx-auto">
      <h2 className="text-lg font-bold">Seleccionar Comisión</h2>
      <p>Elige una comisión para ver sus detalles.</p>

      {!mostrarFormulario ? (
        <>
          <select onChange={handleSelectChange} className="mt-4 p-2 border rounded w-full">
            <option value="">Selecciona una comisión</option>
            {comisiones.map((comision) => (
              <option key={comision.id} value={comision.id}>
                {comision.name}
              </option>
            ))}
          </select>

          {comisionSeleccionada && (
            <div className="mt-4 p-4 border rounded bg-gray-100 text-left">
              <p>
                <strong>Nombre: </strong>
                {`${comisionSeleccionada.name}`}
              </p>
              <p>
                <strong>Día:</strong>{" "}
                {editando ? (
                  <input type="text" name="day" value={datosEditados.day} onChange={handleChange} className="border p-1 rounded" />
                ) : (
                  comisionSeleccionada.day
                )}
              </p>
              <p>
                <strong>Horario:</strong>{" "}
                {editando ? (
                  <input type="text" name="hour" value={datosEditados.hour} onChange={handleChange} className="border p-1 rounded" />
                ) : (
                  `${comisionSeleccionada.hour} HS`
                )}
              </p>

              <p>
                <strong>Sucursal:</strong> {comisionSeleccionada.sucursal.name}
              </p>
              <p>
                <strong>Curso:</strong> {comisionSeleccionada.curso.name}
              </p>
              <p>
                <strong>Profesor:</strong> {comisionSeleccionada.profesor.name + " " + comisionSeleccionada.profesor.apellido}
              </p>
              <p>
                <strong>Alumnos Inscritos:</strong>
              </p>
              <ul className="list-disc ml-4">
                {comisionSeleccionada.alumnos.length > 0 ? (
                  comisionSeleccionada.alumnos.map((alumno) => <li key={alumno.id}>{alumno.name}</li>)
                ) : (
                  <li>No hay alumnos inscritos</li>
                )}
              </ul>
              <div className="flex justify-center mt-4">
                <button onClick={handleEditClick} className="px-4 py-2 btnAz rounded m-3">
                  Editar
                </button>
                {!next ? (
                  <>
                    <button onClick={handleNextClick} className="px-4 py-2 btnAz rounded m-3">
                      Siguiente
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleSaveClick} value={comisionSeleccionada.id} className="px-4 py-2 btnAz rounded m-3">
                      {pause ? (
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
                        "Guardar"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          <button onClick={() => setMostrarFormulario(true)} className="px-4 py-2 btnAz rounded m-3">
            Nueva Comision
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre de la comisión"
            value={nuevaComision.name}
            onChange={handleInputChange}
            className="p-2 border rounded w-full mt-2"
            required
          />

          <select name="day" value={nuevaComision?.day || ""} onChange={handleInputChange} className="p-2 border rounded w-full mt-2">
            <option value="">Seleccionar Dia</option>
            {dias.map((dia, idx) => (
              <option key={idx} value={dia.value}>
                {dia.value}
              </option>
            ))}
          </select>
          {/* <input
            type="string"
            name="hour"
            value={nuevaComision.hour}
            onChange={handleInputChange}
            className="p-2 border rounded w-full mt-2"
            required
            placeholder="Horario de la comisión"
          /> */}
          <div className="flex gap-2 w-full mt-2 mb-0">
            <select name="start" value={nuevaComision.hour?.start || ""} onChange={handleChange} className="p-2 border rounded w-1/2">
              <option value=""> Inicio</option>
              {horarios.map((horario, index) => (
                <option key={index} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
            <span>-</span>
            <select name="end" value={nuevaComision.hour?.end || ""} onChange={handleChange} className="p-2 border rounded w-1/2">
              <option value=""> Fin</option>
              {horarios.map((horario, index) => (
                <option key={index} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
          <select name="sucursalId" onChange={handleInputChange} className="p-2 border rounded w-full mt-2" required>
            <option value="">Selecciona una sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select name="profesorId" onChange={handleInputChange} className="p-2 border rounded w-full mt-2" required>
            <option value="">Selecciona un profesor</option>
            {profesores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name + " " + p.apellido}
              </option>
            ))}
          </select>
          <select name="cursoId" onChange={handleInputChange} className="p-2 border rounded w-full mt-2" required>
            <option value="">Selecciona un curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 btnAz rounded mt-2">
            Crear
          </button>
        </form>
      )}
    </div>
  );
};

export default Comision;
