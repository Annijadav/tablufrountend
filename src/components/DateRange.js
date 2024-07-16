import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import React from "react";
import { Calendar, DateRangePicker } from "react-date-range";

export default function DateRange() {
   function  handleSelect(ranges){
    console.log(ranges);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }
  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }
  return (
    <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
  );
}
