import { Modal } from "@/app/components/modal";
import TagForm from "../../create/TagForm";
import { getTag } from "../../actions";

type UpdateTagPageProps = {
  params: {
    id: string;
  };
};

const UpdateTagPage = async ({ params }: UpdateTagPageProps) => {
  const { id } = params;
  const tag = await getTag(id);

  return (
    <Modal>
      <TagForm tag={tag} />
    </Modal>
  );
};

export default UpdateTagPage;
