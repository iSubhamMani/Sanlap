import moment from "moment";

export function convertToReadableDate(dateString: string): string {
  const now = moment();
  const messageDate = moment(dateString);
  const diffInMinutes = now.diff(messageDate, "minutes");

  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    // 1440 minutes in a day
    return messageDate.format("hh:mm a");
  } else if (diffInMinutes < 2880) {
    // 2880 minutes in 2 days
    return "yesterday";
  } else {
    return messageDate.format("DD/MM/YY");
  }
}
