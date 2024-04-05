import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { TextField } from "@mui/material";

const handleKeyDown = (e) => {
  e.preventDefault();
};

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
  disableTyping,
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
        textField: {
          size: "small",
          error: false,
          onKeyDown: disableTyping ? handleKeyDown : null,
        },
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
