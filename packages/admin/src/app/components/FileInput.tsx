import { ControllerRenderProps } from "react-hook-form";
import { ChangeEvent, DragEvent } from "react";

type FileInputProps = Pick<
  ControllerRenderProps,
  "name" | "onChange" | "value" | "ref"
>;

const FileInput = ({ name, onChange, value }: FileInputProps) => {
  console.log(value);
  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.length > 0) {
      onChange(event.dataTransfer.files[0]);
      console.log("FILE DROPPED", event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0) {
      onChange(event.target.files[0]);
      console.log("FILE CHANGED", event.target.files[0]);
    }
  };

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("DRAGGING OVER ELEMENT");
  };

  return (
    <>
      <input
        name={name}
        type="file"
        multiple={false}
        onChange={handleChange}
        className="hidden"
      />
      <div
        onDragStart={onDragOver}
        onDragLeave={onDragOver}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="w-full h-[350px] p-[10px] rounded-[20px] border border-[--main-color] border-dotted bg-[--input-background] text-[--text-color] placeholder-[--placeholder-color] justify-center items-center gap-2.5 inline-flex"
      >
        <p>Drop here</p>
      </div>
    </>
  );
};

export default FileInput;
