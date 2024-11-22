import React from "react";

const CustomCard = ({ title, img, onClick }) => {
  return (
    <div
      className="custom-card max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg  rounded-lg  text-center cursor-pointer mx-auto "
      onClick={onClick}
    >
      {/* Title Section */}
      <div className="flex justify-center rounded-t-lg items-center bg-[#207E68] p-4 h-[20%]">
        <h3 className="uppercase text-center text-base  md:text-lg font-semibold text-white">
          {title}
        </h3>
      </div>

      {/* Image Section */}
      <div className="h-[70%]">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover rounded-b-lg"
        />
      </div>
    </div>
  );
};

export default CustomCard;
