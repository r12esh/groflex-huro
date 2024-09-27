const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function abbreviationDateFormat(date) {
  //accepts a date object only
  if (!date) return;

  const newDateObj = new Date(date);
  return newDateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// Example usage
// const myDate = new Date('2023-02-09');
// const formattedDate = formatDateDMYShortMonthWithoutComma(myDate);
// console.log(formattedDate); // Output: 09 Feb 2023

export function formatDateforUi(date, format = "dd-mm-yyyy") {
  const dateObject = new Date(date);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = String(dateObject.getFullYear());

  return format.replace("dd", day).replace("mm", month).replace("yyyy", year);
}

export function getTimeStamp(date) {
  const currentDate = new Date(date);

  // Get hours and minutes
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Format the time
  const formattedTime = `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return formattedTime;
}
