type TagChipProps = {
  label: string;
};

const TagChip = ({ label }: TagChipProps) => {
  return (
    <div className="bg-[--main-color] text-white text-xs font-semibold rounded-full px-3 py-1 capitalize grow-1 shrink-0">
      {label}
    </div>
  );
};

export default TagChip;
