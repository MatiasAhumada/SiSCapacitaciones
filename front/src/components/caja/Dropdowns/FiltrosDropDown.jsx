import { useState } from "react";

const FiltrosDropDown = ({ onFiltrar }) => {
  const [open, setOpen] = useState(false);
  const [pause, setPaused] = useState(false);

  const [filtros, setFiltros] = useState({
    alumno: "",
    tipo: "",
    metodoPago: "",
    descripcion: "",
    fecha: "",
    categoria: "",
    subcategoria: "",
  });
  const categorias = {
    ALQUILER: ["ALQUILER"],
    SUELDOS: ["SUELDOS"],
    COMISIONES: ["COMISIONES"],
    PROFESORES: ["PROFESORES"],
    SERVICIOS: [
      "electricidad",
      "gas",
      "agua",
      "internet",
      "celulares",
      "sistemas",
      "plataformas_digitales",
      "dispenser_agua",
      "honorarios_abogados",
      "honorarios_contadores",
      "capacitaciones_y_formaciones",
      "cuotas_y_adhesiones",
    ],
    MARKETING_Y_PUBLICIDAD: ["honorarios_marketing", "publicidad_digital", "television", "radio", "diario", "imprenta", "carteleria"],
    IMPUESTOS: ["municipal", "rentas", "ingresos_brutos", "afip_iva", "afip_ganancias", "aportes_patronales", "multas", "otros"],
    REFACCIONES_Y_MANTENIMIENTOS: ["mano_de_obra", "materiales", "bienes_muebles"],
    INSUMOS: ["limpieza_e_higiene", "libreria_y_oficina", "almacen"],
    CAPACITACIONES: ["insumos_y_materiales", "herramientas_y_maquinarias"],
    VIATICOS: ["pasaje/combustible", "alojamiento", "comida"],
    GASTOS_VARIOS: ["GASTOS_VARIOS"],
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltro = async () => {
    setPaused(true);
    await onFiltrar(filtros, setPaused); // ✅ le pasás setPaused al padre
    setPaused(false); // por seguridad
  };
  const limpiarFiltros = async () => {
    const filtrosVacios = {
      alumno: "",
      tipo: "",
      metodoPago: "",
      descripcion: "",
      fecha: "",
      categoria: "",
      subcategoria: "",
    };
    setPaused(true);
    setFiltros(filtrosVacios);
    await onFiltrar(filtrosVacios, setPaused); // ✅ mismo caso
    setPaused(false);
  };
  const algunFiltroActivo = Object.values(filtros).some((v) => v.trim() !== "");

  return (
    <div className="relative inline-block mt-3 md:mt-0">
      <button onClick={() => setOpen(!open)} className="px-4 py-2  text-white rounded btnAz">
        Filtros
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4 space-y-2">
          <input
            type="text"
            name="alumno"
            value={filtros.alumno}
            placeholder="DNI Alumno"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="tipo"
            value={filtros.tipo}
            placeholder="Tipo de Movimiento"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="metodoPago"
            value={filtros.metodoPago}
            placeholder="Método de Pago"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="descripcion"
            value={filtros.descripcion}
            placeholder="Descripción"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="fecha"
            value={filtros.fecha}
            placeholder="Fecha (dd/mm/yyyy)"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={(e) => {
              const selectedCategoria = e.target.value;
              setFiltros({
                ...filtros,
                categoria: selectedCategoria,
                subcategoria: "", // reset subcategoria al cambiar categoria
              });
            }}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Seleccionar categoría</option>
            {Object.keys(categorias).map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          {filtros.categoria && (
            <select name="subcategoria" value={filtros.subcategoria} onChange={handleChange} className="w-full border rounded px-2 py-1 mt-2">
              <option value="">Seleccionar subcategoría</option>
              {categorias[filtros.categoria].map((sub) => (
                <option key={sub} value={sub}>
                  {sub.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          )}

          {/* <input
            type="text"
            name="categoria"
            value={filtros.categoria}
            placeholder="Categoría"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="subcategoria"
            value={filtros.subcategoria}
            placeholder="Subcategoría"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          /> */}

          <button
            onClick={aplicarFiltro}
            disabled={!algunFiltroActivo}
            className={`w-full rounded py-1 ${
              !algunFiltroActivo ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {pause ? (
              <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
            ) : (
              "Aplicar"
            )}
          </button>
          <button
            onClick={limpiarFiltros}
            disabled={!algunFiltroActivo}
            className={`w-full rounded py-1 mt-2 ${
              !algunFiltroActivo ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {pause ? (
              <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
            ) : (
              "Limpiar"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltrosDropDown;
