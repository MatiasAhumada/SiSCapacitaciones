import React from "react";
import { useEffect, useState } from "react";
import logo from "../assets/simplificado_a_color.png";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAlu,
  getAluID,
  getCursos,
  getVendedores,
  getVendID,
  postCaja,
  postProfes,
} from "../queris/queris";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
import jsPDF from "jspdf";
import { Modal } from "antd";
import ReciboComprobante from "./Comprobante";
import Opciones from "./Opciones";
const CajaTransferencia = () => {
  const idVende = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imprimir, setImprimir] = useState({
    tipoComprobante: "Factura de venta",
  });
  const [infoComprobante, setInfoComprobante] = useState({
    apellidoNombre: "",
    dni: "",
    domicilioComercial: "",
    iva: "",
    numeroSucursal: "",
    fecha: "",
    formaPago: "",
    observacion: "",
    monto: "",
    tipoComprobante: "",
    numero: "",
  });
  const [cambio, setCambio] = useState(false);
  const [cuotaVieja, setCuotavieja] = useState(false);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pause, setPause] = useState(false);
  const [vend, setVend] = useState({});
  const [vendedores, setVendores] = useState([]);
  const [alu, setAlu] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [formData, setFormData] = useState({
    fecha: "",
    metodoPago: "",
    tipo: "",
    descripcion: "",
    vendedorId: "",
    alumnoComisionId: "",
    monto: "",
    cuota: "",
    //vendTransId: "",
    comprobante: {
      apellidoNombre: "",
      dni: "",
      domicilioComercial: "",
      iva: "",
      numeroSucursal: "",
      fecha: "",
      formaPago: "",
      observacion: "",
      monto: "",
      tipoComprobante: "",
      numero: "",
    },
  });
  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes} `;
  };

  useEffect(() => {
    const vendedor = async () => {
      await getVendID(idVende).then((data) => {
        setVend(data);
        setFormData((prev) => ({
          ...prev,
          vendedorId: data.id,
        }));
      });
    };
    const vendedores = async () => {
      await getVendedores().then((data) => {
        setVendores(data);
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

    vendedor();
    vendedores();
    alumnos();

    const intervalId = setInterval(() => {
      setFecha(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const {
      vendedorId,
      tipo,
      alumnoId,
      cuota,
      descripcion,
      monto,
      metodoPago,
    } = e.target;
    const fechaISO = fecha.toISOString();
    e.preventDefault();
    setPause(true);
    //ARMO COMPROBANTE
    const cargaComprobante = {
      ...infoComprobante,
      fecha: cuotaVieja ? formData.fecha : fechaISO,
      formaPago: metodoPago.value,
      observacion: descripcion.value,
      monto: monto.value,
      tipoComprobante: "Factura de venta",
      numero: "-",
      ...alumnoSeleccionado,
    };

    setInfoComprobante(cargaComprobante);
    //ARMO EL FORM DATA
    const nuevoFormData = {
      ...formData,
      fecha: cuotaVieja ? formData.fecha : fechaISO,
      metodoPago: metodoPago.value,
      descripcion: descripcion.value,
      monto: monto.value,
      tipo: tipo.value,
      vendedorId: idVende,
      comprobante: cargaComprobante,
    };

    await postCaja(nuevoFormData).then((data) => {
      try {
        Swal.fire({
          title: "Movimiento Registrado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setImprimir(data.comprobante);
          setPause(false);
          setGeneratePDF(true);
        });
      } catch (error) {
        console.log(error);
        setPause(false);
      }
    });
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleAlumnoClick = async (e) => {
    e.preventDefault();
    setPause(true);
    await getAluID(alu)
      .then((data) => {
        if (data) {
          setFormData((prev) => ({
            ...prev,
            alumnoComisionId: data.id,
          }));
          setAlumnoSeleccionado({
            apellidoNombre: data.name,
            dni: data.dni,
            domicilioComercial: `${data.address}, ${data.locality}`,
            iva: "-",
            numeroSucursal: "000" + data.sucursal.numeroSucursal,
          });
          setPause(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró el alumno",
          });
          setPause(false);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el alumno:", error);
      });
  };

  return (
    <>
      <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
        <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
          <div>
            <img src={logo} alt="Logo" width="50" />
          </div>

          <h2 className="my-auto principal">Transferencias</h2>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="pb-2">
            <label htmlFor="fecha" className="block mb-2 text-sm  principal">
              Fecha
            </label>
            <div className="relative text-gray-400">
              {!cuotaVieja ? (
                <input
                  type="text"
                  name="fecha"
                  id="fecha"
                  disabled
                  defaultValue={formatToDisplay(fecha)}
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                />
              ) : (
                <input
                  type="date"
                  name="fecha"
                  id="fecha"
                  value={formData.fecha?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                />
              )}
            </div>
          </div>
          <div className="pb-2">
            <label
              htmlFor="vendedor"
              className="block mb-2 text-sm  principal text-[#111827]"
            >
              Vendedor
            </label>
            <div className="relative text-gray-400">
              <input
                type="string"
                name="vendedorId"
                id="vendedorId"
                disabled
                defaultValue={vend.name || ""}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>
          <div className="pb-2">
            <label className="block mb-2 text-sm principal">
              Tipo de Movimiento
            </label>
            <input
              type="string"
              name="tipo"
              id="tipo"
              disabled
              defaultValue={"Egreso"}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            />
          </div>

          <div className="pb-2">
            <label className="block mb-2 text-sm principal">
              Metodo de Pago
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            >
              <option value="">Seleccione</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Credito">Credito</option>
              <option value="Digital Tobias">Digital Tobias</option>
              <option value="Digital Javier">Digital Javier</option>
            </select>
          </div>
          <div className="pb-2">
            <div className="pb-2">
              <label
                htmlFor="cuota"
                className="block mb-2 text-sm  principal text-[#111827]"
              >
                Alumno
              </label>

              <div className="relative text-gray-400">
                <input
                  type="number"
                  name="alumnoId"
                  id="alumnoId"
                  value={alu}
                  onChange={(e) => setAlu(e.target.value)}
                  className="w-full bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400   p-3 pr-20"
                  placeholder="ID del alumno"
                />
                <button
                  type="button"
                  onClick={handleAlumnoClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btnAz text-white text-sm px-4 py-1.5 rounded-md min-w-[100px] flex items-center justify-center"
                >
                  {pause ? (
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
                    "Buscar"
                  )}
                </button>
              </div>
            </div>
            {alumnoSeleccionado && (
              <div className="text-sm text-gray-700 mb-2">
                Alumno encontrado: {alumnoSeleccionado.apellidoNombre}
              </div>
            )}
          </div>

          <div className="pb-2">
            <label
              htmlFor="cuota"
              className="block mb-2 text-sm  principal text-[#111827]"
            >
              N° Cuota
            </label>
            <div className="relative text-gray-400">
              <input
                type="number"
                name="cuota"
                id="cuota"
                value={formData.cuota}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>
          <div className="pb-2">
            <label
              htmlFor="descripcion"
              className="block mb-2 text-sm  principal text-[#111827]"
            >
              Descripcion
            </label>
            <div className="relative text-gray-400">
              <input
                type="text"
                name="descripcion"
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>
          <div className="pb-2">
            <label
              htmlFor="monto"
              className="block mb-2 text-sm  principal text-[#111827]"
            >
              Monto
            </label>
            <div className="relative text-gray-400">
              <input
                type="number"
                name="monto"
                id="monto"
                value={formData.monto}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
          >
            {pause ? (
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
              "Registrar Movimiento"
            )}
          </button>
          {generatePDF && (
            <button
              type="button"
              onClick={handleOpen}
              className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 mt-2"
            >
              Generar PDF
            </button>
          )}
        </form>
        <Modal
          title="Comprobante"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <ReciboComprobante {...imprimir}></ReciboComprobante>
        </Modal>
      </div>
    </>
  );
};

export default CajaTransferencia;
