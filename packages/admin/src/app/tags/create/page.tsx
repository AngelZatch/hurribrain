"use client";
import createTag from "@/app/tags/actions";
import HBButton from "@/app/components/ui/hbButton";
import { useRouter } from "next/navigation";
import HBIconButton from "@/app/components/ui/hbIconButton";
import { XMarkIcon } from "@heroicons/react/16/solid";
import HBInput from "@/app/components/ui/hbInput";

const CreateTagForm = () => {
  const router = useRouter();

  return (
    <form
      action={createTag}
      className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
    >
      <div className="h-[80px] px-2.5 py-5 w-full justify-between items-center inline-flex">
        <span className="text-[24px] font-bold">Créer un Thème</span>
        <HBIconButton icon={<XMarkIcon />} onClick={() => router.back()} />
      </div>
      <div className="grow px-2.5 py-5 w-full flex-col justify-start items-start gap-5 inline-flex">
        <label className="w-full flex flex-col text-[16px] font-semibold">
          Intitulé
          <HBInput type="text" name="name" placeholder="Name" />
        </label>
      </div>
      <div className="h-[76px] px-2.5 py-5 w-full justify-end items-center gap-2.5 inline-flex">
        <HBButton
          type="reset"
          label="Annuler"
          color="secondary"
          variant="text"
          size="medium"
          onClick={() => router.back()}
        />
        <HBButton label="Créer" type="submit" size="medium" />
      </div>
    </form>
  );
};

export default CreateTagForm;
