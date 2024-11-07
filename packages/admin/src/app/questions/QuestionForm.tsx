"use client";
import HBButton from "@/app/components/ui/hbButton";
import HBIconButton from "@/app/components/ui/hbIconButton";
import HBInput from "@/app/components/ui/hbInput";
import { Choice } from "@/app/types/choice";
import { Question } from "@/app/types/question";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { createQuestion, updateQuestion } from "./actions";
import { useEffect, useState } from "react";
import { getTags } from "../tags/actions";
import { Tag } from "../types/tag";
import TagChip from "../components/ui/tagChip";

type QuestionFormProps = {
  question?: Question;
};

const QuestionForm = ({ question }: QuestionFormProps) => {
  const router = useRouter();
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getTags();
      setTags(tags);
    };
    fetchTags();
  }, []);

  const filteredTags =
    query === ""
      ? tags
      : tags.filter((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase())
        );

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(new FormData(e.target as HTMLFormElement));

    // if (question) {
    //   await updateQuestion(
    //     new FormData(e.target as HTMLFormElement),
    //     question.uuid!
    //   );
    // } else {
    //   await createQuestion(new FormData(e.target as HTMLFormElement));
    // }

    // router.back();
  };

  const choices: Array<Choice> = [
    {
      value: question?.choices[0].value || "",
      isCorrect: question?.choices[0].isCorrect || false,
    },
    {
      value: question?.choices[1].value || "",
      isCorrect: question?.choices[1].isCorrect || false,
    },
    {
      value: question?.choices[2].value || "",
      isCorrect: question?.choices[2].value || "",
    },
    {
      value: question?.choices[3].value || "",
      isCorrect: question?.choices[3].value || "",
    },
  ];

  return (
    <form
      onSubmit={submitForm}
      className="w-full h-full bg-white/20 rounded-[10px] flex-col justify-center items-center gap-[15px] inline-flex"
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
          Thèmes
          <Combobox
            immediate
            multiple
            value={selectedTags}
            onChange={setSelectedTags}
            onClose={() => setQuery("")}
            name="tags"
          >
            <div className="w-full min-h-[42px] flex flex-wrap px-[10px] gap-x-2 gap-y-1 rounded-[20px] border border-[--main-color] bg-[--input-background] text-[--text-color] placeholder-[--placeholder-color]">
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 py-2">
                  {selectedTags.map((tag) => (
                    <TagChip key={tag.uuid} label={tag.name} />
                  ))}
                </div>
              )}
              <ComboboxInput
                placeholder="Type here..."
                className="w-1/2 grow h-[42px] py-[10px] bg-transparent text-[--text-color] placeholder-[--placeholder-color] outline-none focus:outline-none active:outline-none"
                onChange={(event) => setQuery(event.target.value)}
              ></ComboboxInput>
            </div>
            <ComboboxOptions
              className="border border-[--main-color] border-2 bg-[--white] empty:invisible flex flex-col gap-2 p-3 rounded-[20px] w-[var(--input-width)] h-[250px] overflow-auto"
              anchor={{ to: "bottom start", gap: "10px" }}
            >
              {filteredTags.map((tag) => (
                <ComboboxOption
                  key={tag.uuid}
                  value={tag}
                  className="text-[--inherit-main-text-color] font-semibold capitalize data-[focus]:bg-[--main-color] p-2.5 rounded-[10px]"
                >
                  {tag.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </label>
        <label className="w-full flex flex-col text-[16px] font-semibold">
          Choix (le premier choix est le bon)
          <div className="inline-flex flex-wrap gap-2.5">
            {choices.map((choice, index) => (
              <Field
                key={`choice-${index}`}
                className="inline-flex justify-start items-center gap-2 radio-group-item"
              >
                <HBInput
                  type="text"
                  name={`choice-${index}`}
                  placeholder="Type here"
                  defaultValue={choice.value}
                  onKeyDown={(e) =>
                    (e.key == " " || e.code == "Space") && e.stopPropagation()
                  }
                />
              </Field>
            ))}
          </div>
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
