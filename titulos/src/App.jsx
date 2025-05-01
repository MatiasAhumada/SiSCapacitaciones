import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Views/Login";
import Home from "./components/Views/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        {/* <Route path="/home" element={<Home/>}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
