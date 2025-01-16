import clsx from "clsx";

const DifficultyChip = ({
  difficulty,
  successRate,
}: {
  successRate: number | null;
  difficulty?: string;
}) => {
  return (
    <div
      className={clsx(
        difficulty === "unknown" && "bg-[#5F5F5F]",
        difficulty === "expert" && "bg-[#990000]",
        difficulty === "hard" && "bg-[#E0521E]",
        difficulty === "medium" && "bg-[#D1A256]",
        difficulty === "easy" && "bg-[#4BCF77]",
        "text-white text-xs font-semibold rounded-full px-3 py-1 capitalize grow-1 shrink-0"
      )}
    >
      {difficulty}{" "}
      <span className={clsx(difficulty !== "unknown" ? "visible" : "hidden")}>
        ({Number(successRate).toFixed(2)}%)
      </span>
    </div>
  );
};

export default DifficultyChip;
