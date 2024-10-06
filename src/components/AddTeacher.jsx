import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

export default function MultilineTextFields() {
  const [subject, setSubject] = React.useState('');
  const [section, setSection] = React.useState('');
  const [gradeLevel, setGradeLevel] = React.useState('');
  const [teacherName, setTeacherName] = React.useState('');
  const [TRN, setTRN] = React.useState('');

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSection(event.target.value);
  };

  const handleGradeLevelChange = (event) => {
    setGradeLevel(event.target.value);
  };

  const handleTeacherNameChange = (event) => {
    setTeacherName(event.target.value);
  };

  const handleTRNChange = (event) => {
    setTRN(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('Submitted:', { teacherName, TRN, section, subject, gradeLevel });
    setTeacherName('');
    setTRN('');
    setSection('');
    setSubject('');
    setGradeLevel('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '20ch' }, 
        '& .MuiFormControl-root': { m: 1, width: '20ch' }, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100%',
      }}
      noValidate
      autoComplete="off"
    >
      {/* Flex container for Teacher Name and TRN */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <TextField
          id="outlined-teacher-name"
          label="Teacher Name"
          value={teacherName}
          onChange={handleTeacherNameChange}
          multiline
          maxRows={4}
          variant="outlined"
        />
        <TextField
          id="outlined-trn"
          label="TRN"
          value={TRN}
          onChange={handleTRNChange}
          multiline
          maxRows={4}
          variant="outlined"
        />
      </Box>

      {/* Flex container for Section, Subject, and Grade Level */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <FormControl variant="filled">
          <InputLabel id="section-label">Section</InputLabel>
          <Select
            labelId="section-label"
            id="section-select"
            value={section}
            onChange={handleSectionChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Section A">Section A</MenuItem>
            <MenuItem value="Section B">Section B</MenuItem>
            <MenuItem value="Section C">Section C</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="filled">
          <InputLabel id="subject-label">Subject</InputLabel>
          <Select
            labelId="subject-label"
            id="subject-select"
            value={subject}
            onChange={handleSubjectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="filled">
          <InputLabel id="grade-level-label">Grade Level</InputLabel>
          <Select
            labelId="grade-level-label"
            id="grade-level-select"
            value={gradeLevel}
            onChange={handleGradeLevelChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Grade 1">Grade 1</MenuItem>
            <MenuItem value="Grade 2">Grade 2</MenuItem>
            <MenuItem value="Grade 3">Grade 3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Submit Button */}
      <Button 
        variant="contained" 
        type="submit" 
        sx={{ mt: 2 }} 
        color="primary"
        size="small"
      >
        Add Teacher
      </Button>
    </Box>
  );
}
