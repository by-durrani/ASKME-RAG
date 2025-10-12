import LayoutBreadcrumb from "@/components/layout-breadcrumb";
import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="w-full h-full flex flex-col md:ml-4 md:mt-0 pt-4 gap-4">
        {/* <LayoutBreadcrumb /> */}
        {children}
      </div>
    </>
  );
};

export default layout;
