import TagItem from "./tagItem";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";
import HBButton from "../components/ui/hbButton";
import { getTags } from "./actions";

const Tags = async () => {
  const tags = await getTags();

  return (
    <>
      <div className="w-full px-[35px] py-[30px] justify-between items-center inline-flex">
        <h1 className="text-[40px] font-bold">Tags</h1>
        <Link href="/tags/create" className="button">
          <HBButton label="Ajouter" size="large" startIcon={<PlusIcon />} />
        </Link>
      </div>
      <div className="w-full overflow-auto self-stretch p-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
        {tags?.map((tag) => <TagItem key={tag.uuid} {...tag} />)}
      </div>
    </>
  );
};

export default Tags;
