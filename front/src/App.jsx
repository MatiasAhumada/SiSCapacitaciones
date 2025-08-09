import IndexAdm from './components/admin/IndexAdm';
import CrearProfes from './components/profesor/CrearProfes';
import DashProfe from './components/profesor/DashProfe';
import AggVend from './components/vendedor/AggVend';
import DashVendedor from './components/vendedor/DashVendedor';
import InfoVendedor from './components/vendedor/InfoVendedor';
import InfoIndexVend from './components/vendedor/ventas/InfoIndexVend';
import IndexVendedor from './components/vendedor/ventas/IndexVendedor';
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
import CreateAlumnoViejo from './components/alumno/CreateAlumnoViejo';
import CajaEgreso from './components/caja/CajaEgreso';
import CajaTransferencia from './components/caja/CajaTransferencia';
import ProtectedLayout from './layouts/ProtectedLayout';
import RequireAuth from './context/RequireAuth';
import DashAdminNav from './components/admin/DashAdminNav/DashAdminNav';
import { AuthProvider } from './context/AuthContext';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/inicio" element={<Home></Home>}></Route>
          <Route
            path="/"
            element={
              <RequireAuth>
                <ProtectedLayout />
              </RequireAuth>
            }
          >
            <Route path="adm/:id" element={<IndexAdm></IndexAdm>}>
              <Route path="cobrar" element={<CreateCaja></CreateCaja>}></Route>
              <Route path="egreso" element={<CajaEgreso></CajaEgreso>}></Route>
              <Route path="vendedores" element={<DashVendedor></DashVendedor>}>
                <Route path="crear" element={<AggVend></AggVend>}></Route>
                <Route path="info" element={<InfoVendedor></InfoVendedor>}></Route>
              </Route>
              <Route path="profesores" element={<DashProfe></DashProfe>}>
                <Route path="crear" element={<CrearProfes></CrearProfes>}></Route>
              </Route>
              <Route path="alumno/:idAlu" element={<DashAlumno></DashAlumno>}></Route>
              <Route path="alumnos" element={<DashAlumnos></DashAlumnos>}>
                <Route path="crear" element={<CreateAlumnoNuevo></CreateAlumnoNuevo>}></Route>
              </Route>
              <Route path="cursos" element={<DashCursos></DashCursos>}>
                <Route path="crear" element={<CreateCurso></CreateCurso>}></Route>
              </Route>
              <Route path="comisiones" element={<DashComisiones></DashComisiones>}>
                <Route path="crear" element={<CreateComision></CreateComision>}></Route>
                <Route path=":comId" element={<ListadoComisiones></ListadoComisiones>}></Route>
              </Route>
              <Route path="cajas" element={<DashCajas></DashCajas>}></Route>
              <Route path="certificados" element={<Certificado></Certificado>}></Route>
            </Route>
            <Route path="/:idVend" element={<IndexVendedor></IndexVendedor>}>
              <Route index element={<InfoIndexVend></InfoIndexVend>}></Route>
              <Route path="alumno/:idAluCom" element={<DashAlumno></DashAlumno>}></Route>
              <Route path="inscribir" element={<Inscribir></Inscribir>}></Route>

              <Route path="caja" element={<DashCaja></DashCaja>}></Route>
              <Route path="cobrar" element={<CreateCaja></CreateCaja>}></Route>
              <Route path="egreso" element={<CajaEgreso></CajaEgreso>}></Route>
              <Route path="transferencia" element={<CajaTransferencia></CajaTransferencia>}></Route>
              <Route path="cursos" element={<DashCursos></DashCursos>}></Route>
              <Route path="comisiones" element={<DashComVend></DashComVend>}>
                <Route path="crear" element={<CreateComVend></CreateComVend>}></Route>
              </Route>
              <Route
                path="comisiones/:comId"
                element={<ListadoComisiones></ListadoComisiones>}
              ></Route>
              <Route path="alumnos" element={<CreateAlumnoNuevo></CreateAlumnoNuevo>}></Route>
            </Route>
            <Route path="/error" element={<Error404></Error404>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
