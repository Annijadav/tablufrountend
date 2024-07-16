import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangeComp = ({handleDateSelection}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (dates) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
    if (end) {
      setShowDatePicker(false);
      handleDateSelection(new Date(start).toLocaleDateString(),new Date(end).toLocaleDateString());
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    handleDateSelection()
  };

  return (
    <div className="relative p-2">
      <div className="flex items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <CalendarIcon
            className={`w-5 h-5 mr-2 ${endDate ? "text-blue-500" : "text-gray-400"}`}
            aria-hidden="true"
          />
        </div>
        
      </div>
      {showDatePicker && (
        <div
          className="absolute top-12 -left-20 z-10 bg-white shadow-lg rounded p-2"
          ref={datePickerRef}
        >
            {endDate && (<div>
          <button
            className="p-1 m-1 border rounded text-white text-sm font-bold bg-red-600"
            onClick={handleClear}
          >
            CLEAR
          </button>
          <span className="w-full text-center font-black">{new Date(startDate).toLocaleDateString()+"-"+new Date(endDate).toLocaleDateString()}</span>
          <hr/>
          </div>
        )}
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            inline
            calendarClassName="rounded-lg shadow-lg"
            className="border border-gray-300 p-2"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeComp;
