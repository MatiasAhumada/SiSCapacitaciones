import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import completo from "../assets/Completo_a_color.png";
import html2pdf from "html2pdf.js";
import autoTable from "jspdf-autotable";
import plantilla from "../assets/comprobanteSis.jpg";
import html2canvas from "html2canvas";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
const ReciboComprobante = ({ open, onClose, apellidoNombre, dni, domicilioComercial, iva, fecha, formaPago, observacion, monto }) => {
  const canvasRef = useRef(null);

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
      ctx.font = "28px Arial";
      ctx.textAlign = "left";

      // Ajustá coordenadas según el diseño
      ctx.fillText(apellidoNombre, 100, 230);
      ctx.fillText(dni, 630, 230);
      ctx.fillText(domicilioComercial, 630, 270);
      ctx.fillText(iva, 170, 270);
      ctx.fillText(fecha, 670, 95);
      ctx.fillText(formaPago, 170, 420);
      ctx.fillText(observacion, 370, 420);
      ctx.fillText(`$${monto}`, 740, 420);
      ctx.fillText(`$${monto}`, 920, 470);
    };
  }, [apellidoNombre, dni, domicilioComercial, iva, fecha, formaPago, observacion, monto]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `Recibo-${apellidoNombre}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  return (
    <>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto", border: "1px solid #ccc" }} />
      <div className="flex justify-end mt-4">
        <Button type="primary" icon={<DownloadOutlined/>} onClick={handleDownload}>
          Descargar
        </Button>
      </div>
    </>
  );
};

export default ReciboComprobante;
