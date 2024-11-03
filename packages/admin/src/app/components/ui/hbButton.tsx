import { Button } from "@headlessui/react";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  color?: "primary" | "secondary" | "error";
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outline" | "text";
  onClick?: () => void;
}

const HBButton = ({
  label,
  color = "primary",
  size = "large",
  variant = "contained",
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={clsx(
        "rounded-[10px] justify-center items-center gap-2.5 inline-flex",
        variant === "contained" && color === "primary" && "bg-[--main-color]",
        variant === "contained" &&
          color === "secondary" &&
          "bg-[--secondary-color]",
        variant === "contained" && color === "error" && "bg-red-500",
        size === "large" && "h-14 p-4",
        size === "medium" && "h-9 px-3 py-1.5 min-w-[120px] min-h-[36px]",
        size === "small" && "h-7 px-[12px] py-[4px]",
        "text-inherit"
      )}
      onClick={onClick}
      {...props}
    >
      <span
        className={clsx(
          "grow shrink basis-0 text-center text-black text-base font-semibold tracking-wide",
          size === "small" && "text-[12px]"
        )}
      >
        {label}
      </span>
    </Button>
  );
};

export default HBButton;
