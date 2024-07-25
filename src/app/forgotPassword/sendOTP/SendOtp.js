"use client"

import React, { useState } from "react";
import { getSendOTP } from "@/helpers/Services/Auth_services";
import { toast } from "react-toastify";

function SendOtp({setStep,setEmail,email}) {
  

  const [tempEmail,setTempEmail] = useState("");
  

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempEmail(value);
    setEmail(value)
  };

  const handleSendOTP = async () => {
    if (!tempEmail) {
      toast.error("Please Enter Your valid Email ID");
      return;
    }

    try {
      const res = await getSendOTP({ email: tempEmail });
      if (res.status === 201) {
        toast.success("Send OTP Successfully");
        setStep(2);
      }
      else{
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error("Internal server ");
      console.log(error);
    }
  };

  return (
    <>
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
                      <br />
                      <br />
                      <p className="text-2xl font-bold mb-6">
                        Enter Email to receive an OTP for password reset
                      </p>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        name="email"
                        placeholder="Enter your valid Email ID"
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      onClick={handleSendOTP}
                      className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                    >
                      Send OTP
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

export default SendOtp;
