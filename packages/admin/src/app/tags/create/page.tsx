"use client";
import createTag from "@/app/tags/actions";
import HBButton from "@/app/ui/components/hbButton";

const CreateTagForm = () => {
  return (
    <form
      action={createTag}
      className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
    >
      <div className="h-20 px-2.5 py-5 w-full justify-between items-center inline-flex">
        <span className="text-[40px] font-bold">Créer un Thème</span>
      </div>
      <div className="px-2.5 py-5 w-full flex-col justify-start items-start gap-5 inline-flex">
        <input type="text" name="name" placeholder="Name" />
      </div>
      <div className="h-[76px] px-2.5 py-5 w-full justify-end items-center gap-2.5 inline-flex">
        <HBButton
          type="reset"
          label="Annuler"
          color="secondary"
          variant="text"
          size="medium"
        />
        <HBButton label="Créer" type="submit" size="medium" />
      </div>
    </form>
  );
};

export default CreateTagForm;
