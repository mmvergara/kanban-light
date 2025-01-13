import { useEffect, useState } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between w-full text-sm my-2 text-zinc-200">
      {currentTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })}

      <span>
        {" "}
        {currentTime.toLocaleDateString("en-US", {
          weekday: "short",
          month: "long",
          day: "numeric",
        })}
      </span>
    </div>
  );
};

export default Clock;
