export const getTimeString = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format. Set to true for 12-hour format if preferred.
  };
  return date.toLocaleTimeString([], options);
};

export const LastUpdated = ({ time }: { time: Date }) => {
  const timeString = getTimeString(time);

  return <span>Last updated: {timeString}</span>;
};
