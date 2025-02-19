import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Container } from "react-bootstrap";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import imagen from "../assets/simplificado_a_color.png";
const Login = () => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/inicioVendedor");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-3">
          <div>
            <img src={imagen} alt="logo" className="size-8 me-3" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Iniciar sesión</h2>
          </div>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu correo"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button type="submit" onClick={handleClick} className="w-full py-3 btnAz text-white font-semibold rounded  transition duration-200 ">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
