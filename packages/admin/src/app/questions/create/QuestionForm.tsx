"use client";
import HBButton from "@/app/components/ui/hbButton";
import HBIconButton from "@/app/components/ui/hbIconButton";
import HBInput from "@/app/components/ui/hbInput";
import { Choice } from "@/app/types/choice";
import { Question } from "@/app/types/question";
import { Radio, RadioGroup } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

type QuestionFormProps = {
  question?: Question;
};

const QuestionForm = ({ question }: QuestionFormProps) => {
  const router = useRouter();
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(new FormData(e.target as HTMLFormElement));

    // router.back();
  };

  const choices: Array<Choice> = question?.choices || [
    { uuid: "1", value: "", isCorrect: false },
    { uuid: "2", value: "", isCorrect: false },
    { uuid: "3", value: "", isCorrect: false },
    { uuid: "4", value: "", isCorrect: false },
  ];
  const [selected, setSelected] = useState(choices[0]);

  return (
    <form
      onSubmit={submitForm}
      className="w-[500px] h-[500px] bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
    >
      <div className="h-[80px] px-2.5 py-5 w-full justify-between items-center inline-flex">
        <span className="text-[24px] font-bold">
          {question ? "Modifier une Question" : "Créer une Question"}
        </span>
        <HBIconButton icon={<XMarkIcon />} onClick={() => router.back()} />
      </div>
      <div className="grow px-2.5 py-5 w-full flex-col justify-start items-start gap-5 inline-flex">
        <label className="w-full flex flex-col text-[16px] font-semibold">
          Intitulé
          <HBInput
            type="text"
            name="title"
            placeholder="Title"
            defaultValue={question?.title}
          />
        </label>
        <label className="w-full flex flex-col text-[16px] font-semibold">
          Choix
          <RadioGroup
            value={selected}
            onChange={setSelected}
            className="inline-flex flex-wrap gap-2.5"
          >
            {choices.map((choice) => (
              <div
                key={choice.uuid}
                className="inline-flex justify-start items-center gap-2.5 radio-group-item"
              >
                <Radio
                  value={`choice-${choice.uuid}`}
                  className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
                >
                  <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                </Radio>
                <HBInput
                  type="text"
                  name={`choice-${choice.uuid}`}
                  placeholder="Type here"
                  defaultValue={choice.value}
                />
              </div>
            ))}
          </RadioGroup>
        </label>
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
        <HBButton
          label={question ? "Sauvegarder" : "Créer"}
          type="submit"
          size="medium"
        />
      </div>
    </form>
  );
};

export default QuestionForm;
