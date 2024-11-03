// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const HBInput = ({ ...props }: InputProps) => {
  return (
    <input
      className="w-full h-[42px] p-[10px] rounded-[20px] border border-[--main-color]"
      {...props}
    />
  );
};

export default HBInput;
