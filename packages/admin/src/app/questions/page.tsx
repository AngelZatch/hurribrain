import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import HBButton from "../components/ui/hbButton";
import { QuestionResponseDto } from "../types/question";
import QuestionItem from "./questionItem";

const Questions = async () => {
  const data = await fetch("http://localhost:8080/questions");
  const questionResponseDto: QuestionResponseDto = await data.json();

  return (
    <>
      <div className="w-full px-[35px] py-[30px] justify-between items-center inline-flex">
        <h1 className="text-[40px] font-bold">Questions</h1>
        <div className="gap-2.5 inline-flex">
          <Link href="/questions/create" className="button">
            <HBButton label="Ajouter" size="large" startIcon={<PlusIcon />} />
          </Link>
          <Link href="/questions/import" className="button">
            <HBButton
              label="Importer"
              size="large"
              color="secondary"
              startIcon={<ArrowUpTrayIcon />}
            />
          </Link>
        </div>
      </div>
      <div className="w-full overflow-auto self-stretch p-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
        {questionResponseDto?.data?.map((question) => (
          <QuestionItem key={question.uuid} {...question} />
        ))}
      </div>
    </>
  );
};

export default Questions;
