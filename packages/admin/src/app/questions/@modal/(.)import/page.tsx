"use client";
import FileInput from "@/app/components/FileInput";
import { Modal } from "@/app/components/modal";
import HBIconButton from "@/app/components/ui/hbIconButton";
import { Controller, useForm } from "react-hook-form";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import HBButton from "@/app/components/ui/hbButton";

const ImportQuestionsPage = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      file: [],
    },
  });

  const onSubmit = async (data: unknown) => {
    console.log("SUBMIT", data);
  };

  return (
    <Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
      >
        <div className="h-[80px] px-2.5 py-5 w-full justify-between items-center inline-flex">
          <span className="text-[24px] font-bold">
            Importer une liste de questions
          </span>
          <HBIconButton icon={<XMarkIcon />} onClick={() => router.back()} />
        </div>
        <div className="grow px-2.5 py-5 w-full flex-col justify-start items-start gap-5 inline-flex">
          <Controller
            control={control}
            name="file"
            render={({ field: { onChange, value, name, ref } }) => (
              <FileInput
                name={name}
                onChange={onChange}
                value={value}
                ref={ref}
              />
            )}
          />
        </div>
        <div className="h-[76px] px-2.5 py-5 w-full justify-end items-center gap-2.5 inline-flex">
          <HBButton
            type="reset"
            label="Annuler"
            color="primary"
            variant="text"
            size="medium"
            onClick={() => router.back()}
          />
          <HBButton label="Importer" type="submit" size="medium" />
        </div>
      </form>
    </Modal>
  );
};

export default ImportQuestionsPage;
