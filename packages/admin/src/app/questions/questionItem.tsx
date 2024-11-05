import { Question } from "../types/question";

const QuestionItem = (question: Question) => {
  return (
    <div className="min-h-[100px] h-[100px] self-stretch p-2.5 bg-white/20 rounded-[10px] justify-start items-center gap-[15px] inline-flex">
      <div className="self-stretch w-full flex-col justify-center items-start gap-2.5 inline-flex">
        <span>{question.title}</span>
      </div>
    </div>
  );
};

export default QuestionItem;
