interface ButtonProps {
  label?: string;
  variant?: "primary" | "secondary" | "error";
}

const Button = ({ label }: ButtonProps) => {
  return (
    <button className="h-14 p-4 rounded-[10px] justify-center items-center gap-2.5 inline-flex bg-[--main-color]">
      <div className="grow shrink basis-0 text-center text-black text-base font-semibold tracking-wide">
        {label}
      </div>
    </button>
  );
};

export default Button;
