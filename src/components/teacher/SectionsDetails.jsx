import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import CreateExam from "./exam/createExam";
import {
  Box,
  Paper,
  Button,
  Typography,
  TablePagination,
  Grid,
  Menu,
  IconButton,
  MenuItem,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  ChevronLeft,
  Delete,
  DescriptionOutlined,
  DragIndicator,
  Edit,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import CreateAssignment from "./assignment/CreateAssignment";
import AssignmentList from "./assignment/AssignmentList";
import CreateQuiz from "./quiz/createQuiz";
import QuizList from "./quiz/quizList";
import CreateDiscussion from "./discussion/CreateDiscussion";
import DiscussionList from "./discussion/DiscussionList";
import StudentsComponent from "../studentList/studentlist";
import ExamScoresView from "./exam/ExamScoresView";
import AddIcon from "@mui/icons-material/Add";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://server-production-dd7a.up.railway.app";

const SectionDetail = () => {
  const { sectionName } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { user } = useAuth();
  const [section, setSection] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [viewlist, setViewlist] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeExamId, setActiveExamId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    duration: 0,
    totalMarks: 0,
    passMarks: 0,
  });

  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sortOption, setSortOption] = useState(""); // State for sort option

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default number of rows per page
  const handleMenuOpen = (event, examId) => {
    setAnchorEl(event.currentTarget);
    setActiveExamId(examId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveExamId(null);
  };
  const handleViewScores = (examId) => {
    console.log("Selected Quiz ID:", examId);
    setSelectedExamId(examId);
    setShowScores(true);
    setSelectedExam(null);
    setViewlist(false);
  };

  const handleShowScoreClose = () => {
    setShowScores(false);
    setSelectedExamId(null); // Set assignment ID to null
    setViewlist(true); // Toggle view list back to true
    setAnchorEl(null);
  };
  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setEditData({
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passMarks: exam.passMarks,
    });
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/subject/${user._id}`);
        setSubjects(response.data);
      } catch (error) {
        setError();
      }
    };

    fetchSubjects();
  }, [sectionName]);

  useEffect(() => {
    if (!selectedSubject) return;

    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/exam/bysubject/${selectedSubject._id}`
        );
        setExams(response.data);
      } catch (error) {
        console.log("Error fetching exams:", error);
        setError("Failed to load exams.");
      }
    };

    fetchExams();
  }, [selectedSubject]);

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;
    const subject = subjects.find((sub) => sub._id === subjectId);
    setSelectedSubject(subject);
  };
  const handleViewChange = (event) => {
    setView(event.target.value); // Capture the selected value from the event
  };
  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/exam/${selectedExam._id}`,
        editData
      );
      setSelectedExam(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update the exam.");
    }
  };
  const deleteExam = async (examId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/api/exam/${examId}`);
        setExams((prevExams) =>
          prevExams.filter((exam) => exam._id !== examId)
        );
        setSelectedExam(null);
        Swal.fire({
          title: "Deleted Succesfully!",
          text: "This won't be retrieved again!",
          icon: "success",
        });
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete exam");
      }
    }
  };
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedExams = [...exams];

    if (option === "alphabetical") {
      sortedExams.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "date") {
      sortedExams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setExams(sortedExams);
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm) ||
      exam.description.toLowerCase().includes(searchTerm)
  );

  // Logic for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Get the exams to display based on pagination
  const paginatedExams = filteredExams.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const closeExam = () => {
    setSelectedExam(null);
    setAnchorEl(null);
  };
  return (
    <div className="course-Sectiondetail-container h-full p-4">
      <Box display="flex">
        {selectedSubject && (
          <div className="w-[40%] subject-dropdown mb-4">
            <select
              id="subjects"
              onChange={handleSubjectChange}
              value={selectedSubject?._id || ""}
              className="border rounded-3xl mr-2 py-2 px-4 bg-white shadow-lg border-black"
            >
              <option value="">Select a Subject</option>
              {subjects.length === 0 ? (
                <Skeleton></Skeleton>
              ) : (
                <>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <select
              id="view"
              onChange={handleViewChange}
              disabled={!selectedSubject}
              className="border rounded-3xl py-2 px-4 bg-white shadow-lg border-black"
            >
              <option value="">Select View</option>
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="discussion">Discussion</option>
              <option value="students">Students</option>
              {/* You can add more options here if needed */}
            </select>
          </div>
        )}
        {!selectedSubject && (
          <Typography
            variant="h2"
            className="w-[100%]"
            textAlign="center"
            fontStyle="bold"
          >
            {section?.section_name}
          </Typography>
        )}
        {selectedSubject && (
          <Typography variant="h2" className="w-[40%]" fontStyle="bold">
            {selectedSubject.subject_name}
          </Typography>
        )}
      </Box>
      {!selectedSubject && (
        <div className="h-[80%]">
          <Grid container spacing={2} padding={2}>
            {subjects.map((subject) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={subject._id}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => handleSubjectClick(subject)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e0e0e0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                  }}
                >
                  <Typography variant="h6">{subject.subject_name}</Typography>
                  <Typography variant="p">
                    {subject.start_time} - {subject.end_time}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      {selectedSubject && view === "exam" && (
        <div className="subject-details mt-4">
          {action === "exam" && (
            <CreateExam
              selectedSubject={selectedSubject}
              onclick={() => setAction("")}
            />
          )}
          {selectedExam ? (
            <div className="exam-details p-4 border">
              <div className="flex justify-between">
                <button
                  onClick={closeExam}
                  className="text-sm mb-2 text-blue-500 underline"
                >
                  <Tooltip title="Back to Exam List" arrow>
                    <ChevronLeft sx={{ color: "black" }} />
                  </Tooltip>
                </button>
                {!isEditing && (
                  <Tooltip title="Edit Exam" sx={{ cursor: "pointer" }}>
                    <Edit
                      sx={{ color: "#207E68" }}
                      onClick={() => setIsEditing(true)}
                    />
                  </Tooltip>
                )}
              </div>
              {!isEditing ? (
                <>
                  <h2 className="text-3xl font-bold mb-4 bg-[#cdcdcd] capitalize p-2">
                    {selectedExam.title}
                  </h2>
                  <p className="mb-4 capitalize">{selectedExam.description}</p>

                  <p>Duration: {selectedExam.duration} minutes</p>
                  <p>Total Marks: {selectedExam.totalMarks}</p>
                  <p>Passing Marks: {selectedExam.passMarks}</p>
                </>
              ) : (
                <div className="edit-exam-form">
                  <h3 className="text-xl font-bold">Edit Exam</h3>
                  <label>
                    Title:
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                    />
                  </label>
                  <label>
                    Description:
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                    />
                  </label>
                  <label>
                    Duration (in minutes):
                    <input
                      type="number"
                      name="duration"
                      value={editData.duration}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                    />
                  </label>
                  <label>
                    Total Marks:
                    <input
                      type="number"
                      name="totalMarks"
                      value={editData.totalMarks}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                    />
                  </label>
                  <label>
                    Pass Marks:
                    <input
                      type="number"
                      name="passMarks"
                      value={editData.passMarks}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                    />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveChanges}
                      className="mt-4 bg-[#207E68] rounded-md text-white px-4 py-2"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="mt-4 bg-gray-500 rounded-md text-white px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {viewlist && action !== "exam" && (
                <>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={1}
                    sx={{ justifyContent: "flex-between", marginTop: 2 }}
                  >
                    <div className="border border-gray-500 px-2 rounded-3xl mb-4 w-full flex flex-row items-center">
                      <SearchOutlined />
                      <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="w-full p-2 outline-none rounded-3xl"
                      />
                    </div>
                    <button
                      onClick={() => setAction("exam")}
                      className="flex justify-center items-center mb-4 rounded-full hover:bg-gray-300 px-2"
                    >
                      <AddIcon />
                    </button>
                    <select
                      value={sortOption}
                      onChange={handleSortChange}
                      className="border border-gray-500 p-2 rounded-3xl mb-4"
                    >
                      <option value="">Sort by</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="date">Date</option>
                    </select>
                  </Box>

                  {paginatedExams.length > 0 ? (
                    paginatedExams.map((exam) => (
                      <Paper
                        key={exam._id}
                        elevation={3}
                        sx={{
                          marginBottom: 2,
                          padding: 2,
                          border: "1px solid #ccc",
                          borderRadius: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          className="capitalize"
                          gap={1}
                        >
                          <DragIndicator />
                          <DescriptionOutlined
                            sx={{ color: "rgba(67, 141, 97, 0.8)" }}
                          />
                          <div className="flex justify-center">
                            <Typography variant="h6">{exam.title}</Typography>
                          </div>
                        </Box>
                        <Box>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, exam._id)}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) && activeExamId === exam._id
                            }
                            onClose={handleMenuClose}
                          >
                            {user.role !== "student" && (
                              <MenuItem
                                onClick={() => deleteExam(exam._id)}
                                sx={{ color: "red" }}
                              >
                                <Delete />
                              </MenuItem>
                            )}
                            {user.role !== "student" && (
                              <MenuItem onClick={() => handleExamClick(exam)}>
                                View Exam
                              </MenuItem>
                            )}
                            {user.role !== "student" && (
                              <MenuItem onClick={() => handleViewScores(exam)}>
                                View Scores
                              </MenuItem>
                            )}
                          </Menu>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <p>No exams found.</p>
                  )}

                  {/* Pagination Component */}
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredExams.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
      {selectedSubject && view === "assignment" && (
        <>
          {action === "assignment" && (
            <CreateAssignment
              selectedSubject={selectedSubject}
              onclick={() => {
                setAction("");
              }}
            />
          )}
          {action !== "assignment" && (
            <>
              <AssignmentList
                selectedSubject={selectedSubject}
                setAction={() => setAction("assignment")}
              />
            </>
          )}
        </>
      )}
      {selectedSubject && view === "quiz" && (
        <>
          {action === "quiz" && (
            <CreateQuiz
              selectedSubject={selectedSubject}
              onclick={() => setAction("")}
            />
          )}
          {action !== "quiz" && (
            <>
              <QuizList
                selectedSubject={selectedSubject}
                setAction={() => setAction("quiz")}
              />
            </>
          )}
        </>
      )}
      {view === "students" && <StudentsComponent sectionName={sectionName} />}
      {selectedSubject && view === "discussion" && (
        <>
          {action === "discussion" && (
            <CreateDiscussion
              selectedSubject={selectedSubject}
              onclick={() => setAction("")}
            />
          )}
          {action !== "discussion" && (
            <>
              <DiscussionList
                selectedSubject={selectedSubject}
                setAction={() => setAction("discussion")}
              />
            </>
          )}
        </>
      )}
      {selectedSubject && view === "" && (
        <div className="w-full p-6">
          <div className="max-w-xl mx-auto overflow-hidden">
            {" "}
            {/* Container with max width and center alignment */}
            <img
              src="https://scontent.fceb5-1.fna.fbcdn.net/v/t39.30808-6/275669416_104255052225224_6139433786003376488_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=qVe-kB3A6iYQ7kNvgGfNGZM&_nc_zt=23&_nc_ht=scontent.fceb5-1.fna&_nc_gid=AGNjjZb2S4JLA6UIt-mUjva&oh=00_AYAFSJROgNtdYb0grSav-Mfc5MvrkcRPft7mzkXh2ue1RA&oe=67252AB0" // Replace with your image URL
              alt="Description of the image"
              className="w-full h-auto border-[green] border-2"
            />
          </div>
        </div>
      )}
      {showScores && (
        <ExamScoresView exam={selectedExamId} onClose={handleShowScoreClose} />
      )}
    </div>
  );
};

export default SectionDetail;
