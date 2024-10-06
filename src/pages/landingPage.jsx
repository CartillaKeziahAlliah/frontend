import React from "react";
import { Link } from "react-router-dom";
import Background from "../assets/building_0.png";

const landingPage = () => {
  const logo =
    "https://static.wixstatic.com/media/a7269e_9526c565a65f452ab7ab04f1fb03b196~mv2.png/v1/fit/w_2500,h_1330,al_c/a7269e_9526c565a65f452ab7ab04f1fb03b196~mv2.png";

  return (
    <div>
      <div className="flex  p-2 text-white font-bold w-full bg-[#207E68] flex-row items-center justify-between">
        <div className="flex gap-2 flex-row">
          <img src={logo} alt="School Logo" className="w-20" />

          <div className="flex flex-col justify-center">
            <h2>Talamban National High School</h2>{" "}
            <h2>Spirituality - Responsibility - Integrity</h2>
          </div>
        </div>
        <Link to="/Login">LOGIN</Link>
      </div>
      <div className= "h-screen bg-cover bg-center" style= {{ backgroundImage: `url(${Background})`}}>
      </div>
    </div>
  );
};

export default landingPage;
