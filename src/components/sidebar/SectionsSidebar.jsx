import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = "https://server-production-dd7a.up.railway.app";

const SectionsSidebar = ({
  teacherId,
  active,
  setIsActive,
  handleSectionSelect,
  setOpen,
}) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/section/${teacherId}`);
        setSections(response.data);
      } catch (err) {
        setError();
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [teacherId]);

  return (
    <div className="right-sidebar transition-all duration-300 ease-in-out bg-white shadow-2xl border-r border-t border-b border-r-black border-t-black border-b-black w-1/8 h-[95vh] flex flex-col p-4 rounded-tr-lg rounded-br-lg">
      <p className="text-2xl font-bold mb-4">SECTIONS:</p>
      {sections.length === 0 ? (
        <p className="text-lg text-gray-500">No sections available</p>
      ) : (
        <div>
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => handleSectionSelect(section)}
              className={`p-2 hover:bg-gray-300 rounded flex items-center gap-2 ${
                active === section ? "bg-[#4a8e8b]" : ""
              }`}
            >
              <p
                className={`${
                  active === section ? "text-white" : "text-black"
                }`}
              >
                {section.section_name} | {section.grade_level}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionsSidebar;
