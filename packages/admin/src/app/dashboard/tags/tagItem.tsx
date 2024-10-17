interface TagProps {
  label: string;
}

const TagItem = ({ label }: TagProps) => {
  return (
    <div className="h-[100px] self-stretch p-2.5 bg-white/20 rounded-[10px] justify-start items-center gap-[15px] inline-flex">
      <div className="self-stretch flex-col justify-center items-start gap-2.5 inline-flex">
        <span>{label}</span>
      </div>
    </div>
  );
};

export default TagItem;
