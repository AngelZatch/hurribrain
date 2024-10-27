import { Button } from "@headlessui/react";
interface ButtonProps {
  label?: string;
  variant?: "primary" | "secondary" | "error";
  onClick?: () => void;
}

const HBButton = ({ label, onClick }: ButtonProps) => {
  return (
    <Button
      type="button"
      className="h-14 p-4 rounded-[10px] justify-center items-center gap-2.5 inline-flex bg-[--main-color]"
      onClick={onClick}
    >
      <div className="grow shrink basis-0 text-center text-black text-base font-semibold tracking-wide">
        {label}
      </div>
    </Button>
  );
};

export default HBButton;
