"use client";

import React, { useState } from "react";
import { getResetPassword } from "@/helpers/Services/Auth_services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function ResetPassword({setStep,setEmail,email}) {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();

  function redirectToLogin() {
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = form;

    if (!newPassword || newPassword.length < 6) {
      toast.error("Please enter a valid six-digit New Password");
      return;
    } else if (!confirmPassword) {
      toast.error("Please enter a Confirm Password");
      return;
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    
    

    try {
      const data = {
        userEmail: email,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };
      
      const res = await getResetPassword(data);

      if (res.status === 201) {
        toast.success("Reset Password Successful");
        redirectToLogin();
      } else {
        toast.error(res.response.data.errorMessage);
      }
    } catch (error) {
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
                        You are only one step a way from your new password,
                        reset your password now.
                      </p>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={form.newPassword}
                        name="newPassword"
                        placeholder="Enter new password"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.confirmPassword}
                        name="confirmPassword"
                        placeholder="Enter Confirm Password"
                        id="exampleInputPassword1"
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      onClick={handleResetPassword}
                      className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                    >
                      Reset Password
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

export default ResetPassword;
