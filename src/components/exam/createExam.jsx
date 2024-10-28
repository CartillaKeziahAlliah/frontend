import React, { useState, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Modal,
  Checkbox,
} from "@mui/material";

// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";

const CreateExam = ({ selectedSubject, onclick }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [{ optionText: "", isCorrect: false }],
      marks: 1,
    },
  ]);
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passMarks, setPassMarks] = useState("");
  const [questionErrors, setQuestionErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const errorRefs = useRef([]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "questionText") {
      updatedQuestions[index].questionText = value;
    } else if (field === "marks") {
      updatedQuestions[index].marks = Number(value); // Ensure marks are stored as a number
    }
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [{ optionText: "", isCorrect: false }],
        marks: 1,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      optionText: "",
      isCorrect: false,
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "optionText") {
      updatedQuestions[questionIndex].options[optionIndex].optionText = value;
    } else if (field === "isCorrect") {
      // Ensure only one correct option is selected
      updatedQuestions[questionIndex].options = updatedQuestions[
        questionIndex
      ].options.map((option, i) => ({
        ...option,
        isCorrect: i === optionIndex ? value : false, // Set current option as correct and others as false
      }));
    }
    setQuestions(updatedQuestions);
  };

  const scrollToFirstError = () => {
    const firstErrorIndex = Object.keys(questionErrors)[0];
    if (errorRefs.current[firstErrorIndex]) {
      errorRefs.current[firstErrorIndex].scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuestionErrors({});
    setSuccessMessage("");

    const newQuestionErrors = {};

    questions.forEach((question, index) => {
      if (!question.questionText) {
        newQuestionErrors[index] = "Question text is required.";
      } else if (question.options.length < 2) {
        newQuestionErrors[index] =
          "Each question must have at least two options.";
      } else if (!question.options.some((option) => option.isCorrect)) {
        newQuestionErrors[index] =
          "Exactly one option must be marked as correct.";
      }
    });

    if (Object.keys(newQuestionErrors).length > 0) {
      setQuestionErrors(newQuestionErrors);
      scrollToFirstError();
      return;
    }

    // Prepare the exam data
    const examData = {
      title,
      description,
      subject: selectedSubject._id,
      questions,
      duration: Number(duration), // Convert duration to number
      totalMarks: Number(totalMarks), // Convert total marks to number
      passMarks: Number(passMarks), // Convert pass marks to number
    };

    try {
      const response = await axios.post(`${apiUrl}/api/exam`, examData);
      setSuccessMessage(response.data.message);
      // Clear form fields after successful submission
      setTitle("");
      setDescription("");
      setQuestions([
        {
          questionText: "",
          options: [{ optionText: "", isCorrect: false }],
          marks: 1,
        },
      ]);
      setDuration("");
      setTotalMarks("");
      setPassMarks("");
    } catch (error) {
      setQuestionErrors({
        general: error.response?.data?.message || "Failed to create exam",
      });
    }
  };

  const handlePreviewToggle = () => {
    setPreviewVisible(!previewVisible);
  };

  const renderPreview = () => {
    return (
      <Box sx={{ p: 2, backgroundColor: "#f0f0f0", borderRadius: 2 }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Questions
        </Typography>
        {questions.map((question, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="subtitle1">{`${index + 1}. ${
              question.questionText
            } (Marks: ${question.marks})`}</Typography>
            <RadioGroup>
              {question.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  control={<Radio />}
                  label={option.optionText}
                />
              ))}
            </RadioGroup>
          </Box>
        ))}
        <Typography variant="body2">
          Duration: {duration} minutes | Total Marks: {totalMarks} | Pass Marks:{" "}
          {passMarks}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
      <Button onClick={onclick}>Close</Button>
      <Card>
        <CardHeader title={`Create Exam for ${selectedSubject.subject_name}`} />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                sx={{ mb: 1 }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Box>

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Questions
            </Typography>
            {questions.map((question, questionIndex) => (
              <Box
                key={questionIndex}
                mb={3}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  padding: 2,
                  backgroundColor: questionErrors[questionIndex]
                    ? "#f8d7da"
                    : "inherit",
                }}
                ref={(el) => (errorRefs.current[questionIndex] = el)}
              >
                <TextField
                  label="Question"
                  variant="outlined"
                  fullWidth
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(
                      questionIndex,
                      "questionText",
                      e.target.value
                    )
                  }
                  required
                  sx={{ mb: 2 }}
                  error={Boolean(questionErrors[questionIndex])}
                  helperText={questionErrors[questionIndex]}
                />
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" gutterBottom>
                      Options
                    </Typography>
                    {question.options.map((option, optionIndex) => (
                      <Grid
                        container
                        spacing={1}
                        key={optionIndex}
                        sx={{ mb: 1 }}
                      >
                        <Grid item xs={12}>
                          <TextField
                            label="Option"
                            variant="outlined"
                            fullWidth
                            value={option.optionText}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                "optionText",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={option.isCorrect}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    "isCorrect",
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Correct Answer"
                          />
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              handleRemoveOption(questionIndex, optionIndex)
                            }
                          >
                            Remove Option
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAddOption(questionIndex)}
                    >
                      Add Option
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  label="Marks"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={question.marks}
                  onChange={(e) =>
                    handleQuestionChange(questionIndex, "marks", e.target.value)
                  }
                  required
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                  sx={{ mt: 2 }}
                >
                  Remove Question
                </Button>
              </Box>
            ))}

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
              sx={{ mt: 2 }}
            >
              Add Question
            </Button>

            <Box sx={{ mt: 3 }}>
              <TextField
                label="Duration (minutes)"
                variant="outlined"
                type="number"
                fullWidth
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
              <TextField
                label="Total Marks"
                variant="outlined"
                type="number"
                fullWidth
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                required
                sx={{ mt: 1 }}
              />
              <TextField
                label="Pass Marks"
                variant="outlined"
                type="number"
                fullWidth
                value={passMarks}
                onChange={(e) => setPassMarks(e.target.value)}
                required
                sx={{ mt: 1 }}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Create Exam
            </Button>
            <Button
              variant="outlined"
              onClick={handlePreviewToggle}
              sx={{ mt: 2, ml: 2 }}
            >
              {previewVisible ? "Hide Preview" : "Show Preview"}
            </Button>
          </form>

          {previewVisible && (
            <Modal
              open={previewVisible}
              onClose={handlePreviewToggle}
              aria-labelledby="preview-modal-title"
              aria-describedby="preview-modal-description"
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  padding: 4,
                  outline: "none",
                  margin: "auto",
                  width: "90%",
                  maxWidth: 600,
                  borderRadius: 2,
                  boxShadow: 24,
                }}
              >
                {renderPreview()}
                <Button
                  variant="contained"
                  onClick={handlePreviewToggle}
                  sx={{ mt: 2 }}
                >
                  Close Preview
                </Button>
              </Box>
            </Modal>
          )}
          {successMessage && (
            <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {questionErrors.general && (
            <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
              {questionErrors.general}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateExam;
