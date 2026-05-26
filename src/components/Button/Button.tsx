import { type FC } from "react";
import "./Button.css";

type TButtonProps = {
  color: "primary" | "secondary";
  type: "submit" | "button";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const Button: FC<TButtonProps> = ({
  color,
  children,
  type,
  onClick,
  disabled,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="button"
      style={
        color === "primary"
          ? { background: "#370B27" }
          : { background: "#FFAFA4" }
      }
      type={type}
      aria-busy={loading}
    >
      {loading && <span className="button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
