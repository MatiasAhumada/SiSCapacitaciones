import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import completo from "../assets/Completo_a_color.png";
const ReciboComprobante = ({ fecha, formaPago, observacion, monto, apellidoNombre, dni, domicilioComercial }) => {
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
    leyendaPie: "Controle el proceso de sus ventas utilizando el sistema SiSCapacitaciones",
    derechos: "2025 © Desarrollado por Matias Ahumada  Tel: +54 381-352-8658",
  };

  const reciboRef = useRef(null);

  const generateReceipt = () => {
    navigate(`/${idVend}/recibo`);
    const doc = new jsPDF();

    // Añadir el contenido HTML
    const receiptHtml = document.getElementById("receipt").innerHTML;

    doc.html(receiptHtml, {
      callback: function (doc) {
        doc.save("recibo.pdf");
      },
      x: 10,
      y: 10,
    });
  };
  const handleGenerarReciboPDF = () => {
    console.log(reciboRef.current);
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

  return (
    <div ref={reciboRef} className="m-3" id="receipt">
      <div className="flex justify-between">
        <div className="border-1 ps-3 pe-3 pt-3 w-1/2">
          <div className="mb-3">
            <img src={completo} className="w-60 h-20 mb-3 ms-3" />
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
        <div className="border-1 w-1/2">
          <h3>{comprobanteBase.titulo}</h3>
          <p className="m-0 text-sm">
            <strong>Numero:</strong> {comprobanteBase.numero}
          </p>
          <p className="m-0 text-sm">
            <strong>Fecha de Emisión:</strong> {comprobanteBase.fechaEmision}
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
  );
};

export default ReciboComprobante;
