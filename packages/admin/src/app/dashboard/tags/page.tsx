"use client";
import Button from "./../../ui/components/button";
import fetcher from "../../api/fetcher";
import useSWR from "swr";

const Tags = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8080/tags",
    fetcher
  );

  console.log(data, error, isLoading);

  return (
    <>
      <div className="self-stretch px-[35px] py-[30px] justify-between items-center inline-flex">
        <h1 className="text-[40px] font-bold">Tags</h1>
        <Button label="Ajouter" />
      </div>
      <div class="h-[58px] px-[25px] py-2 justify-start items-center gap-10 inline-flex">
        <div class="w-[390px] h-[42px] p-2.5 bg-[#d9d9d9]/40 rounded-[20px] border border-[#93ced0] justify-start items-start gap-2.5 flex">
          <div class="grow shrink basis-0 self-stretch text-[#ababab] text-base font-semibold font-['Exo'] tracking-wide">
            Chercher par intitulé...
          </div>
        </div>
      </div>
    </>
  );
};

export default Tags;
