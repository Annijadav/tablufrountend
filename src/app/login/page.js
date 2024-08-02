"use client";

import React, { useState, useEffect } from "react";
import { getLogin } from "@/helpers/Services/Auth_services";
import { getRoleById, getRoles } from "@/helpers/Services/Role_services";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { settoken } from "./setCookie";
import { useRouter } from "next/navigation";
import FullScreenLoading from "@/components/FullScreenLoading";


function page() {
  const [form, setform] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [roleName, setRoleName] = useState("");
  const [loading,setLoading] = useState(false);
  function redirectToDash() {
    setTimeout(() => {
     router.push("/dashboard")
      
    }, 3000); // 2000 milliseconds = 2 seconds
  }
  const handleKeyPress = async(event)=>{
    // console.log(event);
    if(event.key === "Enter")
    {
      handleLogin();
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setform((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const router = useRouter();

  const handleLogin = async () => {
    const { emailOrPhone, password } = form;
    
    if (!emailOrPhone) {
      //console.log("please enter email");
      toast.error("Please Enter valid Email ID Or Phone number");
    } else if (!password) {
      //console.log("please enter valid password");
      toast.error("please enter valid password");
    } else {
      try {
        const data = {
          emailOrPhone: emailOrPhone,
          password: password,
        };
        setLoading(true);
        const res = await getLogin(data);

        if (res.status === 200) {
          toast.success("Login Successful");
          await localStorage.setItem("authToken", res.data.Token);
          //cookies().setItem("authToken",res.data.Token)
          await settoken(res.data.Token);
          
          const token = await localStorage.getItem("authToken" || "");
          //console.log("token", token);
          if (token) {
            const decoded = jwtDecode(token);
            
            await localStorage.setItem("firstName", decoded.firstName);
            await localStorage.setItem("lastName", decoded.lastName);
            const rolename = decoded.rolename;
            if (rolename === "Admin") {
              redirectToDash();
            }else if( rolename === "HR"){
              console.log("Hello Hr");
              redirectToDash();
            } else if (rolename === "Employee") {
              redirectToMyDash();
            }
            else if (rolename === "Times Tablu Admin") {
              redirectToTimesTabluDash();
            }
          } else {
            console.log("token not found");
          }
          setform({
            emailOrPhone: "",
            password: "",
          });
          

          //console.log(localStorage.getItem("authToken")||"notset");
        } else {
          toast.error(res.response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  };
  function redirectToMyDash() {
    setTimeout(() => {
      router.push("/myDashboard");
    }, );
  }

  function redirectToTimesTabluDash() {
    setTimeout(() => {
      router.push("/timestablu-dashboard");
    }, );
  }

  

  return (
    <>
    {loading&&<FullScreenLoading/>}
      <div
        className="page-wrapper"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >
        <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="row justify-content-center w-100">
              <div className="col-md-8 col-lg-5 col-xxl-3">
                <div className="card mb-0">
                  <div className="card-body">
                  <div className="m-auto flex justify-end">
                      <img
                        src="../assets/images/logo.png"
                        width="180"
                        alt="Logo"
                        className="self-end"
                      />
                    </div>
                    <div className="text-center">
                      <br/><br/>
                      <p className="text-2xl font-bold mb-6">Login To TIMES-TABLU</p>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Email / Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={form.emailOrPhone}
                        name="emailOrPhone"
                        placeholder="Enter an Email or Phone number"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        name="password"
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a Password"
                        id="exampleInputPassword1"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input primary"
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="flexCheckChecked"
                        >
                          Remember Me
                        </label>
                      </div>
                      <a className="text-primary fw-bold" href="forgotPassword">
                        Forgot Password ?
                      </a>
                    </div>
                    <button
                      onClick={handleLogin}
                      className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
