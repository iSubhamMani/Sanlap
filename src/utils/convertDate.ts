import { formatDistanceToNow, format } from "date-fns";
import { enUS } from "date-fns/locale";

function convertToReadableDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    // less than 1 minute
    return "just now";
  } else if (diff < 3600000) {
    // less than 1 hour
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
  } else if (diff < 86400000) {
    // less than 1 day
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
  } else if (diff < 172800000) {
    // less than 2 days
    return "yesterday";
  } else {
    return format(date, "MMMM d, yyyy", { locale: enUS });
  }
}

export default convertToReadableDate;
