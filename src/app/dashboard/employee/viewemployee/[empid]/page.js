"use client";
import ImageView from "@/components/ImageView";
import { getEmployeeById } from "@/helpers/Services/Employee_services";
import { getRoleById } from "@/helpers/Services/Role_services";
import {
  BookMarked,
  BookText,
  BriefcaseBusiness,
  HeartPulse,
  Home,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page({ params }) {
  const [employee, setemployee] = useState(null);
  const [role, setrole] = useState(null);
  const [detail, setdetail] = useState(1);
  const [userEdit, enableUserEdit] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openProfileImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowProfile(true);
  };

  const closeProfileImageView = () => {
    setShowProfile(false);
    setSelectedImage("");
  };
  const getemployee = async () => {
    const data = {
      employeeId: params.empid,
    };
    try {
      const res = await getEmployeeById(data);
      if (res.status === 200) {
        await setemployee(res.data);
        console.log(res.data);
        // console.log(res?.data?.loginDetails?.role || "Unknown");
        const roleres = await getRoleById(
          res?.data?.loginDetails?.role || "Unknown"
        );
        setrole(roleres.data.name || "unknown");
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("somthing went wrong..");
    }
  };
  useEffect(() => {
    getemployee();
  }, []);
  const aciveDivCss = "bg-blue-500 text-white rounded";
  return (
    <>
      <div className="">
        <div className="text-sm breadcrumbs">
          <ul>
            <li className="font-semibold	">
              <Link className="text-black	" href={"/dashboard/"}>
                Home
              </Link>
            </li>
            <li>
              <Link className="text-black	" href={"/dashboard/employee"}>
                Employee
              </Link>
            </li>
            <li>View Employee</li>
          </ul>
        </div>
        <div className="">
          {/* -----------------------profile section------------------------ */}
          <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
            <div className="mb-2  flex flex-col gap-y-6 border-b py-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                {employee ? (
                  <div>
                    <img
                      onClick={() =>
                        employee?.personalDetails?.profileImage &&
                        openProfileImageView(
                          employee.personalDetails.profileImage
                        )
                      }
                      className="h-14 w-14 rounded-full object-cover cursor-pointer"
                      src={
                        employee?.personalDetails?.profileImage
                          ? `${employee.personalDetails.profileImage}`
                          : `/assets/images/profile/${
                              employee.personalDetails?.gender == "Female"
                                ? "woman.png"
                                : "man.png"
                            }`
                      }
                      alt="User"
                    />
                    {showProfile && (
                      <ImageView
                        imageUrl={selectedImage}
                        onClose={closeProfileImageView}
                      />
                    )}
                  </div>
                ) : (
                  <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
                )}

                <div className="ml-4 w-56">
                  {employee ? (
                    <span className="text-slate-800 text-xl font-extrabold">
                      {employee.loginDetails?.firstName + " " || "Unknown"}
                      {employee.loginDetails?.lastName || "Unknown"}
                      <br />
                    </span>
                  ) : (
                    <div className="skeleton h-4 m-1 w-28 mt-2"></div>
                  )}

                  {employee ? (
                    <span className="text-slate-500">
                      {employee.loginDetails?.phone || "Unknown"}
                    </span>
                  ) : (
                    <div className="skeleton h-4 m-1 w-28"></div>
                  )}
                </div>
              </div>
              <Link
                href={`/dashboard/employee/editemployee/${params.empid}`}
                class=" hover:bg-green-200 border-green-400 border-opacity-25 border-2 rounded text-green-800 space-x-1 font-bold py-2 px-2 rounded inline-flex items-center"
              >
                <span className="text-green-400 ">Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#50ce58"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-pencil"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Link>
            </div>

            <div className="mb-2 flex justify-between border-b py-8 text-sm sm:text-base">
              <div className="flex flex-col items-center flex-1">
                <span className="text-slate-500 text-sm font-medium">Role</span>
                {role ? (
                  <p className="text-slate-600 mb-1 font-bold">{role}</p>
                ) : (
                  <div className="skeleton h-4 m-1 w-28"></div>
                )}
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-slate-500 text-sm font-medium">
                  Email
                </span>
                {employee ? (
                  <p className="text-slate-600 mb-1 font-bold">
                    {employee.loginDetails?.email || "Unknown"} <br />
                  </p>
                ) : (
                  <div className="skeleton h-4 m-1 w-28 mt-2"></div>
                )}
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-slate-500 text-sm font-medium">
                  Date Of Birth
                </span>
                {employee ? (
                  <p className="text-slate-600 mb-1 font-bold">
                    {employee.personalDetails?.dateOfBirth
                      ? new Date(employee.personalDetails.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : "Unknown"}{" "}
                    <br />
                  </p>
                ) : (
                  <div className="skeleton h-4 m-1 w-28 mt-2"></div>
                )}
              </div>
            </div>
            {/* <div className="flex justify-between py-8">
              <button className="text-slate-500 hover:bg-slate-100 rounded-lg border-2 px-4 py-2 font-medium focus:outline-none focus:ring">
                Message
              </button>
              <button className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700">
                Flag
              </button>
            </div> */}
            {/* ------------------center menu------------------ */}
          </div>
          <div className="">
            <ul className="menu mx-2 mb-2 menu-vertical w-full overflow-x-auto px-4 shadow-md gap-1  lg:w-full align-center lg:menu-horizontal bg-base-200 rounded-xl border bg-white">
              <li className={detail == 1 && aciveDivCss}>
                <button
                  className={detail == 1 && "text-white"}
                  onClick={() => setdetail(1)}
                >
                  <User />
                  Personal{" "}
                </button>
              </li>
              <li className={detail == 2 && aciveDivCss}>
                <button
                  className={detail == 2 && "text-white"}
                  onClick={() => setdetail(2)}
                >
                  <BookMarked />
                  Work Details{" "}
                </button>
              </li>
              <li className={detail == 3 && aciveDivCss}>
                <button
                  className={detail == 3 && "text-white"}
                  onClick={() => setdetail(3)}
                >
                  <Wallet />
                  Banking{" "}
                </button>
              </li>
              <li className={detail == 4 && aciveDivCss}>
                <button
                  className={detail == 4 && "text-white"}
                  onClick={() => setdetail(4)}
                >
                  <Home />
                  Address
                </button>
              </li>
              <li className={detail == 5 && aciveDivCss}>
                <button
                  className={detail == 5 && "text-white"}
                  onClick={() => setdetail(5)}
                >
                  <HeartPulse />
                  Emergency{" "}
                </button>
              </li>
              <li className={detail == 6 && aciveDivCss}>
                <button
                  className={detail == 6 && "text-white"}
                  onClick={() => setdetail(6)}
                >
                  <BookText />
                  Qualification
                </button>
              </li>
              <li className={detail == 7 && aciveDivCss}>
                <button
                  className={detail == 7 && "text-white"}
                  onClick={() => setdetail(7)}
                >
                  <BriefcaseBusiness />
                  Work Experince
                </button>
              </li>
            </ul>
          </div>
          {/* ----------------------personal details section------------------ */}
          {detail === 1 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Personal Details</span>
                </div>
                {employee ? (
                  <div className="bg-white p-6 ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                      {employee?.personalDetails ? (
                        Object.entries(employee.personalDetails)
                          .filter(([key]) => key !== "profileImage")
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="border border-gray-200 p-4 rounded-lg hover:bg-gray-100 text-center"
                            >
                              <h3 className="text-sm font-semibold mb-2">
                                {key}
                              </h3>
                              <p className="text-gray-800">
                                {value ? value : "Missing"}
                              </p>
                            </div>
                          ))
                      ) : (
                        <p>No personal details found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  "Loading"
                )}
              </div>
            </div>
          )}

          {/* ----------------------education details section------------------ */}
          {detail === 2 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8 overflow-auto">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Work Details</span>
                </div>
                {employee && employee.workDetails ? (
                  <div className="bg-white p-2">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            employeeCode
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            employeeStatus
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            designation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            leaveRule
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            employeeType
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            location
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                       <tr> <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.employeeCode}</td>
                        <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.employeeStatus ? 'Active' : 'Inactive'}</td>
                        <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.department.name}</td>
                        <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.designation.name}</td>
                        <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.leaveRule.leaveRuleName}</td>
                        <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.employeeType}</td>
                        <td
                          
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >{employee.workDetails.location}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No workDetails contact details found.</p>
                )}
              </div>
            </div>
          )}

          {/* ----------------------bank details section------------------ */}
          {detail === 3 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Bank Details</span>
                </div>
                {employee ? (
                  <div className="">
                    {employee.bankDetails ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(employee.bankDetails).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td
                                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                    value ? "text-green-500" : "text-red-500"
                                  }`}
                                >
                                  {value ? value : "Not set"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p>No bank details found</p>
                    )}
                  </div>
                ) : (
                  "Loading"
                )}
              </div>
            </div>
          )}

          {/* ----------------------Address details section------------------ */}
          {detail === 4 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Address Details</span>
                </div>
                {employee ? (
                  <div className="">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Permanent Address */}
                      <div>
                        <p className="text-gray-600 font-semibold">
                          Permanent Address
                        </p>
                        {employee.addressDetails ? (
                          <>
                            <p className="text-gray-800">
                              Address Line 1:{" "}
                              {employee.addressDetails.permanentAddress1 ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              Address Line 2:{" "}
                              {employee.addressDetails.permanentAddress2 ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              City:{" "}
                              {employee.addressDetails.permanentCity ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              Country:{" "}
                              {employee.addressDetails.permanentCountry ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              State:{" "}
                              {employee.addressDetails.permanentState ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              Zip:{" "}
                              {employee.addressDetails.permanentZip ||
                                "Missing"}
                            </p>
                          </>
                        ) : (
                          <p>No permanent address found</p>
                        )}
                      </div>
                      {/* Current Address */}
                      <div>
                        <p className="text-gray-600 font-semibold">
                          Current Address
                        </p>
                        {employee.addressDetails ? (
                          <>
                            <p className="text-gray-800">
                              Address Line 1:{" "}
                              {employee.addressDetails.currentAddress1 ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              Address Line 2:{" "}
                              {employee.addressDetails.currentAddress2 ||
                                "Missing"}
                            </p>
                            <p className="text-gray-800">
                              City: {employee.addressDetails.city || "Missing"}
                            </p>
                            <p className="text-gray-800">
                              Country:{" "}
                              {employee.addressDetails.country || "Missing"}
                            </p>
                            <p className="text-gray-800">
                              State:{" "}
                              {employee.addressDetails.state || "Missing"}
                            </p>
                            <p className="text-gray-800">
                              Zip: {employee.addressDetails.zip || "Missing"}
                            </p>
                          </>
                        ) : (
                          <p>No current address found</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  "Loading"
                )}
              </div>
            </div>
          )}
          {/* ----------------------emergency details section------------------ */}
          {detail === 5 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Emergency Contact Details</span>
                </div>
                {employee &&
                employee.emergencyDetails &&
                employee.emergencyDetails.length > 0 ? (
                  <div className="bg-white p-2">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mobile
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Relation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employee?.emergencyDetails.length > 0 && (
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              1
                            </td>
                            {Object?.entries(employee?.emergencyDetails[0]).map(
                              ([key, value]) =>
                                key !== "_id" && (
                                  <td
                                    key={key}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                  >
                                    {value || "Missing"}
                                  </td>
                                )
                            )}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No emergency contact details found.</p>
                )}
              </div>
            </div>
          )}

          {/* ----------------------Qualification details section------------------ */}
          {detail === 6 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Qualification Details</span>
                </div>
                {employee ? (
                  <div className="">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qualification
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Diploma/Degree Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Institute Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employee.qualificationDetails &&
                        employee.qualificationDetails.length > 0 ? (
                          employee.qualificationDetails.map(
                            (qualification, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index + 1}
                                </td>
                                {Object.entries(qualification).map(
                                  ([key, value]) =>
                                    key !== "_id" && (
                                      <td
                                        key={key}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {value || "Missing"}
                                      </td>
                                    )
                                )}
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              No qualification details found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  "Loading"
                )}
              </div>
            </div>
          )}

          {/* ----------------------work Experience details section------------------ */}

          {detail === 7 && (
            <div className="mx-2 mb-2 rounded-xl border bg-white px-4 shadow-md  lg:w-full pb-8">
              <div>
                <div className="divider divider-start">
                  <span className="fw-semibold">Work Experience Details</span>
                </div>
                {employee ? (
                  <div className="">
                    {employee.workExperinceDetails.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {employee.workExperinceDetails.map(
                          (experience, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 p-4 rounded-lg hover:bg-gray-100"
                            >
                              <h3 className="text-lg font-semibold mb-2">
                                Work Experience {index + 1}
                              </h3>
                              <div className="text-gray-800">
                                <p>
                                  Previous Company Name:{" "}
                                  {experience.previousCompanyName || "Missing"}
                                </p>
                                <p>
                                  Job Title: {experience.jobTitle || "Missing"}
                                </p>
                                <p>
                                  From Date: {experience.fromDate || "Missing"}
                                </p>
                                <p>To Date: {experience.toDate || "Missing"}</p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p>No work experience details found</p>
                    )}
                  </div>
                ) : (
                  "Loading"
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default page;
