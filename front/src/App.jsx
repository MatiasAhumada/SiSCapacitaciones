import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import RequireAuth from './context/RequireAuth';
import ProtectedLayout from './layouts/ProtectedLayout';
import { useState, useEffect } from 'react';
import AppLockModal from './components/AppLockModal/AppLockModal';
import { getAppLockStatus } from './services/AppLock.service';

// Views
import Login from './Views/Login';
import Error404 from './Views/Error404';

// Components
import IndexAdm from './components/IndexAdm/IndexAdm';
import DashVendedor from './components/DashVendedor/DashVendedor';
import CreateVendedor from './components/CreateVendedor/CreateVendedor';
import InfoVendedor from './components/InfoVendedor/InfoVendedor';
import DashProfesor from './components/DashProfesor/DashProfesor';
import CreateProfesor from './components/CreateProfesor/CreateProfesor';
import DashAlumnos from './components/DashAlumnos/DashAlumnos';
import CreateAlumno from './components/CreateAlumno/CreateAlumno';
import DashCursos from './components/DashCursos/DashCursos';
import CreateCurso from './components/CreateCurso/CreateCurso';
import DashComisiones from './components/DashComisiones/DashComisiones';
import CreateComision from './components/CreateComision/CreateComision';
import ListadoComisiones from './components/ListadoComisiones/ListadoComisiones';
import DashCaja from './components/DashCaja/DashCaja';
import CreateCaja from './components/CreateCaja/CreateCaja';
import CajaEgreso from './components/CajaEgreso/CajaEgreso';
import CajaTransferencia from './components/CajaTransferencia/CajaTransferencia';


import ListadoCajas from './components/ListadoCajas/ListadoCajas';
import Certificados from './components/Certificados/Certificados';
import Inscribir from './components/Inscribir/Inscribir';
import InfoIndexVend from './components/InfoIndexVend/InfoIndexVend';
import DashAlumno from './components/DashAlumno/DashAlumno';
import DashInscripciones from './components/DashInscripciones/DashInscripciones';
function App() {
  const [appLocked, setAppLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState('');

  useEffect(() => {
    const checkLockStatus = async () => {
      try {
        const data = await getAppLockStatus();
        setAppLocked(data.locked);
        setLockMessage(data.message);
      } catch (error) {
        console.error('Error checking lock status:', error);
      }
    };

    checkLockStatus();
    const interval = setInterval(checkLockStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (appLocked) {
    return <AppLockModal message={lockMessage} />;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <IndexAdm />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/vendedores"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashVendedor />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/vendedores/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateVendedor />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/vendedores/info/:vendedorId"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <InfoVendedor />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/profesores"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashProfesor />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/profesores/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateProfesor />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/alumnos"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashAlumnos />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/alumnos/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateAlumno />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/alumno/:alumnoId"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashAlumno />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cursos"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashCursos />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cursos/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateCurso />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/comisiones"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashComisiones />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/comisiones/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateComision />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/comisiones/:comisionId"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <ListadoComisiones />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cajas"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashCaja />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cobrar"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateCaja />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/egreso"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CajaEgreso />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/transferencia"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CajaTransferencia />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />

            <Route
              path="/admin/certificados"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <Certificados />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/listado-cajas"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <ListadoCajas />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/inscripciones"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashInscripciones />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />

            {/* Vendedor Routes */}
            <Route
              path="/vendedor"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <InfoIndexVend />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/inscripciones"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashInscripciones />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/inscribir"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <Inscribir />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/caja"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashCaja />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/cobrar"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateCaja />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/egreso"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CajaEgreso />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/transferencia"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CajaTransferencia />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />

            <Route
              path="/vendedor/cursos"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashCursos />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/comisiones"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashComisiones />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/comisiones/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateComision />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/comisiones/:comisionId"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <ListadoComisiones />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/alumno/:alumnoId"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <DashAlumno />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/alumnos/crear"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <CreateAlumno />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/vendedor/listado-cajas"
              element={
                <RequireAuth>
                  <ProtectedLayout>
                    <ListadoCajas />
                  </ProtectedLayout>
                </RequireAuth>
              }
            />

            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
