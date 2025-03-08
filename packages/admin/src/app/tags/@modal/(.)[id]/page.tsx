import { Modal } from "@/app/components/modal";
import TagForm from "../../TagForm";
import { getTag } from "../../actions";

type UpdateTagPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateTagPage = async (props: UpdateTagPageProps) => {
  const params = await props.params;
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
