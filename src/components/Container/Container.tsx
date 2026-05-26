import { type FC } from "react";
import "./Container.css";

type TContainerProps = {
  children: React.ReactNode;
};

export const Container: FC<TContainerProps> = ({ children }) => {
  return <div className="container">{children}</div>;
};
