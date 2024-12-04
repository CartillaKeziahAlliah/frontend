import React, { useState } from "react";
import { Link } from "react-router-dom";
import Background from "../assets/building_0.png";
import ContactUs from "./ContactUs";
import FAQ from "./Faqs";

const landingPage = () => {
  const [view, setView] = useState(false);
  const logo =
    "https://static.wixstatic.com/media/a7269e_9526c565a65f452ab7ab04f1fb03b196~mv2.png/v1/fit/w_2500,h_1330,al_c/a7269e_9526c565a65f452ab7ab04f1fb03b196~mv2.png";

  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="flex  p-2 text-white font-bold w-full bg-[#207E68] flex-row items-center justify-between">
        <div className="flex gap-2 flex-row">
          <img src={logo} alt="School Logo" className="w-20" />

          <div className="flex flex-col justify-center">
            <h2>Talamban National High School</h2>{" "}
            <h2>Spirituality - Responsibility - Integrity</h2>
          </div>
        </div>
        <div className="flex flex-row gap-4 px-10">
          <button className="hover:border-b" onClick={() => setView("contact")}>
            CONTACT US
          </button>
          <button className="hover:border-b" onClick={() => setView("faqs")}>
            FAQs
          </button>
          <Link to="/Auth">LOGIN</Link>
        </div>
      </div>
      {view === "contact" && <ContactUs />}
      {view === "faqs" && <FAQ />}

      <div></div>
    </div>
  );
};

export default landingPage;
