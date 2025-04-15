import { useEffect, useState } from "react";
import logo from "../assets/simplificado_a_color.png";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAlu, getCursos, getSucursalId, getVendedores, getVendID, postCaja, postProfes } from "../queris/queris";
import html2pdf from 'html2pdf.js';
import { useRef } from "react";
import jsPDF from "jspdf";

const CreateCaja = () => {
  const comprobanteBase = {
    empresa: "Sis Capacitaciones",
    direcciones: ["Junín 483 S.M. De Tucumán", "25 De Mayo 54 Santiago Del Estero"],
    telefono: "3816669100",
    email: "gruposis.srl@gmail.com",
    sitioWeb: "siscursos.com",
    titulo: "RECIBO DE COBRANZA",
    numero: "X 0001-00015217",
    fechaEmision: "12/04/2025",
    cuit: "30-71724560-8",
    ingresosBrutos: "30-71724560-8",
    inicioActividades: "01/07/2021",
    condicionIVA: "Responsable Inscripto",
    cliente: {
      nombre: "Lopez valentina alejandra",
      dni: "47852290",
      condicionIVA: "-",
      domicilio: "Tucumán",
    },
    valoresRecibidos: [
      {
        fecha: "12/04/2025",
        formaPago: "Banco",
        observacion: "-",
        monto: "$12.500,00",
      },
    ],
    totalRecibido: "$12.500,00",
    conceptoCancelacion: [
      {
        fechaEmision: "12/04/2025",
        comprobante: "Factura de Venta",
        numero: "-",
        monto: "$12.500,00",
      },
    ],
    totalCancelacion: "$12.500,00",
    leyendaRecibido: "RECIBIDO",
    pieFirma: {
      firma: "....................................",
      aclaracion: ".........................................",
      dni: "......................................",
      fecha: "....................",
    },
    leyendaPie: "Controle el proceso de sus ventas utilizando Contagram",
    derechos: "2025 © Desarrollado por www.contagram.com Pág 1/1",
    urlContagram: "https://www.contagram.com/?utm_source=google&utm_medium=organico&utm_campaign=VIRAL_TOOL",
  };

  const reciboRef = useRef(null);

  const generateReceipt = () => {
    const doc = new jsPDF();
    
    // Añadir el contenido HTML
    const receiptHtml = document.getElementById('receipt').innerHTML;
    
    doc.html(receiptHtml, {
      callback: function (doc) {
        doc.save('recibo.pdf');
      },
      x: 10,
      y: 10
    });
  };
  const handleGenerarReciboPDF = () => {
    console.log(reciboRef.current)
    if (!reciboRef.current) return;

    const alumno = alu.find((a) => a.id === formData.alumnoComisionId);

    comprobanteBase.cliente.nombre = alumno?.name || "";
    comprobanteBase.cliente.dni = alumno?.dni || "";
    comprobanteBase.fechaEmision = formatToDisplay(fecha);

    comprobanteBase.valoresRecibidos = [
      {
        fecha: formatToDisplay(fecha),
        formaPago: formData.metodoPago,
        observacion: formData.descripcion,
        monto: `$${formData.monto}`,
      },
    ];

    comprobanteBase.totalRecibido = `$${formData.monto}`;

    comprobanteBase.conceptoCancelacion = [
      {
        fechaEmision: formatToDisplay(fecha),
        comprobante: "Factura de Venta",
        numero: "-",
        monto: `$${formData.monto}`,
      },
    ];

    comprobanteBase.totalCancelacion = `$${formData.monto}`;

    html2pdf()
      .set({
        margin: 10,
        filename: "recibo.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reciboRef.current)
      .save();
  };

  const idVend = localStorage.getItem("token");
  const [pause, setPause] = useState(false);
  const [vend, setVend] = useState({});
  const [vendedores, setVendores] = useState([]);
  const [alu, setAlu] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [formData, setFormData] = useState({
    fecha: "2024-03-09T10:00:00Z",
    metodoPago: "",
    tipo: "",
    descripcion: "",
    vendedorId: "",
    alumnoComisionId: "",
    monto: "",
    cuota: "",
    vendTransId: "",
  });

  useEffect(() => {
    const vendedor = async () => {
      await getVendID(idVend).then((data) => {
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAlumnoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);
    await postCaja(formData).then((data) => {
      try {
        Swal.fire({
          title: "Movimiento Registrado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>

        <h2 className="my-auto principal">Cobranzas</h2>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
          <label htmlFor="fecha" className="block mb-2 text-sm  principal">
            Fecha
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="fecha"
              id="fecha"
              disabled
              defaultValue={formatToDisplay(fecha) || ""}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="vendedor" className="block mb-2 text-sm  principal text-[#111827]">
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
          <label className="block mb-2 text-sm principal">Tipo de Movimiento</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
          >
            <option value="">Seleccione</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
            <option value="transferencia">Transferencia de caja</option>
          </select>
        </div>

        {formData.tipo === "transferencia" ? (
          <div className="pb-2">
            <label className="block mb-2 text-sm principal">Vendedor Destino</label>
            <select
              name="vendTransId"
              value={formData.vendTransId}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
            >
              <option value="">Seleccione un vendedor</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="pb-2">
              <label className="block mb-2 text-sm principal">Forma de Pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              >
                <option value="">Seleccione</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Debito">Debito</option>
                <option value="Credito">Credito</option>
              </select>
            </div>
            <div className="pb-2">
              <label className="block mb-2 text-sm principal">Alumno</label>
              <select
                name="alumnoComisionId"
                value={formData.alumnoComisionId}
                onChange={handleAlumnoChange}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5"
              >
                <option value="">Seleccione un alumno</option>
                {alu.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="pb-2">
          <label htmlFor="cuota" className="block mb-2 text-sm  principal text-[#111827]">
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
          <label htmlFor="descripcion" className="block mb-2 text-sm  principal text-[#111827]">
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
          <label htmlFor="monto" className="block mb-2 text-sm  principal text-[#111827]">
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
            <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            "Registrar Movimiento"
          )}
        </button>
        <button type="button" onClick={generateReceipt}>Generar Recibo PDF</button>
      </form>
      <div
        ref={reciboRef}
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          fontFamily: "Arial",
          padding: "20px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
        id="receipt"
      >
        {" "}
        <h2>{comprobanteBase.empresa}</h2>
        <p>
          {comprobanteBase.direcciones[0]} - {comprobanteBase.direcciones[1]}
        </p>
        <p>Tel: {comprobanteBase.telefono}</p>
        <p>Email: {comprobanteBase.email}</p>
        <p>Web: {comprobanteBase.sitioWeb}</p>
        <h3 style={{ marginTop: "20px", borderTop: "1px solid #000", paddingTop: "10px" }}>{comprobanteBase.titulo}</h3>
        <p>
          <strong>Numero:</strong> {comprobanteBase.numero}
        </p>
        <p>
          <strong>Fecha de Emisión:</strong> {comprobanteBase.fechaEmision}
        </p>
        <p>
          <strong>CUIT:</strong> {comprobanteBase.cuit}
        </p>
        <p>
          <strong>Ingresos Brutos:</strong> {comprobanteBase.ingresosBrutos}
        </p>
        <p>
          <strong>Inicio de Actividades:</strong> {comprobanteBase.inicioActividades}
        </p>
        <p>
          <strong>Condición IVA:</strong> {comprobanteBase.condicionIVA}
        </p>
        <p>
          <strong>Apellido y Nombre / Razón Social:</strong> {comprobanteBase.cliente.nombre}
        </p>
        <p>
          <strong>DNI:</strong> {comprobanteBase.cliente.dni}
        </p>
        <p>
          <strong>Domicilio Comercial:</strong> {comprobanteBase.cliente.domicilio}
        </p>
        <h4>Valores Recibidos</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Forma de Pago</th>
              <th>Observación</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {comprobanteBase.valoresRecibidos.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{item.formaPago}</td>
                <td>{item.observacion}</td>
                <td>{item.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ textAlign: "right", fontWeight: "bold" }}>Total: {comprobanteBase.totalRecibido}</p>
        <h4>Concepto de Cancelación</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Comprobante</th>
              <th>Número</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {comprobanteBase.conceptoCancelacion.map((item, index) => (
              <tr key={index}>
                <td>{item.fechaEmision}</td>
                <td>{item.comprobante}</td>
                <td>{item.numero}</td>
                <td>{item.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ textAlign: "right", fontWeight: "bold" }}>Total: {comprobanteBase.totalCancelacion}</p>
        <h4>{comprobanteBase.leyendaRecibido}</h4>
        <p style={{ marginTop: "40px" }}>
          Firma: {comprobanteBase.pieFirma.firma} Aclaración: {comprobanteBase.pieFirma.aclaracion} DNI: {comprobanteBase.pieFirma.dni} Fecha:{" "}
          {comprobanteBase.pieFirma.fecha}
        </p>
        <hr />
        <p>{comprobanteBase.leyendaPie}</p>
        <p>{comprobanteBase.derechos}</p>
      </div>
    </div>
  );
};

export default CreateCaja;
