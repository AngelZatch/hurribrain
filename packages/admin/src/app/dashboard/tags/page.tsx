import Button from "./../../ui/components/button";
import TagItem from "./tagItem";

const Tags = async () => {
  const data = await fetch("http://localhost:8080/tags");
  const tags = await data.json();

  return (
    <>
      <div className="self-stretch px-[35px] py-[30px] justify-between items-center inline-flex">
        <h1 className="text-[40px] font-bold">Tags</h1>
        <Button label="Ajouter" />
      </div>
      <div className="h-[58px] px-[25px] py-2 justify-start items-center gap-10 inline-flex">
        <div className="w-[390px] h-[42px] p-2.5 bg-[#d9d9d9]/40 rounded-[20px] border border-[#93ced0] justify-start items-start gap-2.5 flex">
          <div className="grow shrink basis-0 self-stretch text-[#ababab] text-base font-semibold font-['Exo'] tracking-wide">
            Chercher par intitulé...
          </div>
        </div>
      </div>
      <div className="self-stretch p-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
        {tags?.map((tag: { uuid: string; name: string }) => (
          <TagItem key={tag.uuid} label={tag.name} />
        ))}
      </div>
    </>
  );
};

export default Tags;
