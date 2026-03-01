import { Modal } from "@/app/components/modal";
import { getQuestion } from "../../actions";
import QuestionForm from "../../QuestionForm";

type UpdateQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateQuestionPage = async (props: UpdateQuestionPageProps) => {
  const params = await props.params;
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
