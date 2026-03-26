import { useCountdown } from "../../hooks/useCountdown";

const DUE_LABEL = {
  exam:       "Exam Date",
  assignment: "Submission Date",
  general:    "Due Date",
};

function Dot({ critical = false }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-[3px] h-[3px] rounded-full ${critical ? "bg-error-6" : "bg-blue-4"}`} />
      <div className={`w-[3px] h-[3px] rounded-full ${critical ? "bg-error-6" : "bg-blue-4"}`} />
    </div>
  );
}

export default function CountdownBadge({ dueDate, type }) {
  const { days, hrs, min, sec, expired } = useCountdown(dueDate);
  if (expired) return null;
  const critical = days < 3;
  const label = DUE_LABEL[type] || "Due Date";
  const formatted = new Date(dueDate).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
  const pad = (n) => String(n).padStart(2, "0");
  const units = [
    ["days", days],
    ["hrs",  hrs],
    ["min",  min],
    ["sec",  sec],
  ];
  return (
    <div className={`flex flex-wrap items-center gap-4 px-4 md:px-6 py-2.5 rounded-full w-fit max-w-full ${critical ? "bg-error-3" : "bg-blue-1"}`}>
      <div className="flex flex-col gap-0.5">
        <span className={`text-sm font-semibold ${critical ? "text-error-8" : "text-primary-hover"}`}>
          {label}
        </span>
        <span className={`text-xs ${critical ? "text-error-6" : "text-blue-4"}`}>{formatted}</span>
      </div>
      <div className="flex items-center gap-3">
        {units.map(([unit, val], i) => (
          <div key={unit} className="flex items-center gap-3">
            {i > 0 && <Dot critical={critical} />}
            <div className="flex flex-col items-center gap-0.5">
              <span className={`text-base font-bold ${critical ? "text-error-8" : "text-primary-hover"}`}>
                {pad(val)}
              </span>
              <span className={`text-xs ${critical ? "text-error-6" : "text-blue-4"}`}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
