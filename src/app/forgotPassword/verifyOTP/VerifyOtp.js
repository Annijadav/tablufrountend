"use client";

import React, { useEffect, useState } from "react";
import { getVerifyOTP } from "@/helpers/Services/Auth_services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Flex, Input } from "antd";

function VerifyOtp({setStep,setEmail,email}) {
  const router = useRouter();
  const onChange = (text) => {
    console.log("onChange:", text);
    setOTP(text);
  };
  const sharedProps = {
    onChange,
  };

  const [otp, setOTP] = useState("");

  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOTP(value); // Update the state of otp
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      // Check if OTP is not entered or not of length 6 or not numeric
      toast.error("Please Enter a valid six digit OTP");
      return;
    }

    try {
      const res = await getVerifyOTP({ otp: otp });
      if (res.status === 201) {
        toast.success("Verify OTP Successfully");
        setStep(3);
      }
      else{
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
                        Enter received OTP for password reset
                      </p>
                    </div>

                    {/* <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        OTP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={otp}
                        name="otp"
                        placeholder="Enter your six digit OTP"
                        // onChange={handleInputChange}
                      />
                    </div> */}
                    <Flex className="mb-3 px-5 gap-8 items-center flex-col">
                      {/* <Title level={5}>Enter received OTP for password reset</Title> */}
                      <Input.OTP
                        variant="filled"
                        className="rounded border border-red text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        size="small"
                        length={6}
                        {...sharedProps}
                      />
                    </Flex>

                    <button
                      onClick={handleVerifyOTP}
                      className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                    >
                      Verify OTP
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

export default VerifyOtp;
