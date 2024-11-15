import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Close } from "@mui/icons-material";

const apiUrl = "http://localhost:5000";

const Exam = ({ subjectId, user, subject }) => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [takeExam, setTakeExam] = useState(false);
  const [viewScore, setViewScore] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/exam/bysubject/${subjectId}`
        );
        const sortedExams = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setExams(sortedExams);
        console.log("Exams fetched and sorted:", sortedExams);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };
    fetchExams();
  }, [subjectId]);

  const handleTakeExam = (exam) => {
    setCurrentExam(exam);
    setTakeExam(true);
    setAnswers({});
    handleCloseMenu();
    setTimeLeft(exam.duration * 60);
    setTimerActive(true);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/exam/${currentExam._id}/take`,
        {
          studentId: user._id,
          answers:
            Object.values(answers).length > 0 ? Object.values(answers) : null,
        }
      );
      const updatedExams = exams.map((exam) =>
        exam._id === currentExam._id
          ? { ...exam, score: response.data.obtainedMarks }
          : exam
      );
      setExams(updatedExams);
      setCurrentExam(null);
      setViewScore({
        score: response.data.obtainedMarks,
        totalMarks: response.data.totalMarks,
        passed: response.data.passed,
      });
      setResultDialogOpen(true); // Open the result dialog
    } catch (error) {
      console.error("Failed to submit exam:", error);
    }
  };

  const handleOpenMenu = (event, exam) => {
    setAnchorEl(event.currentTarget);
    setSelectedExam(exam);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedExam(null);
  };

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div>
      {currentExam && takeExam ? (
        <div>
          <button onClick={() => setTakeExam(false)}>Back</button>
          <h4>{currentExam.title} Questions</h4>
          <Typography variant="h6">
            Time Left: {formatTime(timeLeft)}
          </Typography>
          {currentExam.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>{question.questionText}</p>
              <FormControl component="fieldset">
                <RadioGroup
                  onChange={(e) =>
                    handleAnswerChange(index, Number(e.target.value))
                  }
                >
                  {question.options.map((option, choiceIndex) => (
                    <FormControlLabel
                      key={choiceIndex}
                      value={choiceIndex}
                      control={<Radio />}
                      label={option.optionText}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          ))}
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#207E68",
              "&:hover": { bgcolor: "#1a5b4f" },
            }}
            onClick={handleSubmit}
          >
            Submit Exam
          </Button>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead bgcolor="#cdcdcd">
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.duration} mins.</TableCell>
                  <TableCell align="right">
                    {exam.scores.some(
                      (score) =>
                        score.studentId._id.toString() === user._id.toString()
                    ) ? (
                      <Typography color="green">Completed</Typography>
                    ) : (
                      <>
                        <IconButton onClick={(e) => handleOpenMenu(e, exam)}>
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(
                            anchorEl && selectedExam?._id === exam._id
                          )}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleTakeExam(exam)}>
                            Take Exam
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Exam Results */}
      <Dialog
        open={resultDialogOpen}
        onClose={() => setResultDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { width: "50%" },
          textAlign: "center",
        }}
      >
        <DialogActions>
          <Button onClick={() => setResultDialogOpen(false)} color="primary">
            <Close sx={{ color: "black" }} />
          </Button>
        </DialogActions>
        <DialogTitle variant="h4" className="text-center text-green-700">
          Successfuly Submitted
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontWeight: "bold" }} className="text-center">
            Your Score:
          </Typography>
          <Typography variant="h3">
            {viewScore?.score}/{viewScore?.totalMarks}
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: viewScore?.passed ? "green" : "red" }}
          >
            {viewScore?.passed ? "PASSED" : "FAILED"}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exam;
