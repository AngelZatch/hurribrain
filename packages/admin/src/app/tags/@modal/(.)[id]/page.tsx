import { Modal } from "@/app/components/modal";
import TagForm from "../../create/TagForm";
import { Tag } from "@/app/types/tag";

type UpdateTagPageProps = {
  params: {
    id: string;
  };
};

const UpdateTagPage = async ({ params }: UpdateTagPageProps) => {
  const { id } = params;

  const data = await fetch(`http://localhost:8080/tags/${id}`);
  const tag: Tag = await data.json();

  console.log(tag);

  return (
    <Modal>
      <TagForm tag={tag} />
    </Modal>
  );
};

export default UpdateTagPage;
