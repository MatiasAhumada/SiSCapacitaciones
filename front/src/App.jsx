import IndexAdm from './components/admin/IndexAdm';
import CrearProfes from './components/profesor/CrearProfes';
import DashProfe from './components/profesor/DashProfe';
import AggVend from './components/vendedor/AggVend';
import DashVendedor from './components/vendedor/DashVendedor';
import InfoVendedor from './components/vendedor/InfoVendedor';
import InfoIndexVend from './components/vendedor/ventas/InfoIndexVend';
import Error404 from './Views/Error404';
import Home from './Views/Home';
import Login from './Views/Login';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Inscribir from './components/vendedor/ventas/inscripcion/Inscribir';
import DashAlumnos from './components/admin/alumnos/DashAlumnos';
import DashCursos from './components/admin/cursos/DashCursos';
import CreateCurso from './components/admin/cursos/CreateCurso';
import DashComisiones from './components/admin/comisiones/DashComisiones';
import CreateComision from './components/admin/comisiones/CreateComision';
import DashCaja from './components/caja/DashCaja';
import CreateCaja from './components/caja/CreateCaja';
import Certificado from './components/admin/certificados/Certificados';
import DashCajas from './components/admin/cajas/DashCajas';
import ListadoComisiones from './components/admin/comisiones/ListadoComisiones';
import DashComVend from './components/vendedor/comisiones/DashComVend';
import CreateComVend from './components/vendedor/comisiones/CreateComVend';
import DashAlumno from './components/vendedor/comisiones/DashAlumno';
import CreateAlumnoNuevo from './components/alumno/CreateAlumnoNuevo';
import CajaEgreso from './components/caja/CajaEgreso';
import CajaTransferencia from './components/caja/CajaTransferencia';
import ProtectedLayout from './layouts/ProtectedLayout';
import RequireAuth from './context/RequireAuth';
import { AuthProvider } from './context/AuthContext';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<Home />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <ProtectedLayout />
              </RequireAuth>
            }
          >
            <Route path="adm/:id">
              <Route index element={<IndexAdm />} />
              <Route path="cobrar" element={<CreateCaja />} />
              <Route path="egreso" element={<CajaEgreso />} />
              <Route path="vendedores" element={<DashVendedor />}>
                <Route path="crear" element={<AggVend />} />
                <Route path="info" element={<InfoVendedor />} />
              </Route>
              <Route path="profesores" element={<DashProfe />}>
                <Route path="crear" element={<CrearProfes />} />
              </Route>
              <Route path="alumno/:idAlu" element={<DashAlumno />} />
              <Route path="alumnos" element={<DashAlumnos />}>
                <Route path="crear" element={<CreateAlumnoNuevo />} />
              </Route>
              <Route path="cursos" element={<DashCursos />}>
                <Route path="crear" element={<CreateCurso />} />
              </Route>
              <Route path="comisiones" element={<DashComisiones />}>
                <Route path="crear" element={<CreateComision />} />
                <Route path=":comId" element={<ListadoComisiones />} />
              </Route>
              <Route path="cajas" element={<DashCajas />} />
              <Route path="certificados" element={<Certificado />} />
            </Route>
            <Route path=":idVend">
              <Route index element={<InfoIndexVend />} />
              <Route path="alumno/:idAluCom" element={<DashAlumno />} />
              <Route path="inscribir" element={<Inscribir />} />
              <Route path="caja" element={<DashCaja />} />
              <Route path="cobrar" element={<CreateCaja />} />
              <Route path="egreso" element={<CajaEgreso />} />
              <Route path="transferencia" element={<CajaTransferencia />} />
              <Route path="cursos" element={<DashCursos />} />
              <Route path="comisiones" element={<DashComVend />}>
                <Route path="crear" element={<CreateComVend />} />
              </Route>
              <Route path="comisiones/:comId" element={<ListadoComisiones />} />
              <Route path="alumnos" element={<CreateAlumnoNuevo />} />
            </Route>
            <Route path="/error" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
