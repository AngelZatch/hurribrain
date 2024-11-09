import { Input } from "@headlessui/react";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type Ref = HTMLInputElement;

const HBInput = forwardRef<Ref, InputProps>(function HBInput(props, ref) {
  return (
    <Input
      ref={ref}
      className="w-full h-[42px] p-[10px] rounded-[20px] border border-[--main-color] bg-[--input-background] text-[--text-color] placeholder-[--placeholder-color]"
      {...props}
    />
  );
});
HBInput.displayName = "HBInput";

export default HBInput;
