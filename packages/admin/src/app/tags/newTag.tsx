"use client";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import createTag from "./actions";

const NewTag = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onClose={setIsOpen}
      role="dialog"
      className="fixed inset-0 z-50 bg-black/50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex">
        <DialogPanel transition>
          <span className="text-[40px] font-bold">Dialog</span>
          <button onClick={() => setIsOpen(false)}>Close</button>
          <form
            action={async (formData) => {
              await createTag(formData);
              setIsOpen(false);
            }}
            method="post"
          >
            <input type="text" name="name" placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NewTag;
