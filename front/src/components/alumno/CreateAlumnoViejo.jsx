import { useState } from 'react';
import Swal from 'sweetalert2';
import { postAluSimple } from '../queris/queris';

const CreateAlumnoViejo = () => {
  const [pause, setPause] = useState(false);
  const [formAlu, setFormAlu] = useState({
    dni: '',
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAlu({ ...formAlu, [name]: value });
  };

  const handleSubmit = async () => {
    setPause(true);
    try {
      const data = await postAluSimple(formAlu);
      // .then((data) => {
      //   if (data) {
      //   }
      // });
      Swal.fire({
        icon: 'success',
        title: 'Alumno Cargado',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        setFormAlu({ dni: '', name: '' });
        setPause(false);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: error?.response?.data?.message || 'Error al cargar alumno',
        showConfirmButton: false,
        timer: 1500,
      });
      setPause(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="p-4 border rounded-lg shadow-md text-center w-1/2">
        <h2 className="text-lg principal">Cargar Alumno</h2>
        <p>Ingrese Informacion del alumno.</p>
        <div className="mt-4 flex justify-center items-center">
          <div className="flex flex-col">
            <label htmlFor="dni" className="mb-1 text-sm">
              DNI
            </label>
            <input
              type="number"
              name="dni"
              value={formAlu.dni}
              placeholder="42499732"
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <label htmlFor="name" className="mb-1 text-sm">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formAlu.name}
              placeholder="matias ahumada"
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleSubmit} className="px-4 py-2 btnAz rounded">
            {pause ? (
              <svg
                fill="white"
                className="w-6 h-6 mx-auto"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="0.75s"
                    values="0 12 12;360 12 12"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            ) : (
              'Siguiente'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlumnoViejo;
