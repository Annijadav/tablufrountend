"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
function SideNav() {
    const [showmenu,setshowmenu] = useState(false);
    const router = useRouter();
    const pathname = usePathname()
    
  return (
    <>
      <aside className="left-sidebar">
        <div className=" rounded ">
          <div className="brand-logo d-flex align-items-center justify-content-between">
            <span className="text-nowrap logo-img">
              {/* <span className='text-blue-500 font-bold text-lg text-center'>TIMES TABLU</span> */}
              <img src="/assets/images/logo.png" width="180" alt="" />
            </span>
            <div
              className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
              id="sidebarCollapse"
            >
              <i className="ti ti-x fs-8"></i>
            </div>
          </div>
          <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav">
              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">Home</span>
              </li>
              <Link href="/dashboard">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname === "/dashboard" && "active"
                    }`}
                    href="ui-buttons.html"
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-layout-dashboard"></i>
                    </span>
                    <span className="hide-menu">Dashboard</span>
                  </span>
                </li>
              </Link>
              {showmenu && (
                <ul>
                  <li className="sidebar-item">
                    <span
                      className="sidebar-link"
                      href="index.html"
                      aria-expanded="false"
                    >
                      <span>
                        <i className="ti ti-layout-dashboard"></i>
                      </span>
                      <span className="hide-menu">Dashboard</span>
                    </span>
                  </li>{" "}
                  <li className="sidebar-item">
                    <span
                      className="sidebar-link"
                      href="index.html"
                      aria-expanded="false"
                    >
                      <span>
                        <i className="ti ti-layout-dashboard"></i>
                      </span>
                      <span className="hide-menu">Dashboard</span>
                    </span>
                  </li>
                </ul>
              )}
              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">Control</span>
              </li>
              <Link href="/dashboard/employee">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/employee") && "active"
                    }`}
                    href="ui-buttons.html"
                    aria-expanded="false"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-users"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span className="hide-menu">Employee</span>
                  </span>
                </li>
              </Link>
              <Link href="/dashboard/department">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/department") && "active"
                    }`}
                    href="ui-alerts.html"
                    aria-expanded="false"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-building-2"
                      >
                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                        <path d="M10 6h4" />
                        <path d="M10 10h4" />
                        <path d="M10 14h4" />
                        <path d="M10 18h4" />
                      </svg>
                    </span>
                    <span className="hide-menu">Department</span>
                  </span>
                </li>
              </Link>
              <Link href="/dashboard/designation">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/designation") && "active"
                    }`}
                    href="ui-card.html"
                    aria-expanded="false"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-briefcase-business"
                      >
                        <path d="M12 12h.01" />
                        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                        <rect width="20" height="14" x="2" y="6" rx="2" />
                      </svg>
                    </span>
                    <span className="hide-menu">Designation</span>
                  </span>
                </li>
              </Link>
              <Link href="/dashboard/role">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/role") && "active"
                    }`}
                    href="ui-card.html"
                    aria-expanded="false"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-book-user"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        <circle cx="12" cy="8" r="2" />
                        <path d="M15 13a3 3 0 1 0-6 0" />
                      </svg>
                    </span>
                    <span className="hide-menu">Role</span>
                  </span>
                </li>
              </Link>
              <Link href="/dashboard/leave">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/leave") && "active"
                    }`}
                    href="sample-page.html"
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-aperture"></i>
                    </span>
                    <span className="hide-menu">Leaves</span>
                  </span>
                </li>
              </Link>
              <Link href="/dashboard/LeaveRule">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/LeaveRule") && "active"
                    }`}
                    href="sample-page.html"
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-aperture"></i>
                    </span>
                    <span className="hide-menu">Leave Rule</span>
                  </span>
                </li>
              </Link>
              <Link href="/dashboard/holiday">
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      pathname.startsWith("/dashboard/holiday") && "active"
                    }`}
                    href="sample-page.html"
                    aria-expanded="false"
                  >
                    <span>
                      <i className="ti ti-aperture"></i>
                    </span>
                    <span className="hide-menu">Holiday</span>
                  </span>
                </li>
              </Link>
            {/*  <li className="sidebar-item">
              <span className="sidebar-link" href="ui-forms.html" aria-expanded="false">
                <span>
                  <i className="ti ti-file-description"></i>
                </span>
                <span className="hide-menu">Forms</span>
              </span>
            </li>
            <li className="sidebar-item">
              <span className="sidebar-link" href="ui-typography.html" aria-expanded="false">
                <span>
                  <i className="ti ti-typography"></i>
                </span>
                <span className="hide-menu">Typography</span>
              </span>
            </li>
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">AUTH</span>
            </li>
            <li className="sidebar-item">
              <span className="sidebar-link" href="authentication-login.html" aria-expanded="false">
                <span>
                  <i className="ti ti-login"></i>
                </span>
                <span className="hide-menu">Login</span>
              </span>
            </li>
            <li className="sidebar-item">
              <span className="sidebar-link" href="authentication-register.html" aria-expanded="false">
                <span>
                  <i className="ti ti-user-plus"></i>
                </span>
                <span className="hide-menu">Register</span>
              </span>
            </li>
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">EXTRA</span>
            </li>
            <li className="sidebar-item">
              <span className="sidebar-link" href="icon-tabler.html" aria-expanded="false">
                <span>
                  <i className="ti ti-mood-happy"></i>
                </span>
                <span className="hide-menu">Icons</span>
              </span>
            </li> */}
           
          {/* <div className="unlimited-access hide-menu bg-light-primary position-relative mb-7 mt-5 rounded">
            <div className="d-flex">
              <div className="unlimited-access-title me-3">
                <h6 className="fw-semibold fs-4 mb-6 text-dark w-85">Upgrade to pro</h6>
                <span href="https://adminmart.com/product/modernize-bootstrap-5-admin-template/" target="_blank" className="btn btn-primary fs-2 fw-semibold lh-sm">Buy Pro</span>
              </div>
              <div className="unlimited-access-img">
                <img src="/assets/images/backgrounds/rocket.png" alt="" className="img-fluid"/>
              </div>
            </div>
          </div> */}
          </ul>
        </nav>
        
      </div>
      
    </aside>
    </>
  );
}
export default SideNav;