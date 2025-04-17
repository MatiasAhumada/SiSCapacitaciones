export default {
    theme: {
      extend: {
        colors: {
          // Paleta básica en formato HEX (segura para html2canvas y jsPDF)
          primary: "#1d4ed8",     // azul
          secondary: "#64748b",   // gris azulado
          success: "#22c55e",     // verde
          warning: "#facc15",     // amarillo
          danger: "#ef4444",      // rojo
          light: "#f1f5f9",       // fondo claro
          dark: "#0f172a",        // casi negro
        },
      },
    },
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    plugins: [],
  };
  