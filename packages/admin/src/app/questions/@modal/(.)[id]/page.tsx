import { Modal } from "@/app/components/modal";
import { getQuestion } from "../../actions";
import QuestionForm from "../../QuestionForm";

type UpdateQuestionPageProps = {
  params: {
    id: string;
  };
};

const UpdateQuestionPage = async ({ params }: UpdateQuestionPageProps) => {
  const { id } = params;
  const question = await getQuestion(id);

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
