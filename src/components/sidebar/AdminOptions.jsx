// AdminOptions.jsx
import React from "react";
import SidebarOption from "./SidebarOption";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  AdminPanelSettingsOutlined,
  ManageAccountsOutlined,
} from "@mui/icons-material";

const AdminOptions = ({ isCollapsed, active, setIsActive }) => (
  <>
    <SidebarOption
      title="admin"
      to="/Admin"
      icon={<AdminPanelSettingsOutlined />}
      isCollapsed={isCollapsed}
      active={active}
      setIsActive={setIsActive}
    />
    <SidebarOption
      title="manage"
      to="/Manage"
      icon={<ManageAccountsOutlined />}
      isCollapsed={isCollapsed}
      active={active}
      setIsActive={setIsActive}
    />
  </>
);

export default AdminOptions;
