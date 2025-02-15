import DashAdmin from "./components/admin/DashAdmin";
import IndexAdm from "./components/admin/IndexAdm";
import AggVend from "./components/vendedor/AggVend";
import DashVendedor from "./components/vendedor/DashVendedor";
import InfoVendedor from "./components/vendedor/InfoVendedor";
import Error404 from "./components/Views/Error404";
import Home from "./components/Views/Home";
import Login from "./components/Views/Login";

import { Route, BrowserRouter, Routes } from "react-router-dom";
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
        </Route>
        <Route path="/error" element={<Error404></Error404>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
