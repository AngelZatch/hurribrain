import { Input } from "@headlessui/react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const HBInput = ({ ...props }: InputProps) => {
  return (
    <Input
      className="w-full h-[42px] p-[10px] rounded-[20px] border border-[--main-color] bg-[--input-background] text-[--text-color] placeholder-[--placeholder-color]"
      {...props}
    />
  );
};

export default HBInput;
