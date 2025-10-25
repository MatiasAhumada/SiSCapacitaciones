import { useState } from 'react';

const FilterAlus = ({ onFiltrar }) => {
  const [open, setOpen] = useState(false);
  const [pause, setPaused] = useState(false);
  const [filtros, setFiltros] = useState({
    nombre: '',
    dni: '',
    tel: '',
    cantidadComisiones: '',
    cantidadCertificados: '',
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicarFiltro = async () => {
    setPaused(true);
    await onFiltrar(filtros, setPaused);
    setPaused(false);
  };

  const limpiarFiltros = async () => {
    const filtrosVacios = {
      nombre: '',
      dni: '',
      tel: '',
      cantidadComisiones: '',
      cantidadCertificados: '',
    };
    setPaused(true);
    setFiltros(filtrosVacios);
    await onFiltrar(filtrosVacios, setPaused);
    setPaused(false);
  };

  const algunFiltroActivo = Object.values(filtros).some((v) => v.trim() !== '');

  return (
    <div className="relative w-full md:w-auto md:mt-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full md:w-auto px-4 py-2 text-white rounded btnAz flex items-center justify-center"
      >
        Filtros
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4 space-y-2">
          <input
            type="text"
            name="nombre"
            value={filtros.nombre}
            placeholder="Nombre del alumno"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="dni"
            value={filtros.dni}
            placeholder="DNI"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="text"
            name="tel"
            value={filtros.tel}
            placeholder="Teléfono"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="number"
            name="cantidadComisiones"
            value={filtros.cantidadComisiones}
            placeholder="Cantidad de Comisiones"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />
          <input
            type="number"
            name="cantidadCertificados"
            value={filtros.cantidadCertificados}
            placeholder="Cantidad de Certificados"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
          />

          <button
            onClick={aplicarFiltro}
            disabled={!algunFiltroActivo}
            className={`w-full rounded py-1 ${
              !algunFiltroActivo
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {pause ? 'Filtrando...' : 'Aplicar'}
          </button>
          <button
            onClick={limpiarFiltros}
            disabled={!algunFiltroActivo}
            className={`w-full rounded py-1 mt-2 ${
              !algunFiltroActivo
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterAlus;