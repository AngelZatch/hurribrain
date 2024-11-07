const TagChip = ({ label }: { label: string }) => {
  return (
    <div className="bg-[--main-color] text-[--black] text-xs font-semibold rounded-full px-3 py-1 capitalize grow-1 shrink-0">
      {label}
    </div>
  );
};

export default TagChip;
