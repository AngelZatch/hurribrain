import React from "react";
import { Question } from "../types/question";
import clsx from "clsx";
import DifficultyChip from "../components/ui/difficultyChip";
import Link from "next/link";
import HBIconButton from "../components/ui/hbIconButton";
import { PencilIcon } from "@heroicons/react/16/solid";

const QuestionItem = (question: Question) => {
  console.log(question);
  return (
    <div className="min-h-[100px] h-[100px] self-stretch p-2.5 bg-white/20 rounded-[10px] justify-start items-center gap-[15px] inline-flex">
      <div className="self-stretch w-full flex-col justify-center items-start gap-2.5 inline-flex">
        <span className="font-semibold">{question.title}</span>
        <div>
          {question.choices.map((choice, index) => (
            <React.Fragment key={index}>
              <span
                className={clsx("text-sm", choice.isCorrect && "font-bold")}
              >
                {choice.value}
              </span>
              {index > question.choices.length - 2 ? null : <span> / </span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <DifficultyChip
        successRate={question.successRate!}
        difficulty={question.difficulty}
      />
      <Link href={"/questions/" + question.uuid}>
        <HBIconButton icon={<PencilIcon />} />
      </Link>
    </div>
  );
};

export default QuestionItem;
