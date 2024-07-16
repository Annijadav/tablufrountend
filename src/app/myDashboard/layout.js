"use client";

// import SideNav from "./_components/SideNav";
import TopNav from "./_components/TopNav";

export default function layout({ children }) {
  return (
    <>
      {/* <div
        className="page-wrapper"
         id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      > */}
      <div className="body-wrapper">
        <TopNav />
        <div className="w-full">

          {children}
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
