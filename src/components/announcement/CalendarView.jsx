// src/components/CalendarView.js

import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = ({ value, setValue }) => {
  return (
    <div>
      <Calendar onChange={setValue} value={value} />
      <p>Selected date: {value.toDateString()}</p>
    </div>
  );
};

export default CalendarView;
