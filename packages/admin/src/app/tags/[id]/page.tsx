import { getTag } from "../actions";
import TagForm from "../create/TagForm";

type UpdateTagPageProps = {
  params: {
    id: string;
  };
};

const UpdateTagPage = async ({ params }: UpdateTagPageProps) => {
  const { id } = params;
  const tag = await getTag(id);

  return (
    <div>
      <TagForm tag={tag} />
    </div>
  );
};

export default UpdateTagPage;
