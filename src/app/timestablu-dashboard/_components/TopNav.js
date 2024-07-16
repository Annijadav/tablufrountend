import React from 'react'
import {btnLogout} from './Logout'
import { useRouter } from 'next/navigation';
function TopNav() {
  const router = useRouter();
  function handleLogout()
  {
    console.log("called");
    btnLogout();
    
    localStorage.removeItem('authToken');
    router.push('/login');
  }
  const handle_sidebar=()=>{
    if(localStorage.getItem("visible_sidebar"))
    {
      
    }
    
  }
  return (
    <header className="app-header shadow-sm">
        <nav className="navbar  navbar-expand-lg navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item d-block d-xl-none">
              <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" >
                <i className="ti ti-menu-2"></i>
              </a>
            </li>

          </ul>
          <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <li className="nav-item">
              <button className="nav-link nav-icon-hover" onClick={handle_sidebar}>
                <i className="ti ti-bell-ringing"></i>
                <div className="notification bg-primary rounded-circle"></div>
              </button>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon-hover"
                href=""
                id="drop2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/assets/images/profile/user-1.jpg"
                  alt=""
                  width="35"
                  height="35"
                  className="rounded-circle"
                />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                aria-labelledby="drop2"
              >
                <div className="message-body">
                  <a
                    href=""
                    className="d-flex align-items-center gap-2 dropdown-item"
                  >
                    <i className="ti ti-user fs-6"></i>
                    <p className="mb-0 fs-3">My Profile</p>
                  </a>
                  <a
                    href=""
                    className="d-flex align-items-center gap-2 dropdown-item"
                  >
                    <i className="ti ti-mail fs-6"></i>
                    <p className="mb-0 fs-3">My Account</p>
                  </a>
                  <a
                    className="d-flex align-items-center gap-2 dropdown-item"
                    onClick={handleLogout}
                  >
                    <i className="ti ti-list-check fs-6"></i>
                    <p className="mb-0 fs-3">Logout</p>
                  </a>
                </div>
              </div>
            </li>
          </ul>
          </div>
        </nav>
      </header>
  )
}
export default TopNav