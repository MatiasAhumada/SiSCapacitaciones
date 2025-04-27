import React, { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import plantilla from "../assets/comprobanteSis.jpg";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
const ReciboComprobante = ({
  numero,
  comprobante,
  apellidoNombre,
  dni,
  domicilioComercial,
  iva,
  fecha,
  formaPago,
  observacion,
  monto,
  numeroComprobante,
}) => {
  const canvasRef = useRef(null);
  const formatToDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes} `;
  };
  const formattedDate = formatToDisplay(fecha);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = plantilla;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      ctx.fillText(apellidoNombre, 400, 400);

      ctx.font = "20px Arial";
      ctx.fillText(dni, 760, 400);

      ctx.font = "20px Arial";
      ctx.fillText(domicilioComercial, 915, 433);

      ctx.font = "20px Arial";
      ctx.fillText(iva, 205, 455);

      ctx.font = "20px Arial";
      ctx.fillText(formattedDate, 30, 580);

      ctx.font = "bold 20px Arial";
      ctx.fillText(formattedDate, 900, 225);
      ctx.font = "bold 20px Arial";
      ctx.fillText(numeroComprobante, 800, 183);

      ctx.font = "20px Arial";
      ctx.fillText(formaPago, 250, 580);

      ctx.font = "20px Arial";
      ctx.fillText(observacion, 400, 580);

      ctx.font = "20px Arial";
      ctx.fillText(`$${monto}`, 1120, 580);

      ctx.font = "20px Arial";
      ctx.fillText(`$${monto}`, 1120, 622);

      ctx.font = "20px Arial";
      ctx.fillText(formattedDate, 60, 755);

      ctx.font = "20px Arial";
      ctx.fillText(comprobante, 380, 755);

      ctx.font = "20px Arial";
      ctx.fillText(numero, 740, 755);

      ctx.font = "20px Arial";
      ctx.fillText(`$${monto}`, 1120, 755);

      ctx.font = "20px Arial";
      ctx.fillText(`$${monto}`, 1120, 797);

      ctx.fillStyle = "#5E5D6B";
      ctx.font = "20px Arial";
      ctx.fillText(`Controle el proceso de sus ventas utilizando SiSCapacitaciones`, 30, 1697);
      ctx.fillStyle = "#5E5D6B";
      ctx.font = "20px Arial";
      ctx.fillText(`2025 © Desarrollado por Matias Ahumada FullStack Dev Tel: +54 9 381-352-8658`, 30, 1720);
    };
  }, [apellidoNombre, dni, domicilioComercial, iva, formattedDate, formaPago, observacion, monto]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`Recibo-${apellidoNombre}.pdf`);
  };
  return (
    <>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto", border: "1px solid #ccc" }} />
      <div className="flex justify-end mt-4">
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
          Descargar
        </Button>
      </div>
    </>
  );
};

export default ReciboComprobante;
