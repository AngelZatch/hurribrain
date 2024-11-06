import { Question } from "@/app/types/question";
import { getQuestion } from "../actions";
import QuestionForm from "../create/QuestionForm";

type UpdateQuestionPageProps = {
  params: {
    id: string;
  };
};

const UpdateQuestionPage = async ({ params }: UpdateQuestionPageProps) => {
  const { id } = params;
  const question: Question = await getQuestion(id);

  return (
    <div>
      <QuestionForm question={question} />
    </div>
  );
};

export default UpdateQuestionPage;
