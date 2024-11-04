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

  if (!tag) {
    return (
      <Modal>
        <span>Tag not found</span>
      </Modal>
    );
  }

  return (
    <Modal>
      <TagForm tag={tag} />
    </Modal>
  );
};

export default UpdateTagPage;
