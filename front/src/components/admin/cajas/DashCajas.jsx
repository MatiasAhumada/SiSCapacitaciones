import React, { use, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteMovCaja, editMovCaja, getAlu, GetCajaByVendedor, getCajas, getSucursalId, getVendedores, getVendID } from "../../queris/queris";
import Swal from "sweetalert2";

const DashCajas = () => {
  const idVend = localStorage.getItem("token");
  const [tableItems, setTableItems] = useState([]);
  const [pause, setPause] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [alu, setAlu] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [formEdit, setFormEdit] = useState({
    fecha: "",
    tipo: "",
    metodoPago: "",
    monto: "",
    dexcripcion: "",
    alumnoId: "",
    vendedorId: idVend,
  });

  const navigate = useNavigate();
  const isSubRoute = location.pathname.includes("crear");

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const peticion = async () => {
      await GetCajaByVendedor(idVend).then((data) => {
        setTableItems(data);
      });
    };
    const alumnos = async () => {
      await getAlu().then((data) => {
        try {
          setAlu(data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    const totalCajas = async () => {
      await getCajas().then((data) => {
        console.log(data);
      });
    };
    totalCajas()
    alumnos();
    peticion();
  }, []);

  const clickDelete = async (e) => {
    e.preventDefault();
    const movId = e.target.value;

    setPause((prev) => ({ ...prev, [movId]: true }));

    await deleteMovCaja(e.target.value).then(() => {
      try {
        Swal.fire({
          title: "Profesor Eliminado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause((prev) => {
            const newPause = { ...prev };
            delete newPause[movId];
            return newPause;
          });

          setTableItems((prev) => prev.filter((item) => item.id !== movId));
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleEdit = (mov) => {
    setEditMode(mov.id);
    setFormEdit({
      fecha: fecha,
      tipo: mov.tipo,
      metodoPago: mov.metodoPago,
      monto: mov.monto,
      descripcion: mov.descripcion,
      alumnoId: mov.alumno.id,
      vendedorId: idVend,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({
      ...formEdit,
      [name]: value,
    });
  };

  const handleAlumnoChange = (e) => {
    setFormEdit((prev) => ({
      ...prev,
      alumnoId: e.target.value,
    }));
  };

  const handleSave = async (item) => {
    setPause((prev) => ({ ...prev, [item.id]: true }));
    await editMovCaja(item.id, formEdit).then((data) => {
      try {
        Swal.fire({
          title: "Caja Editada",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({ title: "Error al actualizar", icon: "error" });
      } finally {
        setPause((prev) => ({ ...prev, [item.id]: false }));
        setEditMode(null);
      }
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {!isSubRoute && (
        <>
          <div className="items-start justify-between md:flex">
            <div className="max-w-lg">
              <h3 className="text-gray-800 text-xl font-bold sm:text-2xl principal">Historial de cajas</h3>
              <p className="text-gray-600 mt-2">En esta tabla estaran los movimientos realizados.</p>
            </div>
            {/* <div className="mt-3 md:mt-0">
              <button onClick={() => navigate(`/inicioVendedor/caja/crear`)} className="inline-block px-4 py-2 text-white principal btnAz md:text-sm">
                Nuevo Movimiento
              </button>
            </div> */}
          </div>
          <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
            <table className="w-full table-auto text-sm  text-center">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
                <tr>
                  <th className="py-3 px-6">Fecha</th>
                  <th className="py-3 px-6">Vendedor</th>
                  <th className="py-3 px-6">Alumno</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Metodo de Pago</th>
                  <th className="py-3 px-6">Descripcion</th>
                  <th className="py-3 px-6">Monto</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y text-center">
                {tableItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input
                          type="text"
                          name="fecha"
                          id="fecha"
                          disabled
                          value={formatToDisplay(fecha)}
                          onChange={handleChange}
                          className="text-center"
                        />
                      ) : (
                        item.fecha
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select name="alumnoId" value={formEdit.alumnoId} onChange={handleAlumnoChange}>
                          <option value="">Seleccione un alumno</option>
                          {alu.map((alumno) => (
                            <option key={alumno.id} value={alumno.id}>
                              {alumno.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.alumno.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select name="tipo" value={formEdit.tipo} onChange={handleChange}>
                          <option value="">Seleccione</option>
                          <option value="ingreso">Ingreso</option>
                          <option value="egreso">Egreso</option>
                          <option value="transferencia">Transferencia de caja</option>
                        </select>
                      ) : (
                        item.tipo
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <select name="metodoPago" value={formEdit.metodoPago} onChange={handleChange}>
                          <option value="">Seleccione</option>
                          <option value="efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia</option>
                          <option value="debito">Debito</option>
                          <option value="credito">Credito</option>
                        </select>
                      ) : (
                        item.metodoPago
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input type="text" name="descripcion" value={formEdit.descripcion || ""} onChange={handleChange} className="text-center" />
                      ) : (
                        item.descripcion
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <input type="number" name="monto" value={formEdit.monto || ""} onChange={handleChange} className="text-center" />
                      ) : (
                        item.monto
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editMode === item.id ? (
                        <button onClick={() => handleSave(item)} className="px-4 py-2 text-white me-2 bg-green-500 hover:bg-green-600 rounded">
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
                            "Guardar"
                          )}
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(item)} className="px-4 py-2 text-white btnAz rounded me-2">
                          Editar
                        </button>
                      )}
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

export default DashCajas;
