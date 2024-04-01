// import React, { useEffect, useRef, useState } from "react";
// import Pikaday from "pikaday";
// import { InputAddons } from "../inputAddons/InputAddons";
// import { FeatherIcon } from "../../featherIcon/FeatherIcon";

// const DateInput = ({ selectedDate, onDateChange = () => {} }) => {
//   const datePickerRef = useRef();
//   const [selectedDateState, setSelectedDateState] = useState(selectedDate);

//   useEffect(() => {
//     // Initialize Pikaday when the component mounts
//     const picker = new Pikaday({
//       field: datePickerRef.current,
//       onSelect: (date) => {
//         setSelectedDateState(date);
//         //props on change
//         onDateChange(date);
//       },
//       // Additional Pikaday options go here
//     });

//     // Clean up Pikaday when the component unmounts
//     return () => {
//       picker.destroy();
//     };
//   }, []);

//   const valueString = selectedDateState
//     ? selectedDateState.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       })
//     : "";

//   return (
//     <InputAddons
//       left={<FeatherIcon name="Calendar" />}
//       inputRef={datePickerRef}
//       placeholder="Select a date"
//       value={valueString}
//       readOnly
//     />
//   );
// };

// export default DateInput;

import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
const DateInput = ({
  selectedDate,
  onDateChange,
  style,
  format = "DD/MM/YYYY",
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  className,
}) => {
  return (
    <DatePicker
      className={className}
      minDate={minDate}
      maxDate={maxDate}
      disableFuture={disableFuture}
      disablePast={disablePast}
      format={format}
      sx={{ ...style }}
      value={selectedDate}
      onChange={onDateChange}
      showDaysOutsideCurrentMonth
      slotProps={{
        textField: { size: "small", error: false },
        inputAdornment: { position: "start" },
        popper: {
          sx: {
            "& .Mui-selected": { backgroundColor: "#00a353 !important" },
            "& .MuiDateCalendar-root": { width: "250px", height: "300px" },
          },
        },
      }}
      components={{
        OpenPickerIcon: CalendarMonthIcon,
      }}
    />
  );
};

export default DateInput;
