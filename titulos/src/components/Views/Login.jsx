import { Link, useNavigate } from "react-router-dom";
import imagen from "../assets/simplificado_a_color.png";
import { login } from "../queries/queries";
import { useState } from "react";
import Swal from "sweetalert2";
const Login = () => {
  const [formData, setFormData] = useState({ numero: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-3">
          <div>
            <img src={imagen} alt="logo" className="size-8 me-3" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
              Buscar mi Certificado
            </h2>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="string"
              id="numero"
              name="numero"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu Numero de certificado"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 btnAz text-white font-semibold rounded  transition duration-200 "
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
