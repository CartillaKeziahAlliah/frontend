import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

const AdminRoute = () => {
  const [role, setRole]= useState("student")
  return (
    <div style={{ display: "flex" }}>
      <Sidebar userRole={role}/>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminRoute;
