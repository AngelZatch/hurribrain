import { Button } from "@headlessui/react";
import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  onClick?: () => void;
}

const HBIconButton = ({ icon, onClick, ...props }: IconButtonProps) => {
  return (
    <Button
      className={clsx(
        "w-[32px] h-[32px] rounded-[100px] p-[4px] justify-center items-center gap-2.5 inline-flex",
        "bg-[--main-color]"
      )}
      onClick={onClick}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default HBIconButton;
