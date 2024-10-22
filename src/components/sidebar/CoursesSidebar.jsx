import React from "react";

const CoursesSidebar = ({
  courses,
  active,
  setIsActive,
  handleCourseSelect,
  setOpen,
}) => (
  <div className="right-sidebar transition-all duration-300 ease-in-out bg-white shadow-2xl border-r border-t border-b border-r-black border-t-black border-b-black w-1/8 h-[95vh] flex flex-col p-4 rounded-tr-lg rounded-br-lg">
    <p className="text-2xl font-bold mb-4">COURSES:</p>
    {courses.map((course) => (
      <div
        key={course}
        onClick={() => handleCourseSelect(course)}
        className={`p-2 hover:bg-gray-300 rounded flex items-center gap-2 ${
          active === course ? "bg-[#4a8e8b]" : ""
        }`}
      >
        <p className={`${active === course ? "text-white" : "text-black"}`}>
          {course}
        </p>
      </div>
    ))}
  </div>
);

export default CoursesSidebar;
