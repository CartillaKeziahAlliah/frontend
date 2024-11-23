import React, { useState, useEffect } from "react";
import CustomCard from "../../components/CustomCard";
import instructor from "../../assets/instructors.png";
import Admin from "../../assets/admin.png";
import Subject from "../../assets/subjects.png";
import Section from "../../assets/sections.png";
import Students from "../../assets/students.png";
import Request from "../../assets/request.png";
import Instructors from "./ManageComponents/instructors";
import AdminTable from "./ManageComponents/Administrator";
import SubjectsTable from "./ManageComponents/Subjects";
import Sections from "./ManageComponents/sections";
import Student from "./ManageComponents/student";

const MainPage = () => {
  const [activeView, setActiveView] = useState(() => {
    // Retrieve the saved active view from localStorage or default to "dashboard"
    return localStorage.getItem("activeView") || "dashboard";
  });

  // Save the active view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleBackToDashboard = () => {
    setActiveView("dashboard");
    localStorage.removeItem("activeView"); // Explicitly clear saved state
  };

  return (
    <div className="flex justify-center min-h-screen py-4">
      {activeView === "dashboard" && (
        <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <CustomCard
            title="Instructors"
            img={instructor}
            onClick={() => handleViewChange("instructor")}
          />
          <CustomCard
            title="Administrators"
            img={Admin}
            onClick={() => handleViewChange("admin")}
          />
          <CustomCard
            title="Subjects"
            img={Subject}
            onClick={() => handleViewChange("subject")}
          />
          <CustomCard
            title="Sections"
            img={Section}
            onClick={() => handleViewChange("section")}
          />
          <CustomCard
            title="Students"
            img={Students}
            onClick={() => handleViewChange("student")}
          />
          <CustomCard
            title="Requests"
            img={Request}
            onClick={() => handleViewChange("request")}
          />
        </div>
      )}
      {activeView === "instructor" && (
        <>
          <Instructors handleBackToDashboard={handleBackToDashboard} />
        </>
      )}
      {activeView === "admin" && (
        <>
          <AdminTable handleBackToDashboard={handleBackToDashboard} />
        </>
      )}
      {activeView === "subject" && (
        <>
          <SubjectsTable handleBackToDashboard={handleBackToDashboard} />
        </>
      )}
      {activeView === "section" && (
        <>
          <Sections handleBackToDashboard={handleBackToDashboard} />
        </>
      )}
      {activeView === "student" && (
        <>
          <Student handleBackToDashboard={handleBackToDashboard} />
        </>
      )}
      {activeView === "request" && (
        <>
          <div>Requests</div>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default MainPage;
