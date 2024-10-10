import Link from "next/link";

const SideNav = () => {
  return (
    <div className="flex h-full items-center bg-[#0000004D]">
      <div className="flex flex-col gap-2 items-start justify-center">
        <div className="flex flex-col justify-center align-center">
          <Link key="Questions" href="/dashboard/questions">
            <p>Questions</p>
          </Link>
        </div>
        <div className="flex flex-col justify-center align-center">
          <Link key="Tags" href="/dashboard/tags">
            <p>Tags</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
