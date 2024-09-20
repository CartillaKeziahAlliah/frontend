import React from "react";
import Button from "../../components/button";

const Sample = () => {
  const handleClick = () => {
    alert("imo ko giclick");
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      {/* kani nga button gikan sa components */}
      <Button label="Sample ni nga button" onClick={handleClick} />
    </div>
  );
};

export default Sample;
