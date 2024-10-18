import React from "react";
import StudentTable from "./StudentTable";
import TeacherTable from "./TeacherTable";
import GradeTable from "./GradeTable";
import SectionTable from "./SectionTable";
import AddTable from "./AddTable";

const TablePages = () => {
  return (
    <div className="p-4  h-screen w-full">
      <div className="flex justify-around items-center">
        {" "}
        <div className="flex-1 overflow-hidden">
          <AddTable />
        </div>
        <div className="flex-1 overflow-hidden">
          <GradeTable />
        </div>
        <div className="flex-1 overflow-hidden">
          <SectionTable />
        </div>
      </div>
      <div className="flex justify-between h-1/2 space-x-4">
        <div className="flex-1 overflow-hidden">
          <StudentTable />
        </div>
        <div className="flex-1 overflow-hidden">
          <TeacherTable />
        </div>
      </div>
    </div>
  );
};
export default TablePages;
