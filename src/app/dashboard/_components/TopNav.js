import React, { useEffect } from 'react'
import {btnLogout} from './Logout'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";
import { isauth } from '@/helpers/Services/user_services';
import { toast } from 'react-toastify';
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
  const handledropdown=(key)=>{
    if(key=="logout")
      {
        handleLogout();
      }
      else if(key!="")
        {
          router.push(key);
        }
  }
  useEffect(()=>{
    checkIsAuth();
  },[])
  const checkIsAuth = async () =>{
    try
    {
      const res = await isauth();
      if(res.status !== 200)
      {
        toast.error(res.response.data.message);
        toast.error("Logging Out...");
        handleLogout();
        
        
      }
    }catch(error)
    {
      toast.error("internal error")
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
          <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
        <img
                  src="/assets/images/profile/user-1.jpg"
                  alt=""
                  width="35"
                  height="35"
                  className="rounded-circle"
                />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" onAction={(key)=>handledropdown(key)} variant="flat">
          <DropdownItem key="profile" className="h-18 gap-1">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold"></p>
          </DropdownItem>
          <DropdownItem key="/dashboard/myaccount">
            My Account
          </DropdownItem>
          <DropdownItem key="">Team Settings</DropdownItem>
          <DropdownItem key="">
            Analytics
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            LogOut
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
          {/* <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <li className="nav-item">
              <button className="nav-link nav-icon-hover" onClick={handle_sidebar}>
                <i className="ti ti-bell-ringing"></i>
                <div className="notification bg-primary rounded-circle"></div>
              </button>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon-hover"
                
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
                  <Link href="/dashboard/myaccount"><button
                    className="d-flex align-items-center gap-2 dropdown-item"
                  >
                    <i className="ti ti-mail fs-6"></i>
                    <p className="mb-0 fs-3">My Account</p>
                  </button></Link>
                  <a
                    className="d-flex align-items-center gap-2 dropdown-item"
                    onClick={handleLogout}
                  >
                    <i className="ti ti-list-check fs-6"></i>
                    <p className="mb-0 fs-3">Logout</p>
                  </a>
              <li className="nav-item dropdown">
                <a className="nav-link nav-icon-hover" id="drop2" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img src="/assets/images/profile/user-1.jpg" alt="" width="35" height="35" className="rounded-circle"/>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                  <div className="message-body">
                    <span className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-user fs-6"></i>
                      <p className="mb-0 fs-3">My Profile</p>
                    </span>
                    <Link href='/dashboard/myaccount'> <span className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-mail fs-6"></i>
                      <p className="mb-0 fs-3">My Account</p>
                    </span></Link>
                    <a href="" className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-list-check fs-6"></i>
                      <p className="mb-0 fs-3">My Task</p>
                    </a>
                    <button className="btn btn-outline-primary mx-3 mt-2 d-block" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            </li>
          </ul> */}
          
          </div>
        </nav>
      </header>
  )
}
export default TopNav