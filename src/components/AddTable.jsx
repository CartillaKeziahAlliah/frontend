import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddGrade from "./AddGrade";
import AddSection from "./AddSection";
import AddStudent from "./AddStudent";
import AddTeacher from "./AddTeacher";

export default function AddTable() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 1, sm: 2 }, // Responsive padding
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="add table tabs"
        sx={{
          flexGrow: 1,
          justifyContent: "center", // Center tabs
        }}
      >
        <Tab label="Add Grade" />
        <Tab label="Add Section" />
        <Tab label="Add Student" />
        <Tab label="Add Teacher" />
      </Tabs>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          gap: 2, // Space between components
        }}
      >
        {activeTab === 0 && <AddGrade />}
        {activeTab === 1 && <AddSection />}
        {activeTab === 2 && <AddStudent />}
        {activeTab === 3 && <AddTeacher />}
      </Box>
    </Box>
  );
}
