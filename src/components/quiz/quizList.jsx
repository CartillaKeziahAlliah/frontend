// QuizList.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://backend-production-55e3.up.railway.app";

const QuizList = ({ selectedSubject }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
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

    if (selectedSubject) {
      fetchQuizzes();
    }
  }, [selectedSubject]);

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

  // Logic for pagination
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
    setUserAnswers({}); // Reset user answers when a new quiz is opened
  };

  const clearSelectedQuiz = () => {
    setSelectedQuiz(null);
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = selectedQuiz.questions.reduce(
      (total, question, index) => {
        const userAnswer = userAnswers[index];
        if (
          userAnswer !== undefined &&
          question.options[userAnswer].isCorrect
        ) {
          return total + 1;
        }
        return total;
      },
      0
    );

    Swal.fire(
      "Quiz Submitted!",
      `You scored ${correctAnswers} out of ${selectedQuiz.questions.length}`,
      "success"
    );
    clearSelectedQuiz(); // Clear quiz after submission
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

      {paginatedQuizzes.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Title
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Duration (min)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Marks
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Deadline
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedQuizzes.map((quiz) => (
                <TableRow key={quiz._id} hover>
                  <TableCell>
                    <Typography variant="body1">{quiz.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{quiz.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{quiz.duration}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{quiz.totalMarks}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {new Date(quiz.deadline).toLocaleDateString()}{" "}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteQuiz(quiz._id)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleQuizClick(quiz)}
                      variant="outlined"
                      color="secondary"
                    >
                      View Quiz
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No quizzes found.</p>
      )}

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredQuizzes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Selected Quiz Details */}
      {selectedQuiz && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Quiz Details</Typography>
          <Typography variant="body1" fontWeight="bold">
            Title:
          </Typography>
          <Typography variant="body2">{selectedQuiz.title}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Description:
          </Typography>
          <Typography variant="body2">{selectedQuiz.description}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Duration:
          </Typography>
          <Typography variant="body2">
            {selectedQuiz.duration} minutes
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Total Marks:
          </Typography>
          <Typography variant="body2">{selectedQuiz.totalMarks}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Deadline:
          </Typography>
          <Typography variant="body2">
            {new Date(selectedQuiz.deadline).toLocaleDateString()}
          </Typography>

          <Typography variant="body1" fontWeight="bold">
            Questions:
          </Typography>
          {selectedQuiz.questions.length > 0 ? (
            <ul>
              {selectedQuiz.questions.map((question, index) => (
                <li key={index}>
                  <Typography variant="body2">
                    {index + 1}. {question.questionText}
                    <br />
                    Options:
                    <ul>
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          <label>
                            <input
                              type="radio"
                              name={`question-${index}`}
                              checked={userAnswers[index] === optIndex}
                              onChange={() =>
                                handleAnswerChange(index, optIndex)
                              }
                            />
                            {option.optionText}{" "}
                            {option.isCorrect ? "(Correct)" : ""}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No questions available.</Typography>
          )}
          <Button
            onClick={handleSubmitQuiz}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Submit Quiz
          </Button>
          <Button
            onClick={clearSelectedQuiz}
            variant="outlined"
            sx={{ marginTop: 2, marginLeft: 1 }}
          >
            Close
          </Button>
        </Box>
      )}
    </div>
  );
};

export default QuizList;
