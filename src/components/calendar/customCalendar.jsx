import React from "react";
import { useTheme } from "@mui/material";

const Calendar = ({ selectedDate, events, onDateClick }) => {
  const theme = useTheme();

  const renderDaysOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-4 bg-transparent py-2 border-b-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-white font-bold text-customGreen"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i
      );
      const eventCount = events.filter(
        (event) => event.event_date === dayDate.toISOString().split("T")[0]
      ).length;

      const isSelected = dayDate.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={i}
          className={`flex flex-col items-center justify-center p-3 text-white rounded-full cursor-pointer transition-colors duration-300 ${
            isSelected
              ? "bg-blue-500 text-white"
              : eventCount
              ? "bg-transparent"
              : "bg-transparent"
          }`}
          onClick={() => onDateClick(dayDate)}
        >
          <div className="text-lg">{i}</div>
          {eventCount > 0 && (
            <div className="flex justify-center">
              {Array.from({ length: Math.min(eventCount, 3) }, (_, idx) => (
                <span
                  key={idx}
                  className="w-2 h-2 bg-customGreen rounded-full mx-1"
                ></span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2 p-2">{days}</div>;
  };

  const monthName = selectedDate.toLocaleString("default", { month: "long" });
  const year = selectedDate.getFullYear();

  return (
    <div className="w-full h-full">
      <h2 className="text-3xl text-center text-white font-bold mb-4">
        {monthName} {year}
      </h2>
      {renderDaysOfWeek()}
      {renderCalendar()}
    </div>
  );
};

export default Calendar;
