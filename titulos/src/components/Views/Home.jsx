import React, { useEffect, useState } from "react";
import { getAluID } from "../queries/queries";

const Home = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const id = localStorage.getItem("user");
    getAluID(id).then((data) => {
        setUser(data);
    });
  }, []);
console.log(user)
  const handleClick = (e) => {
    e.preventDefault();
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col rounded-2xl w-[450px] bg-[#ffffff] shadow-xl">
        <div className="flex flex-col p-8">
          <div className="text-2xl font-bold   text-[#374151] pb-6 text-center">Hola {user.name}!</div>
          <div className=" text-lg   text-[#374151]">Curso realizado: </div>
          <div className=" text-lg   text-[#374151]">Area: </div>
          <div className=" text-lg   text-[#374151]"> {user.sucursal.name} </div>
          <div className="flex justify-end pt-6">
            <button onClick={handleClick} className="btnAz w-full font-bold text-base  p-3 rounded  ">
              Diploma!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
