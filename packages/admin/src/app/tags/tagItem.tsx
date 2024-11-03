import { Tag } from "@/app/types/tag";
import HBIconButton from "../components/ui/hbIconButton";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

const TagItem = (tag: Tag) => {
  return (
    <div className="min-h-[100px] h-[100px] self-stretch p-2.5 bg-white/20 rounded-[10px] justify-start items-center gap-[15px] inline-flex">
      <div className="self-stretch w-full flex-col justify-center items-start gap-2.5 inline-flex">
        <span className="capitalize">{tag.name}</span>
      </div>
      <Link href={"/tags/" + tag.uuid}>
        <HBIconButton icon={<PencilIcon />} />
      </Link>
      <HBIconButton color="error" icon={<TrashIcon />} />
    </div>
  );
};

export default TagItem;
