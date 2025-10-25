import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashAdminNav from '../Views/DashAdminNav';
import DashVendedorNav from '../Views/IndexVendedor';

const ProtectedLayout = ({ children }) => {
  const { user, role } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-full">
      {isAdminRoute ? <DashAdminNav /> : <DashVendedorNav />}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;
