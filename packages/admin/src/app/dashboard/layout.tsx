import React from "react";
import SideNav from "../ui/components/sidenav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow flex-col justify-start items-start gap-2.5 inline-flex">
        {children}
      </div>
    </div>
  );
};

export default Layout;
