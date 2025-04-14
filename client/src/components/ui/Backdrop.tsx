import React from "react";

interface BackdropProps {
  children?: React.ReactNode;
}

const Backdrop = ({ children }: BackdropProps) => {
  return <div className="absolute inset-0 z-20 grid place-items-center bg-gray-800 bg-opacity-75 backdrop-blur-xs">{children}</div>;
};

export default Backdrop;
