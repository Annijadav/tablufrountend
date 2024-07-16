"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function SideNav() {
  // const [showmenu,setshowmenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [decode, setDecode] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("authToken" || "");
    //console.log("token", token);
    if (token) {
      const decoded = jwtDecode(token);
      setDecode(decoded);
    } else {
      router.push("/login");
    }
    // getHolidayList();
  }, []);

  return (
    <>
      <aside className="left-sidebar">
        {/* {localStorage.getItem("sidebar_visible")} */}
        <div className="h-screen rounded">
          <div className="brand-logo d-flex align-items-center justify-content-between">
            <span className="text-nowrap logo-img mt-1">
              {/* <span className='text-blue-500 font-bold text-lg text-center'>TIMES TABLU</span> */}
              <img src="/assets/images/imgpsh_fullsize_animnew.jfif" width="180" alt="" />
            </span>
          </div>

          <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav">
              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">
                  Welcome, {decode.firstName} {decode.lastName}
                </span>
              </li>
              <Link href="/timestablu-dashboard">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname === "/timestablu-dashboard" && "active"
                    }`}
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-layout-dashboard"></i>
                    </span>
                    <span className="hide-menu">Dashboard</span>
                  </span>
                </li>
              </Link>
              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">Control</span>
              </li>
              <Link href="/timestablu-dashboard/company">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/timestablu-dashboard/company") && "active"
                    }`}
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-article"></i>
                    </span>
                    <span className="hide-menu">Company</span>
                  </span>
                </li>
              </Link>
              <Link href="/timestablu-dashboard/industry">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/timestablu-dashboard/industry") && "active"
                    }`}
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-article"></i>
                    </span>
                    <span className="hide-menu">Industry</span>
                  </span>
                </li>
              </Link>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default SideNav;
