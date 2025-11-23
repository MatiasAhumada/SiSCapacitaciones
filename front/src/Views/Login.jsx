import { useNavigate } from 'react-router-dom';
import imagen from '../assets/simplificado_a_color.png';
import { login as AuthLogin } from '../services/Auth.service';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner/Spinner';
import { clientErrorHandler, clientSuccessHandler } from '../utils/notificationHandler';
import { SUCCESS_MESSAGES } from '../constants/messages';

const Login = () => {
  const { login } = useAuth();
  const [pause, setPause] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPause(true);
    try {
      const data = await AuthLogin(formData);
      login(data);
      localStorage.setItem('token', data.id);
      clientSuccessHandler(SUCCESS_MESSAGES.LOGIN_EXITOSO);
      setPause(false);
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/vendedor');
      }
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
      setPause(false);
      return;
    }
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

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={formData.password}
              id="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPwd((s) => !s)}
              className="mt-4 absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 "
              tabIndex={0}
            >
              {showPwd ? (
                <EyeSlashIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 btnAz text-white font-semibold rounded  transition duration-200 "
          >
            {pause ? <Spinner color="white" /> : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
