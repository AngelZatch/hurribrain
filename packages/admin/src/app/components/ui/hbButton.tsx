import { Button } from "@headlessui/react";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  color?: "primary" | "secondary" | "error";
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outline" | "text";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
}

const HBButton = ({
  label,
  color = "primary",
  size = "large",
  variant = "contained",
  startIcon,
  endIcon,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={clsx(
        "rounded-[10px] justify-center items-center gap-2.5 inline-flex",
        // size
        size === "large" && "h-14 p-4",
        size === "medium" && "h-9 px-3 py-1.5 min-w-[120px] min-h-[36px]",
        size === "small" && "h-7 px-[12px] py-[4px]",
        // variant contained
        variant === "contained" &&
          color === "primary" &&
          "bg-[--main-color] text-[--black]",
        variant === "contained" &&
          color === "error" &&
          "bg-red-500 text-[--error-color]",
        variant === "contained" &&
          color === "secondary" &&
          "bg-[--secondary-color] text-[--inherit-main-text-color]",
        // variant text
        variant === "text" && color === "primary" && "text-[--main-color]",
        variant === "text" && color === "error" && "text-[--error-color]",
        variant === "text" &&
          color === "secondary" &&
          "text-[--inherit-main-text-color]"
      )}
      onClick={onClick}
      {...props}
    >
      {startIcon && (
        <span className="w-5 h-5 justify-center items-center inline-flex text-inherit">
          {startIcon}
        </span>
      )}
      <span
        className={clsx(
          "grow shrink basis-0 text-center text-base font-semibold tracking-wide",
          size === "small" && "text-[12px]"
        )}
      >
        {label}
      </span>
      {endIcon && (
        <span className="w-5 h-5 justify-center items-center inline-flex">
          {endIcon}
        </span>
      )}
    </Button>
  );
};

export default HBButton;
