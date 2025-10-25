import { useEffect, useState } from 'react';
import logo from '../../../assets/simplificado_a_color.png';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAlu } from '../../../services/Alumnos.service';
import { getCursos } from '../../../services/Cursos.service';
import { postCert } from '../../../services/Certificados.service';

const Certificado = () => {
  const areas = ['Digital', 'Idiomas', 'Salud', 'Administrativa', 'Belleza', 'Técnica'];
  const tipos = ['Presencial', 'Distancia'];

  const navigate = useNavigate();
  const { id } = useParams();
  const [pause, setPause] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setcursos] = useState([]);
  const [formData, setFormData] = useState({
    numero: '',
    link: '',
    cursoId: '',
    alumnoId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setPause(true);
    await postCert(formData).then(() => {
      try {
        Swal.fire({
          title: 'Certificado Creado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          navigate(`/adm/${id}`);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };
  useEffect(() => {
    const alus = async () => {
      await getAlu().then((data) => {
        setAlumnos(data);
      });
    };
    const curs = async () => {
      await getCursos().then((data) => {
        setcursos(data);
      });
    };
    alus();
    curs();
  }, []);

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src={logo} alt="Logo" width="50" />
        </div>

        <h2 className="my-auto principal">Carga de Certificados</h2>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
          <label htmlFor="email" className="block mb-2 text-sm  principal">
            Link de certificado
          </label>
          <div className="relative text-gray-400">
            <input
              type="text"
              name="link"
              id="link"
              value={formData.link}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="https://certificado.com"
            />
          </div>
        </div>
        <div className="pb-2">
          <label htmlFor="apellido" className="block mb-2 text-sm  principal text-[#111827]">
            Numero de certificado
          </label>
          <div className="relative text-gray-400">
            <input
              type="number"
              name="numero"
              id="numero"
              value={formData.numero}
              onChange={handleChange}
              className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
              placeholder="27424997324"
            />
          </div>
        </div>
        <div className="pb-2">
          <label className="block mb-2 text-sm principal">Alumno</label>
          <select
            type="text"
            name="alumnoId"
            id="alumnoId"
            value={formData.alumnoId}
            onChange={handleChange}
            className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 rounded-lg p-2.5 w-full"
          >
            <option value="">Seleccionar alumno</option>
            {alumnos.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pb-2">
          <label className="block mb-2 text-sm principal">Curso realizado</label>
          <select
            type="text"
            name="cursoId"
            id="cursoId"
            value={formData.cursoId}
            onChange={handleChange}
            className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 rounded-lg p-2.5 w-full"
          >
            <option value="">Seleccionar Curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full btnAz focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
        >
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
            'Cargar certificado'
          )}
        </button>
      </form>
    </div>
  );
};

export default Certificado;
