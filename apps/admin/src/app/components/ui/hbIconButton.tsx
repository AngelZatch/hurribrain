import { Button } from "@headlessui/react";
import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  noBackground?: boolean;
  onClick?: () => void;
}

const HBIconButton = ({
  icon,
  noBackground,
  onClick,
  ...props
}: IconButtonProps) => {
  return (
    <Button
      className={clsx(
        "w-[32px] h-[32px] rounded-[100px] p-[4px] inline-flex justify-center items-center bg-[--icon-button-background]",
        noBackground && "bg-transparent"
      )}
      onClick={onClick}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default HBIconButton;
