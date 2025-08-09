import { Outlet } from 'react-router-dom';
import DashAdminNav from '../components/admin/DashAdminNav/DashAdminNav';

const DashAdminLayout = () => {
  return (
    <div className="min-h-full">
      <DashAdminNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashAdminLayout;
