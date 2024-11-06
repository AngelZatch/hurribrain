import { Question } from "@/app/types/question";
import { getQuestion } from "../../actions";
import QuestionForm from "../../create/QuestionForm";
import { Modal } from "@/app/components/modal";

type UpdateQuestionPageProps = {
  params: {
    id: string;
  };
};

const UpdateQuestionPage = async ({ params }: UpdateQuestionPageProps) => {
  const { id } = params;
  const question: Question = await getQuestion(id);

  if (!question) {
    return (
      <Modal>
        <span>Question not found</span>
      </Modal>
    );
  }

  return (
    <Modal>
      <QuestionForm question={question} />
    </Modal>
  );
};

export default UpdateQuestionPage;
