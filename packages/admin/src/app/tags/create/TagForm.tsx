"use client";
import HBButton from "@/app/components/ui/hbButton";
import HBIconButton from "@/app/components/ui/hbIconButton";
import HBInput from "@/app/components/ui/hbInput";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { createTag, updateTag } from "../actions";
import { Tag } from "@/app/types/tag";

type TagFormProps = {
  tag?: Tag;
};

const TagForm = ({ tag }: TagFormProps) => {
  console.log(tag);
  const router = useRouter();
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tag) {
      await updateTag(new FormData(e.target as HTMLFormElement), tag.uuid!);
    } else {
      await createTag(new FormData(e.target as HTMLFormElement));
    }

    router.back();
  };

  return (
    <form
      onSubmit={submitForm}
      className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
    >
      <div className="h-[80px] px-2.5 py-5 w-full justify-between items-center inline-flex">
        <span className="text-[24px] font-bold">
          {tag ? "Modifier un Thème" : "Créer un Thème"}
        </span>
        <HBIconButton icon={<XMarkIcon />} onClick={() => router.back()} />
      </div>
      <div className="grow px-2.5 py-5 w-full flex-col justify-start items-start gap-5 inline-flex">
        <label className="w-full flex flex-col text-[16px] font-semibold">
          Intitulé
          <HBInput
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={tag?.name}
          />
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
        <HBButton
          label={tag ? "Sauvegarder" : "Créer"}
          type="submit"
          size="medium"
        />
      </div>
    </form>
  );
};

export default TagForm;
