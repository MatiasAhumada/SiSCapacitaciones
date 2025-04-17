import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { jsPDF } from "jspdf";
import completo from "../assets/Completo_a_color.png";
import html2pdf from "html2pdf.js";
const ReciboComprobante = ({ fecha, formaPago, observacion, monto, apellidoNombre, dni, domicilioComercial }) => {
  const comprobanteBase = {
    empresa: "Sis Capacitaciones",
    logo: completo,
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
      firma: ".............................................",
      aclaracion: ".............................................",
      dni: "......................................",
      fecha: ".......................",
    },
    leyendaPie: "Controle el proceso de sus ventas utilizando el sistema SiSCapacitaciones",
    derechos: "2025 © Desarrollado por Matias Ahumada FullStack Tel: +54 381-352-8658",
  };

  const reciboRef = useRef(null);

  const generateReceipt = (e) => {
    e.preventDefault();
    const doc = new jsPDF();

    doc.html(reciboRef.current, {
      callback: function (doc) {
        doc.save("recibo.pdf");
      },
      x: 10,
      y: 10,
    });

    // const opt = {
    //   margin: 1,
    //   filename: "recibo.pdf",
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: {
    //     scale: 2,
    //     useCORS: true,
    //   },
    //   jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    // };

    // window.html2pdf(reciboRef.current).save("recibo.pdf");
    //.set(opt).from(reciboRef.current).save();
  };

  return (
    <>
      <div
        ref={reciboRef}
        className="m-3 flex flex-col justify-between"
        id="recibo"
        style={{
          width: "794px",
          height: "1123px",
          background: "white",
          margin: "20px auto",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          padding: "20px",
        }}
      >
        <div>
          <div className="flex justify-between">
            <div className="border-1 p-3 w-1/2">
              <div className="mb-3">
                <img src={comprobanteBase.logo} className="w-60 h-20 mb-3 ms-3" />
                <strong className="text-xl ">{comprobanteBase.empresa}</strong>
              </div>
              <div>
                <p className="m-0 text-sm">
                  {comprobanteBase.direcciones[0]} - {comprobanteBase.direcciones[1]}
                </p>
                <p className="m-0 text-sm">Tel: {comprobanteBase.telefono}</p>
                <p className="m-0 text-sm"> {comprobanteBase.email}</p>
                <p className="m-0 text-sm"> {comprobanteBase.sitioWeb}</p>
              </div>
            </div>
            <div className="border-1 w-1/2 flex flex-col justify-between items-center  ">
              <div>
                <h3>{comprobanteBase.titulo}</h3>
              </div>
              <div className="pe-4 pb-3">
                <p className="m-0 text-sm pb-3">
                  <strong>Numero: {comprobanteBase.numero}</strong>
                </p>
                <p className="m-0 text-sm pb-3">
                  <strong>Fecha de Emisión: {comprobanteBase.fechaEmision}</strong>
                </p>
                <p className="m-0 text-sm">
                  <strong>CUIT:</strong> {comprobanteBase.cuit}
                </p>
                <p className="m-0 text-sm">
                  <strong>Ingresos Brutos:</strong> {comprobanteBase.ingresosBrutos}
                </p>
                <p className="m-0 text-sm">
                  <strong>Inicio de Actividades:</strong> {comprobanteBase.inicioActividades}
                </p>
                <p className="m-0 text-sm">
                  <strong>Condición IVA:</strong> {comprobanteBase.condicionIVA}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-1 mt-1 text-sm ps-3 pe-3 pt-1">
            <p>
              <strong>Apellido y Nombre / Razón Social: </strong>
              {comprobanteBase.cliente.nombre}
            </p>
            <p>
              <strong>DNI:</strong> {comprobanteBase.cliente.dni}
            </p>
            <p>
              <strong>Domicilio Comercial:</strong> {comprobanteBase.cliente.domicilio}
            </p>
            <p>
              <strong>Cond. IVA:</strong> {comprobanteBase.cliente.condicionIVA}
            </p>
          </div>
          <div>
            <p className="text-base font-bold m-0 mt-2 mb-2 ms-3">Valores Recibidos</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }} className="border-1 text-sm">
              <thead className="border-1 bg-gray-400">
                <tr>
                  <th className="border-1 text-center">Fecha</th>
                  <th className="border-1 text-center">Forma de Pago</th>
                  <th className="border-1 text-center">Observación</th>
                  <th className="border-1 text-center">Monto</th>
                </tr>
              </thead>
              <tbody>
                {comprobanteBase.valoresRecibidos.map((item, index) => (
                  <tr key={index}>
                    <td className="border-1 text-center w-20">{item.fecha}</td>
                    <td className="border-1 text-center w-25">{item.formaPago}</td>
                    <td className="border-1 text-center">{item.observacion}</td>
                    <td className="border-1 text-center w-20">{item.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold border-1 ml-auto w-fit pr-3 ps-3 mt-2">Total: {comprobanteBase.totalRecibido}</p>
          </div>
          <div>
            <p className="text-base font-bold m-0 mb-2 ms-3">Concepto de Cancelación</p>
            <table className="border-1 text-sm w-100 ">
              <thead className="border-1 text-center bg-gray-400">
                <tr>
                  <th className="border-1">Fecha de Emision</th>
                  <th className="border-1">Comprobante</th>
                  <th className="border-1">Número</th>
                  <th className="border-1">Monto</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {comprobanteBase.conceptoCancelacion.map((item, index) => (
                  <tr key={index}>
                    <td className="border-1">{item.fechaEmision}</td>
                    <td className="border-1">{item.comprobante}</td>
                    <td className="border-1">{item.numero}</td>
                    <td className="border-1">{item.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold border-1 ml-auto w-fit pr-3 ps-3 mt-2">Total: {comprobanteBase.totalCancelacion}</p>
          </div>
        </div>
        <div>
          <div className="border-1 mt-auto">
            <p className="text-base font-bold ms-3 mt-2">{comprobanteBase.leyendaRecibido}</p>
            <p className="text-base m-0">
              Firma: {comprobanteBase.pieFirma.firma} Aclaración: {comprobanteBase.pieFirma.aclaracion} DNI: {comprobanteBase.pieFirma.dni} Fecha:{" "}
              {comprobanteBase.pieFirma.fecha}
            </p>
          </div>
          <hr />
          <p className="text-xs text-gray-500">{comprobanteBase.leyendaPie}</p>
          <p className="text-xs text-gray-500">{comprobanteBase.derechos}</p>
        </div>
      </div>

      <button onClick={generateReceipt} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
        Descargar PDF
      </button>
    </>
  );
};

export default ReciboComprobante;
