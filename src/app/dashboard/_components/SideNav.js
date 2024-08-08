import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getMenuItems } from "@/helpers/Services/user_services";

function SideNav() {
  const [showmenu, setshowmenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [decode, setDecode] = useState(false);
  const [navData, setNavData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken" || "");
    if (token) {
      const decoded = jwtDecode(token);
      setDecode(decoded);
    } else {
      router.push("/login");
    }

    fetchNavData();
  }, []);

  const fetchNavData = async () => {
    try {
      const response = await getMenuItems();
      if (response.status === 200) {
        setNavData(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching navigation data:", error);
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="left-sidebar">
      <div className="rounded">
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <span className="text-nowrap logo-img">
            <img src="/assets/images/logo.png" width="180" alt="Logo" />
          </span>
        </div>

        <nav className="sidebar-nav scroll-sidebar overflow-auto" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu text-blue-500 whitespace-nowrap">
                Welcome, {decode.firstName} {decode.lastName}
              </span>
            </li>
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">Home</span>
            </li>
            {navData.map((item) => (
              <Link key={item._id} href={item.path} passHref>
                <li className="sidebar-item">
                  <span
                    className={`sidebar-link ${
                      isActive(item.path) ? "active" : ""
                    }`}
                    aria-expanded="false"
                  >
                    <span
                      className="mr-3 icon-span"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                    <span className="hide-menu">{item.title}</span>
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default SideNav;
