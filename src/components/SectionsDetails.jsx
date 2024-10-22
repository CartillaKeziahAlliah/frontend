import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import CreateExam from "./exam/createExam";

// const apiUrl = "https://backend-production-55e3.up.railway.app";
const apiUrl = "http://localhost:5000";

const SectionDetail = () => {
  const { sectionName } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { user } = useAuth();
  const [section, setSection] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/subject/section/${sectionName}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [sectionName]);

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;
    const subject = subjects.find((sub) => sub._id === subjectId);
    setSelectedSubject(subject);
  };
  useEffect(() => {
    // Function to fetch section by ID
    const fetchSectionById = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/section/currentsection/${sectionName}`
        );
        setSection(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server Error");
        setLoading(false);
      }
    };

    fetchSectionById();
  }, [sectionName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="course-Sectiondetail-container p-4">
      <h1 className="text-3xl font-bold mb-4">Section Details</h1>
      {section.section_name}
      {user && (
        <div className="user-info mb-4">
          <p>Welcome, {user.name}!</p>
        </div>
      )}

      <div className="subject-dropdown mb-4">
        <label htmlFor="subjects" className="block mb-2">
          Select a Subject:
        </label>
        <select
          id="subjects"
          onChange={handleSubjectChange}
          className="border rounded p-2"
        >
          <option value="">-- Select a Subject --</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <div className="subject-details mt-4">
          <h2 className="text-xl font-semibold">{selectedSubject.name}</h2>
          <p className="mt-2">Teacher: {selectedSubject.teacher.name}</p>
          <img
            src={selectedSubject.teacher.avatar}
            alt={`${selectedSubject.teacher.name}'s avatar`}
            className="w-12 h-12 rounded-full"
          />
          <button onClick={() => setAction("exam")}>Create Exam</button>
          <button onClick={() => setAction("")}>close</button>
          {action === "exam" && (
            <CreateExam selectedSubject={selectedSubject} />
          )}
        </div>
      )}
    </div>
  );
};

export default SectionDetail;
