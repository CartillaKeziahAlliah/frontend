import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DescriptionOutlined,
  DragIndicator,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import QuizView from "./QuizView";
import QuizScoresView from "./QuizScoresView";

// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";

const QuizList = ({ selectedSubject, setAction }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [showScores, setShowScores] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [viewlist, setViewlist] = useState(true);

  const checkQuizAttempt = async (userId, quizId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/quiz/check-quiz-attempt/${userId}/${quizId}`
      );
      return response.data.hasTakenQuiz;
    } catch (error) {
      console.error("Error checking quiz attempt:", error);
      return false;
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/quiz/bysubject/${selectedSubject._id}`
      );
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };
  useEffect(() => {
    fetchQuizzes();
    if (user) {
      fetchQuizAttempts();
    }
  }, [selectedSubject]);

  const fetchQuizAttempts = async () => {
    for (const quiz of quizzes) {
      const hasTaken = await checkQuizAttempt(user.id, quiz._id);
      quiz.hasTaken = hasTaken;
    }
    setQuizzes([...quizzes]);
  };
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedQuizzes = [...quizzes];

    if (option === "alphabetical") {
      sortedQuizzes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "date") {
      sortedQuizzes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setQuizzes(sortedQuizzes);
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm) ||
      quiz.description.toLowerCase().includes(searchTerm)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedQuizzes = filteredQuizzes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const deleteQuiz = async (quizId) => {
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
        await axios.delete(`${apiUrl}/api/quiz/${quizId}`);
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz._id !== quizId)
        );
        Swal.fire(
          "Deleted Successfully!",
          "This won't be retrieved again!",
          "success"
        );
      } catch (error) {
        console.error("Failed to delete quiz:", error);
      }
    }
  };

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowScores(false);
    setAnchorEl(null);
    setViewlist(false);
  };
  const handleViewScores = (quizId) => {
    console.log("Selected Quiz ID:", quizId);
    setSelectedQuizId(quizId);
    setShowScores(true);
    setSelectedQuiz(null);
    setViewlist(false);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, quizId) => {
    setAnchorEl(event.currentTarget);
    setActiveQuizId(quizId);
  };
  const handleShowScoreClose = () => {
    setShowScores(false);
    setSelectedQuizId(null);
    setViewlist(true);
  };
  const handleCloseSelectedQuiz = () => {
    setSelectedQuiz(null);
    setViewlist(true);
    setSelectedQuiz(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveQuizId(null);
  };

  return (
    <div className="quiz-list">
      <Box display="flex" flexDirection="row" gap={1} sx={{ marginTop: 2 }}>
        <div className="border border-gray-500 px-2 rounded-3xl mb-4 w-full flex flex-row items-center">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full p-2 outline-none rounded-3xl"
          />
        </div>
        <button
          onClick={setAction}
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

      {viewlist && (
        <>
          {paginatedQuizzes.length > 0 ? (
            paginatedQuizzes.map((quiz) => (
              <Paper
                key={quiz._id}
                elevation={3}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
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
                    <Typography variant="h6">{quiz.title}</Typography>
                  </div>
                </Box>
                <Box>
                  <IconButton onClick={(e) => handleMenuOpen(e, quiz._id)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && activeQuizId === quiz._id}
                    onClose={handleMenuClose}
                  >
                    {user.role === "teacher" && (
                      <MenuItem onClick={() => deleteQuiz(quiz._id)}>
                        Delete
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleQuizClick(quiz)}>
                      {user.role === "student" ? "Take Quiz" : "View Quiz"}
                    </MenuItem>
                    <MenuItem onClick={() => handleViewScores(quiz)}>
                      View Scores
                    </MenuItem>
                  </Menu>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No quizzes found.
            </Typography>
          )}
        </>
      )}
      <TablePagination
        component="div"
        count={filteredQuizzes.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {selectedQuiz && (
        <QuizView quiz={selectedQuiz} onClose={handleCloseSelectedQuiz} />
      )}
      {showScores && (
        <QuizScoresView quiz={selectedQuizId} onClose={handleShowScoreClose} />
      )}
    </div>
  );
};

export default QuizList;
