import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  deleteComision,
  getAluCom,
  putComision,
} from '../../queris/queris';
import ReciboComprobante from '../../caja/Comprobante';
import { Modal } from 'antd';

const DashAlumno = () => {
  const { idAluCom, idAlu, idVend } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tableItems, setTableItems] = useState([]);
  const [dataAlumno, setDataAlumno] = useState({});
  const [dataComision, setDataComision] = useState({});
  const [pause, setPause] = useState({});
  const [editing, setEditing] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [editData, setEditData] = useState({
    fecha: '',
    metodoPago: '',
    monto: '',
    cuota: '',
    alumnoId: '',
    comisionId: '',
  });
  const [infoComprobante, setInfoComprobante] = useState({
    apellidoNombre: '',
    dni: '',
    domicilioComercial: '',
    iva: '',
    fecha: '',
    formaPago: '',
    observacion: '',
    monto: '',
    comprobante: '',
    numero: '',
    numeroComprobante: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const isSubRoute = location.pathname.includes("crear");
  const isDesdeVendedor = location.pathname.includes(idVend);
  const isDesdeAdmin = location.pathname.includes('adm');

  const clickDelete = async (id) => {
    const comisionId = id;

    setPause((prev) => ({ ...prev, [comisionId]: true }));
    await deleteComision(id).then(() => {
      try {
        Swal.fire({
          title: 'Comision Eliminada',
          icon: 'success',
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
    if (isDesdeVendedor) {
      const alucom = async () => {
        await getAluCom(idAluCom).then((data) => {
          setDataAlumno(data.alumno);
          setDataComision(data.comision);
          setTableItems(data.pagos);
        });
      };
      alucom();
    }
    if (isDesdeAdmin) {
      const alucom = async () => {
        await getAluCom(idAlu).then((data) => {
          setDataAlumno(data.alumno);
          setDataComision(data.comision);
          setTableItems(data.pagos);
        });
      };
      alucom();
    }
  }, []);

  const handleEdit = (comision) => {
    setEditing(comision.id);
    setEditData({
      name: comision.name,
      day: comision.day,
      hour: comision.hour,
      cursoId: comision.curso?.id || '',
      profesorId: comision.profesor?.id || '',
      sucursalId: comision.sucursal?.id || id,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
      hour: {
        ...prevData.hour,
        [name]: value,
      },
    }));
  };

  const handleSave = async (comisionId) => {
    setPause((prev) => ({ ...prev, [comisionId]: true }));
    try {
      await putComision(comisionId, editData);
      Swal.fire({
        title: 'Comisión actualizada',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      setTableItems((prev) =>
        prev.map((item) =>
          item.id === comisionId
            ? {
                ...item,
                ...editData,
                curso: cursos.find((c) => c.id === editData.cursoId) || item.curso,
                profesor: profesores.find((p) => p.id === editData.profesorId) || item.profesor,
              }
            : item
        )
      );
    } catch (error) {
      Swal.fire({ title: 'Error al actualizar', icon: 'error' });
    } finally {
      setPause((prev) => ({ ...prev, [comisionId]: false }));
      setEditing(null);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const handlePrint = (item) => {
    setIsModalOpen(true);
    const reciboProps = {
      numero: item.cuota,
      tipoComprobante: item.comprobante.tipoComprobante,
      apellidoNombre: dataAlumno.name, // completar con el valor correspondiente si lo tenés
      dni: dataAlumno.dni, // completar con el valor correspondiente si lo tenés
      domicilioComercial: '-', // completar si es necesario
      iva: '-', // completar si es necesario
      fecha: new Date(item.fecha).toLocaleDateString('es-AR'), // formato legible
      formaPago: item.metodoPago,
      observacion: '-', // podés poner algo como `Pago de cuota ${data.cuota}` si querés
      monto: item.monto,
      numeroComprobante: item.comprobante.numeroComprobante,
    };
    console.log(reciboProps);
    setInfoComprobante(reciboProps);
  };
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <>
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h1 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
              {dataAlumno.name}
            </h1>
            <h2 className="text-gray-800 text-xl font-bold sm:text-2xl principal">
              Tel: {dataAlumno.tel} / D.N.I: {dataAlumno.dni}
            </h2>

            <h3>
              {dataComision.name}: {dataComision.day} {dataComision.hour?.start} -{' '}
              {dataComision.hour?.end}
            </h3>
          </div>
          <div className="mt-3 md:mt-0">
            <button
              onClick={() => navigate(`/inicioVendedor/comisiones/crear`)}
              className="inline-block px-4 py-2 text-white principal btnAz md:text-sm"
            >
              Nueva Comision
            </button>
          </div>
        </div>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm  text-center">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b principal">
              <tr>
                <th className="py-3 px-6">Fecha</th>
                <th className="py-3 px-6">Forma de pago</th>
                <th className="py-3 px-6">Monto</th>
                <th className="py-3 px-6">Cuota N°</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {tableItems?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    {editing === item.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        name="name"
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    ) : (
                      formatToDisplay(item.fecha)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        item.metodoPago === 'Efectivo'
                          ? 'bg-blue-200 text-blue-800'
                          : item.metodoPago === 'Debito'
                            ? 'bg-yellow-200 text-yellow-800'
                            : item.metodoPago === 'Transferencia'
                              ? 'bg-red-200 text-red-800'
                              : item.metodoPago === 'Credito'
                                ? 'bg-pink-200 text-pink-800'
                                : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {editing === item.id ? (
                        <select
                          name="day"
                          value={editData?.day || ''}
                          onChange={handleChange}
                          className="border rounded px-2"
                        >
                          <option value="">Seleccionar</option>
                          {dias.map((dia, idx) => (
                            <option key={idx} value={dia.value}>
                              {dia.value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.metodoPago
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editing === item.id ? (
                      <>
                        <select
                          name="start"
                          value={editData.hour?.start || ''}
                          onChange={handleChange}
                          className="border rounded px-2"
                        >
                          <option value=""> Inicio</option>
                          {horarios.map((horario, index) => (
                            <option key={index} value={horario}>
                              {horario}
                            </option>
                          ))}
                        </select>
                        <span>-</span>
                        <select
                          name="end"
                          value={editData.hour?.end || ''}
                          onChange={handleChange}
                          className="border rounded px-2"
                        >
                          <option value=""> Fin</option>
                          {horarios.map((horario, index) => (
                            <option key={index} value={horario}>
                              {horario}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      item.monto
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{item.cuota}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* BOTON IMPRIMIR  */}
                    <button
                      value={item.comprobante}
                      onClick={() => handlePrint(item)}
                      className=" px-4 py-2 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                    >
                      {pause[item.id] ? (
                        <svg
                          fill="white"
                          className="w-6 h-6 mx-auto"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <i className="fa-solid fa-print"></i>
                      )}
                    </button>

                    {editing === item.id ? (
                      // BOTON GUARDAR

                      <button
                        onClick={() => handleSave(item.id)}
                        className="px-4 py-2 text-white bg-green-500 rounded ms-3"
                      >
                        {pause[item.id] ? (
                          <svg
                            fill="white"
                            className="w-6 h-6 mx-auto"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                          <i className="fa-solid fa-floppy-disk"></i>
                        )}
                      </button>
                    ) : (
                      // BOTON EDITAR
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 text-white btnAz rounded ms-3"
                      >
                        {pause[item.id] ? (
                          <svg
                            fill="white"
                            className="w-6 h-6 mx-auto"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                          <i className="fa-solid fa-pen"></i>
                        )}
                      </button>
                    )}
                    {/* BOTON BORRAR */}
                    <button
                      value={item.id}
                      onClick={() => clickDelete(item.id)}
                      className=" px-4 py-2 ms-3 text-white principal bg-red-500 hover:bg-red-600 md:text-sm rounded"
                    >
                      {pause[item.id] ? (
                        <svg
                          fill="white"
                          className="w-6 h-6 mx-auto"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <i className="fa-solid fa-x"></i>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
      {/* // )} */}
      <Outlet />
      <Modal title="Comprobante" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <ReciboComprobante {...infoComprobante}></ReciboComprobante>
      </Modal>
    </div>
  );
};
export default DashAlumno;
