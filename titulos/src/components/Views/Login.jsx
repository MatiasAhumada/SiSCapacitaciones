import { useNavigate } from "react-router-dom";
import imagen from "../assets/logo.png";
import { useState } from "react";
import Swal from "sweetalert2";
import { getCertId } from "../queries/queries";
const Login = () => {
  const [numberCert, setNumberCert] = useState("");
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNumberCert(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);
    try {
      const data = await getCertId(numberCert);
      if (data && data.link) {
        redirectToLink(data.link);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Certificado no encontrado",
        text: "Verifica el número ingresado",
      });
      setPause(false);
    }
  };
  const redirectToLink = (link) => {
    if (link) {
      Swal.fire({
        icon: "success",
        title: "Certificado encontrado",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => window.open(link, `_blank`));
      setPause(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center  mb-3">
          <div className="text-center">
            <img src={imagen} alt="logo" className="w-1/2  inline-block" />
          </div>
          <div>
            <h2 className="fs-4 font-bold text-center text-gray-700 mb-6">Buscador de certificado avalado</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="string"
              id="numero"
              name="numero"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu Número de certificado"
              onChange={handleChange}
            />
          </div>

          {/* <button
            type="submit"
            className="w-full py-3 btnAz text-white font-semibold rounded  transition duration-200 "
          >
            Buscar
          </button> */}
          <button type="submit" className="w-full py-3 btnAz text-white font-semibold rounded  transition duration-200 ">
            {pause ? (
              <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
            ) : (
              "Buscar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
