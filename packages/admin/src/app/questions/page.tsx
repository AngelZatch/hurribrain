import { PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import HBButton from "../components/ui/hbButton";

const Questions = async () => {
  return (
    <>
      <div className="self-stretch px-[35px] py-[30px] justify-between items-center inline-flex">
        <h1 className="text-[40px] font-bold">Questions</h1>
        <Link href="/questions/create" className="button">
          <HBButton label="Ajouter" size="large" startIcon={<PlusIcon />} />
        </Link>
      </div>
      <div className="self-stretch p-2.5 flex-col justify-start items-start gap-2.5 inline-flex"></div>
    </>
  );
};

export default Questions;
