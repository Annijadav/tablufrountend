"use client";
import React, { useState } from "react";

import {
  addemployee,
  update_BasicDetails,
} from "@/helpers/Services/Employee_services";
import { toast } from "react-toastify";
import JoiSchema from "../validations/basicValidation";

function BasicDetail({ data, roles_data, uid }) {
  const [basicDetails, setBasicDetails] = useState({
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    phone: data?.phone,
    role: data?.role,
  });
  const handlechange = (e) => {
    setBasicDetails({
      ...basicDetails,
      [e.target.name]: e.target.value,
    });
  };
  const basicDetails_submit = async () => {
    const { error, value } = JoiSchema.validate(basicDetails, {
      abortEarly: false,
    });
    if (error) {
      const firstErrorMessage = error.details[0].message;
      setOverlayVisible(false);
      toast.error(firstErrorMessage);
    } else {
      
      try {
        const res = await update_BasicDetails(uid, basicDetails);
        setOverlayVisible(false);

        if (res?.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [btnDisable, setBtnDesable] = useState(true);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  return (
    <>
      {/* Overlay */}
      {overlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {/* Overlay content */}
          <div className="bg-white p-10 rounded shadow-lg">
            <p className="text-center mb-4">
              Are you sure you want to update the employee details?
            </p>
            <div className="flex mt-2  justify-end	">
              <button
                onClick={toggleOverlay}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={basicDetails_submit}
                className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <br />
            <h4>Basic Details</h4>
            <hr />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                First Name <span className="text-red-400">*</span>
              </p>
              <input
                type="text"
                name="firstName"
                placeholder="john"
                onChange={handlechange}
                value={basicDetails.firstName}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                required
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Last Name<span className="text-red-400">*</span>
              </p>
              <input
                type="text"
                name="lastName"
                placeholder="john"
                onChange={handlechange}
                value={basicDetails.lastName}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Email<span className="text-red-400">*</span>
              </p>
              <input
                type="email"
                name="email"
                placeholder="john"
                onChange={handlechange}
                value={basicDetails.email}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Phone Number<span className="text-red-400">*</span>
              </p>
              <input
                type="tel"
                name="phone"
                placeholder="john"
                onChange={handlechange}
                value={basicDetails.phone}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Role<span className="text-red-400">*</span>
              </p>
              <select
                name="role"
                onChange={handlechange}
                value={basicDetails.role}
                className=" select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              >
                <option>Please Select</option>
                {roles_data ? (
                  roles_data.map((item, key) => (
                    <option key={key} value={item._id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option>failed</option>
                )}
              </select>
            </div>
          </div>
          <div className="flex w-full flex-row-reverse">
            <button
              type="button"
              className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={toggleOverlay}
            >
              Update
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicDetail;
