export function formatHumanDate(dateStr: string): string {
  const date = new Date(dateStr);

  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.toLocaleDateString("en-US",{year:"2-digit"})
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${daySuffix} ${month} ${year}, ${weekday} at ${time}`;
}
