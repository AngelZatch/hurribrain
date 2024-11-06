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
        !successRate && "bg-[#5F5F5F]",
        successRate! > 50 && "bg-[#4BCF77]",
        successRate! > 20 && "bg-[#D1A256]",
        successRate! > 1 && "bg-[#E0521E]",
        successRate! <= 1 && "bg-[#990000]",
        "text-white text-xs font-semibold rounded-full px-3 py-1 capitalize grow-1 shrink-0"
      )}
    >
      {difficulty}{" "}
      <span className={clsx(successRate && "visible", "hidden")}>
        ({successRate}%)
      </span>
    </div>
  );
};

export default DifficultyChip;
