import React from "react";

const Home = () => {
    const handleClick = (e) => {
        e.preventDefault( )
   
    }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col rounded-2xl w-[450px] bg-[#ffffff] shadow-xl">
        <div className="flex flex-col p-8">
          <div className="text-2xl font-bold   text-[#374151] pb-6 text-center">Hola {"nombre desde el back"}!</div>
          <div className=" text-lg   text-[#374151]">Curso realizado: </div>
          <div className=" text-lg   text-[#374151]">Area:  </div>
          <div className="flex justify-end pt-6">
            <button onClick={handleClick} className="btnAz w-full font-bold text-base  p-3 rounded  ">Diploma!</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
