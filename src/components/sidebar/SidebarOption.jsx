// SidebarOption.jsx
import React from "react";
import { Link } from "react-router-dom";

const SidebarOption = ({
  title,
  to,
  icon,
  isCollapsed,
  active,
  setIsActive,
}) => (
  <div onClick={() => setIsActive(title)}>
    <Link
      to={to}
      className={`flex bg-[#C2E8F8]  hover:bg-gray-800 flex-row gap-3 items-center ${
        active === title ? "bg-[#000] text-white" : " text-black"
      } p-3 rounded-md`}
    >
      {icon}
      {!isCollapsed && <p className="capitalize">{title}</p>}
    </Link>
  </div>
);

export default SidebarOption;
