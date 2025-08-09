import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashAdminNav from '../components/admin/DashAdminNav/DashAdminNav';
import IndexVendedor from '../components/vendedor/ventas/IndexVendedor';

const ProtectedLayout = () => {
  const { user, role } = useAuth();
  return (
    <div className="min-h-full">
      {role === 'admin' ? <DashAdminNav /> : <IndexVendedor />}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
