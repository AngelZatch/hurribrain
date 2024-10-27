"use client";
import createTag from "@/app/tags/actions";

const NewTag = () => {
  return (
    <div className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex">
      <span className="text-[40px] font-bold">Dialog</span>
      <form
        action={async (formData) => {
          await createTag(formData);
        }}
        method="post"
      >
        <input type="text" name="name" placeholder="Name" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewTag;
