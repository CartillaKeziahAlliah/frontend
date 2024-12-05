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

    {courses.length === 0 ? (
      <p className="text-gray-500 text-center">No courses available</p>
    ) : (
      courses.map((course) => (
        <div
          key={course.subjectId} // Use a unique identifier for the key
          onClick={() => handleCourseSelect(course.subjectId)} // Pass the subjectId for selection
          className={`p-2 hover:bg-gray-300 rounded-full flex items-center gap-2 ${
            active === course.subjectId ? "bg-[#207E68]" : ""
          }`}
        >
          <p
            className={`${
              active === course.subjectId ? "text-white" : "text-black"
            }`}
          >
            {course.subjectName}{" "}
            {/* Display the subjectName instead of the whole course object */}
          </p>
        </div>
      ))
    )}
  </div>
);

export default CoursesSidebar;
