"use client";
import SideNav from "./_components/SideNav";
import TopNav from "./_components/TopNav";
export default function layout({ children }) {
  return (
    <>
      <div
        className="page-wrapper bg-lightbg"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        //data-sidebar-position="fixed" data-header-position="fixed"
         
    data-sidebar-position="fixed" data-header-position="fixed"
      >
        <SideNav />
        <div className="body-wrapper">
          <TopNav />
          <div className="container-fluid">{children}</div>
        </div>
      </div>
    </>
  );
}