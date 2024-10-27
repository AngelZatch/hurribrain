import { Tag } from "@/app/types/tag";
import NewTag from "./newTag";
import TagItem from "./tagItem";
import Link from "next/link";

const Tags = async () => {
  const data = await fetch("http://localhost:8080/tags");
  const tags = await data.json();

  return (
    <>
      <div className="w-full px-[35px] py-[30px] justify-between items-center inline-flex">
        <h1 className="text-[40px] font-bold">Tags</h1>
        <Link href="/tags/create" className="button">
          Ajouter
        </Link>
      </div>
      <div className="w-full overflow-auto self-stretch p-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
        {tags?.map((tag: Tag) => <TagItem key={tag.uuid} label={tag.name} />)}
      </div>
      <NewTag />
    </>
  );
};

export default Tags;
