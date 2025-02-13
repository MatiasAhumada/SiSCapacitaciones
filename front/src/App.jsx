import Home from "./components/Views/Home";
import Login from "./components/Views/Login";

import { Route, BrowserRouter, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/inicio" element={<Home></Home>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
