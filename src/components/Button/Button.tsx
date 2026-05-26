import { type FC } from "react";

type TButtonProps = {
  color: "primary" | "secondary";
  type: "submit" | "button";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const Button: FC<TButtonProps> = ({
  color,
  children,
  type,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="button"
      style={
        color === "primary"
          ? { background: "#370B27" }
          : { background: "#FFAFA4" }
      }
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
