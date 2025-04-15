import React from "react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
const datosFijos = {
  empresa: "Sis Capacitaciones",
  direccion1: "Junín 483 S.M. De Tucumán",
  direccion2: "25 De Mayo 54 Santiago Del Estero",
  telefono: "3816669100",
  email: "gruposis.srl@gmail.com",
  sitioWeb: "siscursos.com",
  numeroComprobante: "X 0001-00015217",
  cuit: "30-71724560-8",
  ingresosBrutos: "30-71724560-8",
  inicioActividades: "01/07/2021",
  condicionIVA: "Responsable Inscripto",
  conceptoCancelacion: "Factura de Venta",
  piePagina: "Controle el proceso de sus ventas utilizando Contagram",
  derechos: "2025 © Desarrollado por www.contagram.com",
  urlContagram: "https://www.contagram.com/?utm_source=google&utm_medium=organico&utm_campaign=VIRAL_TOOL",
};

i;
const ReciboComprobante = ({ fecha, formaPago, observacion, monto, apellidoNombre, dni, domicilioComercial }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      content: () => contentRef.current
    });
  
    const handleDownloadPDF = () => {
      if (!contentRef.current) return;
  
      html2pdf()
        .set({
          margin: 10,
          filename: "recibo.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .from(contentRef.current)
        .save();
    };
  
    return (
      <>
        <div style={{ marginBottom: "20px" }}>
          <button onClick={handlePrint}>🖨️ Imprimir</button>
          <button onClick={handleDownloadPDF} style={{ marginLeft: "10px" }}>📥 Descargar PDF</button>
        </div>
  
        <div ref={contentRef} style={{ fontFamily: "Arial", padding: "20px", border: "1px solid #000" }}>
          <h2>{datosFijos.empresa}</h2>
          <p>{datosFijos.direccion1} - {datosFijos.direccion2}</p>
          <p>Tel: {datosFijos.telefono}</p>
          <p>{datosFijos.email}</p>
          <p>{datosFijos.sitioWeb}</p>
  
          <h3 style={{ borderTop: "1px solid #000", paddingTop: "10px" }}>RECIBO DE COBRANZA</h3>
          <p><strong>Numero:</strong> {datosFijos.numeroComprobante}</p>
          <p><strong>Fecha de Emisión:</strong> {fecha}</p>
  
          <p><strong>CUIT:</strong> {datosFijos.cuit}</p>
          <p><strong>Ingresos Brutos:</strong> {datosFijos.ingresosBrutos}</p>
          <p><strong>Fecha de Inicio de Actividades:</strong> {datosFijos.inicioActividades}</p>
          <p><strong>Condición IVA:</strong> {datosFijos.condicionIVA}</p>
  
          <p><strong>Apellido y Nombre / Razón Social:</strong> {apellidoNombre} <strong>DNI:</strong> {dni}</p>
          <p><strong>Domicilio Comercial:</strong> {domicilioComercial}</p>
  
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
              <tr>
                <td>{fecha}</td>
                <td>{formaPago}</td>
                <td>{observacion}</td>
                <td>${monto}</td>
              </tr>
            </tbody>
          </table>
  
          <p style={{ textAlign: "right", fontWeight: "bold" }}>Total: ${monto}</p>
  
          <h4>Concepto de Cancelación</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Fecha de Emisión</th>
                <th>Comprobante</th>
                <th>Número</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{fecha}</td>
                <td>{datosFijos.conceptoCancelacion}</td>
                <td>-</td>
                <td>${monto}</td>
              </tr>
            </tbody>
          </table>
  
          <p style={{ textAlign: "right", fontWeight: "bold" }}>Total: ${monto}</p>
  
          <p style={{ marginTop: "40px" }}>
            Firma: .................................... Aclaración: ......................................... DNI: ...................................... Fecha: ....................
          </p>
  
          <hr />
          <p>{datosFijos.piePagina}</p>
          <p>{datosFijos.derechos}</p>
        </div>
      </>
    );
};

export default ReciboComprobante;
