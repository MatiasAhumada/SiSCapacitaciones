import { Link, useNavigate } from "react-router-dom";
import imagen from "../assets/simplificado_a_color.png";
import { login } from "../queris/queris";
import { useState } from "react";
import Swal from "sweetalert2";
const Login = () => {
  const [pause, setPause] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);
    await login(formData).then((data) => {
      if (data) {
        localStorage.setItem("token", data.id);
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setPause(false);
          if (data.isAdmin) {
            navigate("/inicio");
          } else {
            navigate("/inicioVendedor");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuario o contraseña incorrectos",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => setPause(false));
      }
    });
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="string"
              id="name"
              name="name"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu correo"
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full py-3 btnAz text-white font-semibold rounded  transition duration-200 ">
            {pause ? (
              <svg fill="white" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
