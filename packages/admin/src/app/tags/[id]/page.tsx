import TagForm from "../create/TagForm";
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
    <div>
      <TagForm tag={tag} />
    </div>
  );
};

export default UpdateTagPage;
