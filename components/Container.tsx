import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="container mx-auto p-6 bg-[#ECECEC] shadow-lg rounded-[15px] w-max m-5 max-w-[1024px]">
      <div className="bg-[#FBFBFB] border border-[#B0CDE4] rounded-[15px] p-6">
        {children}
      </div>
    </div>
  );
}
