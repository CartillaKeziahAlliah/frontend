import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

const AdminRoute = () => {
  const [role, setRole] = useState("student");
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar userRole={role} />
      <div
        style={{
          flex: 1,
          height: "99vh",
          overflowY: "scroll", // allows vertical scrolling
          overflowX: "hidden", // hides horizontal scroll
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminRoute;
