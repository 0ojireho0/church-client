import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to UTC (you can change it to any IANA timezone string)
dayjs.tz.setDefault('UTC');

export default dayjs;