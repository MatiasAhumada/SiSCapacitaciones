import PropTypes from 'prop-types';

const Opciones = ({ setCambio, setCuotavieja }) => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">¿Que desea cobrar?</h2>
        <div className="flex flex-col gap-4">
          <button
            className="btnAz text-white py-2 px-4 rounded-xl transition"
            onClick={() => {
              setCambio(true);
              setCuotavieja(true);
            }}
          >
            Cuotas vieja
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl  transition"
            onClick={() => setCambio(true)}
          >
            Cuotas nueva
          </button>
        </div>
      </div>
    </div>
  );
};

Opciones.propTypes = {
  setCambio: PropTypes.func.isRequired,
  setCuotavieja: PropTypes.func.isRequired,
};

export default Opciones;
