import DashAdmin from "./components/admin/DashAdmin";
import IndexAdm from "./components/admin/IndexAdm";
import CrearProfes from "./components/profesor/CrearProfes";
import DashProfe from "./components/profesor/DashProfe";
import AggVend from "./components/vendedor/AggVend";
import DashVendedor from "./components/vendedor/DashVendedor";
import InfoVendedor from "./components/vendedor/InfoVendedor";
import InfoIndexVend from "./components/vendedor/ventas/InfoIndexVend";
import IndexVendedor from "./components/vendedor/ventas/IndexVendedor";
import Error404 from "./components/Views/Error404";
import Home from "./components/Views/Home";
import Login from "./components/Views/Login";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Inscripcion from "./components/vendedor/ventas/Inscripcion";

import DashAlumnos from "./components/admin/alumnos/DashAlumnos";
import CreateAlumno from "./components/admin/alumnos/CreateAlumno";
import DashCursos from "./components/admin/cursos/DashCursos";
import CreateCurso from "./components/admin/cursos/CreateCurso";
import DashComisiones from "./components/admin/comisiones/DashComisiones";
import CreateComision from "./components/admin/comisiones/CreateComision";
import DashCaja from "./components/caja/DashCaja";
import CreateCaja from "./components/caja/CreateCaja";
import Certificado from "./components/admin/certificados/Certificados";
import DashCajas from "./components/admin/cajas/DashCajas";
import ListadoComisiones from "./components/admin/comisiones/ListadoComisiones";
import DashComVend from "./components/vendedor/comisiones/DashComVend";
import CreateComVend from "./components/vendedor/comisiones/CreateComVend";
import DashAlumno from "./components/vendedor/comisiones/DashAlumno";
import ReciboComprobante from "./components/caja/Comprobante";
import Alumno from "./components/vendedor/ventas/inscripcion/Alumno";
import CreateAlumnoNuevo from "./components/alumno/CreateAlumnoNuevo";
import CreateAlumnoViejo from "./components/alumno/CreateAlumnoViejo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/inicio" element={<Home></Home>}></Route>
        <Route path="/adm/:id" element={<DashAdmin></DashAdmin>}>
          <Route index element={<IndexAdm></IndexAdm>} />
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
          <Route path="inscribir" element={<Inscripcion></Inscripcion>}></Route>
          <Route path="caja" element={<DashCaja></DashCaja>}></Route>
          <Route path="cobrar" element={<CreateCaja></CreateCaja>}></Route>
          <Route path="cursos" element={<DashCursos></DashCursos>}></Route>
          <Route path="comisiones" element={<DashComVend></DashComVend>}>
            <Route path="crear" element={<CreateComVend></CreateComVend>}></Route>
          </Route>
          <Route path="comisiones/:comId" element={<ListadoComisiones></ListadoComisiones>}></Route>
          <Route path="alu.nuevo" element={<CreateAlumnoNuevo></CreateAlumnoNuevo>}></Route>
          <Route path="alu.viejo" element={<CreateAlumnoViejo></CreateAlumnoViejo>}></Route>
        </Route>
        <Route path="/error" element={<Error404></Error404>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
