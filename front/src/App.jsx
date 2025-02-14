import DashAdmin from "./components/admin/DashAdmin";
import IndexAdm from "./components/admin/IndexAdm";
import DashVendedor from "./components/vendedor/DashVendedor";
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
          <Route path="vendedores" element={<DashVendedor></DashVendedor>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
