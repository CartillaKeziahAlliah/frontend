import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Quiz from "./Quiz";
import Exam from "./Exam";
import Discussion from "./Discussion";
import Assignment from "./Assignment";
import axios from "axios";
const apiUrl = "http://localhost:5000"; // Your API URL
// const apiUrl = "https://server-production-dd7a.up.railway.app";
const CourseDetail = () => {
  const { subjectId } = useParams();
  const [section, setSection] = useState("Exams");
  const { user } = useAuth();
  const [subjectData, setSubjectData] = useState([]);
  useEffect(() => {
    // Fetch subject data by subjectId
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/subject/subjects/${subjectId}`
        );

        setSubjectData(response.data);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchSubjectData();
  }, [subjectId]);
  return (
    <div className="course-detail-container p-4">
      <h1 className="text-3xl font-bold mb-4">{subjectData.subject_name}</h1>

      {user && (
        <div className="user-info mb-4">
          <p>Welcome, {user.name}!</p>
        </div>
      )}

      <div className="section-buttons w-full mb-4 flex gap-2">
        <Button
          variant={section === "Exams" ? "contained" : "outlined"}
          onClick={() => setSection("Exams")}
          sx={{
            bgcolor: section === "Exams" ? "#2c6975" : "transparent",
            borderColor: section === "Exams" ? "#2c6975" : "#4a8e8b",
            color: section === "Exams" ? "#fff" : "#2c6975",
            "&:hover": {
              bgcolor: section === "Exams" ? "#1a5b4f" : "#f0f0f0",
              borderColor: section === "Exams" ? "#1a5b4f" : "#4a8e8b",
            },
          }}
        >
          Exams
        </Button>
        <Button
          variant={section === "Discussions" ? "contained" : "outlined"}
          onClick={() => setSection("Discussions")}
          sx={{
            bgcolor: section === "Discussions" ? "#2c6975" : "transparent",
            borderColor: section === "Discussions" ? "#2c6975" : "#4a8e8b",
            color: section === "Discussions" ? "#fff" : "#2c6975",
            "&:hover": {
              bgcolor: section === "Discussions" ? "#1a5b4f" : "#f0f0f0",
              borderColor: section === "Discussions" ? "#1a5b4f" : "#4a8e8b",
            },
          }}
        >
          Discussions
        </Button>
        <Button
          variant={section === "Assignments" ? "contained" : "outlined"}
          onClick={() => setSection("Assignments")}
          sx={{
            bgcolor: section === "Assignments" ? "#2c6975" : "transparent",
            borderColor: section === "Assignments" ? "#2c6975" : "#4a8e8b",
            color: section === "Assignments" ? "#fff" : "#2c6975",
            "&:hover": {
              bgcolor: section === "Assignments" ? "#1a5b4f" : "#f0f0f0",
              borderColor: section === "Assignments" ? "#1a5b4f" : "#4a8e8b",
            },
          }}
        >
          Assignments
        </Button>
        <Button
          variant={section === "Quizzes" ? "contained" : "outlined"}
          onClick={() => setSection("Quizzes")}
          sx={{
            bgcolor: section === "Quizzes" ? "#2c6975" : "transparent",
            borderColor: section === "Quizzes" ? "#2c6975" : "#4a8e8b",
            color: section === "Quizzes" ? "#fff" : "#2c6975",
            "&:hover": {
              bgcolor: section === "Quizzes" ? "#1a5b4f" : "#f0f0f0",
              borderColor: section === "Quizzes" ? "#1a5b4f" : "#4a8e8b",
            },
          }}
        >
          Quizzes
        </Button>
      </div>

      <div className="section-content">
        {section === "Exams" && (
          <Exam subjectId={subjectId} user={user} subject={subjectData} />
        )}
        {section === "Discussions" && (
          <Discussion subjectId={subjectId} userId={user._id} />
        )}
        {section === "Assignments" && (
          <Assignment subjectId={subjectId} userId={user._id} />
        )}
        {section === "Quizzes" && (
          <Quiz subjectId={subjectId} userId={user._id} />
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
