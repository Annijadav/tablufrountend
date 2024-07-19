"use client";
import { getDepartments } from "@/helpers/Services/Department_services";
import { getAllDesignation } from "@/helpers/Services/Designation_services";
import {
  delete_ExpById,
  update_ExpById,
  update_ExperinceDetails,
  update_workDetails,
} from "@/helpers/Services/Employee_services";
import { getAllLeaveRuleNames } from "@/helpers/Services/Leave_services";
import React, { useEffect, useId, useState } from "react";

import { toast } from "react-toastify";
import { workDetailValidate } from "../validations/workDetailValidation";
import { jobDetailsValidation } from "../validations/jobDetailsValidation";

function WorkDetail({ data, refreshdata, workXp, userid }) {
  //console.log(workXp);
  const [department, setDepartment] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [leaveRule, setLeaveRule] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteLoader, deleteBtnLoader] = useState(false);
  const getDepartmentsList = async () => {
    try {
      const response = await getDepartments();

      if (response.status === 200) {
        //console.log(response);
        await setDepartment(response.data);
        console.log(department);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getLeaveRuleList = async () => {
    try {
      const response = await getAllLeaveRuleNames();

      if (response.status === 200) {
        //console.log(response);
        await setLeaveRule(response.data);
        console.log(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDesignations = async () => {
    try {
      const response = await getAllDesignation();

      if (response.status === 200) {
        //console.log(response);
        await setDesignation(response.data);
        console.log(department);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDepartmentsList();
    getDesignations();
    getLeaveRuleList();
  }, []);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  const [workDetails, setWorkDetails] = useState({
    officeLandlineNumber: data?.officeLandlineNumber,
    employeeCode: data?.employeeCode,
    leaveRule: data?.leaveRule,
    reportingManager: data?.reportingManager,
    shift: data?.shift,
    department: data?.department,
    designation: data?.designation,
    grade: data?.grade,
    employeeType: data?.employeeType,
    company: data?.company,
    location: data?.location,
    biomerticId: data?.biomerticId,
    hiringSource: data?.hiringSource,
    probationStatus: data?.probationStatus,
    sourceOfVerification: data?.sourceOfVerification,
  });

  const [workExperiences, setWorkExperiences] = useState([]);

  const handleWorkExperienceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedWorkExperiences = [...workExperiences];
    updatedWorkExperiences[index][name] = value;
    setWorkExperiences(updatedWorkExperiences);
  };

  const handleAddMore = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        previousCompanyName: "",
        jobTitle: "",
        fromDate: "",
        toDate: "",
      },
    ]);
  };
  const handleRemove = (index) => {
    const updatedWorkExperiences = [...workExperiences];
    updatedWorkExperiences.splice(index, 1);
    setWorkExperiences(updatedWorkExperiences);
  };
  const handleWorkDetailsChange = (e) => {
    const { name, value } = e.target;
    setWorkDetails((prevWorkDetails) => ({
      ...prevWorkDetails,
      [name]: value,
    }));
  };
  const workDetails_submit = async () => {
    let er = false;
    try {
      console.log(workDetails);
      const { error } = workDetailValidate(workDetails);
      console.log(error);
      if (error) {
        const errorMessage = error.details[0].message;
        toast.error(errorMessage);
        return;
      }
      const res = await update_workDetails(userid, workDetails);
      if (res.status === 201) {
        console.log(res);
      } else {
        toast.error(res.response.data.message);
        er = true;
      }

      if (workExperiences.length > 0) {
        let flag = true;
        for (let i = 0; i < workExperiences.length; i++) {
          const { error } = jobDetailsValidation(workExperiences[i]);

          if (error) {
            const errorMessage = error.details[0].message;
            toast.error(errorMessage);
            flag = false;
            return;
          }
        }
        if (flag) {
          for (let i = 0; i < workExperiences.length; i++) {
            const response = await update_ExperinceDetails(
              userid,
              workExperiences[i]
            );
            if (response.status === 201) {
              //console.log("Record added successfully:",i+1);
            } else {
              toast.error(response.response.data.message);
              er = true;
              break;
            }
          }
        }
      }
      if (!er) {
        toast.success("saved");
        refreshdata();
        setWorkExperiences([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("something wrong");
    }
  };
  const [editingItem, setEditingItem] = useState(null);

  const handleEditClick = (item) => {
    setEditedData(item);
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleUpdate = async () => {
    setBtnLoader(true);
    try {
      const { error } = jobDetailsValidation(editedData);
      console.log(error);
      if (error) {
        const errorMessage = error.details[0].message;
        toast.error(errorMessage);
      }
      const res = await update_ExpById(userid, editedData._id, editedData);
      if (res.status === 201) {
        toast.success(res.data.message);
        setBtnLoader(false);
        setEditingItem(null);
        refreshdata();
      } else {
        console.log(res.response.data.message);
        toast.error(res.response.data.message);
        setBtnLoader(false);
      }
    } catch (error) {
      console.log(error);
      setBtnLoader(false);
      toast.warning("something wrong..");
    }

    console.log("Updated data:", editedData);
  };
  const handledelete = async (rid) => {
    deleteBtnLoader(true);
    try {
      const res = await delete_ExpById(userid, rid);
      if (res.status === 200) {
        deleteBtnLoader(false);
        toast.success(res.data.message);
        refreshdata();
        setEditingItem(null);
      } else {
        toast.error(res.response.data.message);
        deleteBtnLoader(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("something wrong...");
      deleteBtnLoader(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
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
          <h4>Work Details</h4>
          <hr />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Office Landline Number
              </p>
              <input
                type="tel"
                name="officeLandlineNumber"
                placeholder="Office Landline Number"
                onChange={handleWorkDetailsChange}
                value={workDetails.officeLandlineNumber}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Employee Code
              </p>
              <input
                type="text"
                name="employeeCode"
                placeholder="Employee Code"
                value={workDetails.employeeCode}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                disabled
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Leave Rule
              </p>

              <select
                name="leaveRule"
                onChange={handleWorkDetailsChange}
                value={workDetails.leaveRule._id}
                className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              >
                <option>please select</option>
                {leaveRule?.map((rule) => (
                  <option value={rule?._id}>{rule.leaveRuleName}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Reporting Manager
              </p>
              <input
                type="text"
                name="reportingManager"
                placeholder="Reporting Manager"
                onChange={handleWorkDetailsChange}
                value={workDetails.reportingManager}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Shift
              </p>
              <select
                name="shift"
                placeholder="Shift"
                onChange={handleWorkDetailsChange}
                value={workDetails.shift}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              >
                <option>please select</option>
                <option value={"Day"}>Day</option>
              </select>
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Department
              </p>
              {/* Assuming departmentOptions is an array of department options */}
              <select
                name="department"
                onChange={handleWorkDetailsChange}
                value={workDetails.department._id}
                className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              >
                <option value={""}>Please Select</option>
                {department?.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Designation
              </p>
              <select
                name="designation"
                onChange={handleWorkDetailsChange}
                value={workDetails.designation._id}
                className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              >
                <option value={""}>Please Select</option>
                {designation?.map((designation) => (
                  <option key={designation._id} value={designation._id}>
                    {designation.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Grade
              </p>
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                onChange={handleWorkDetailsChange}
                value={workDetails.grade}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Employee Type
              </p>
              <select
                name="employeeType"
                onChange={handleWorkDetailsChange}
                value={workDetails.employeeType}
                className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              >
                <option value="">Please Select</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Third Party">Third Party</option>
                <option value="Consultant">Consultant</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Company
              </p>
              <input
                type="text"
                name="company"
                placeholder="Company"
                onChange={handleWorkDetailsChange}
                value={workDetails.company}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Location
              </p>
              <input
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleWorkDetailsChange}
                value={workDetails.location}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Biomertic ID
              </p>
              <input
                type="text"
                name="biomerticId"
                placeholder="Biomertic ID"
                onChange={handleWorkDetailsChange}
                value={workDetails.biomerticId}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Hiring Source
              </p>
              <input
                type="text"
                name="hiringSource"
                placeholder="Hiring Source"
                onChange={handleWorkDetailsChange}
                value={workDetails.hiringSource}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Probation Status
              </p>
              <input
                type="text"
                name="probationStatus"
                placeholder="Probation Status"
                onChange={handleWorkDetailsChange}
                value={workDetails.probationStatus}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
            <div className="w-full">
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                Source of Verification
              </p>
              <input
                type="text"
                name="sourceOfVerification"
                placeholder="Source of Verification"
                onChange={handleWorkDetailsChange}
                value={workDetails.sourceOfVerification}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
              />
            </div>
          </div>
          {/* ----------------------------Work Experince details-------------------------------------- */}
          <div className="">
            <br />
            <h4>Work Experience Details</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded divide-gray-200">
                {/* Table header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous Company Name
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From Date
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="bg-white divide-gray-200">
                  {workXp?.map((item) => (
                    <tr key={item._id} className=" hover:bg-gray-100">
                      <td className="px-2 py-2 whitespace-nowrap">
                        {item.previousCompanyName}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {item.jobTitle}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {new Date(item.fromDate).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {new Date(item.toDate).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Edit record popover */}
              {editingItem && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                  <div className="bg-white p-10 rounded max-w-md relative">
                    <h4 className="text-lg font-semibold mb-4">Edit Detail</h4>

                    <button
                      onClick={handleCancelEdit}
                      className="absolute top-4 right-4 text-red-400  px-4 py-2 rounded hover:text-white hover:bg-red-600 "
                    >
                      Cancel
                    </button>
                    {/* Input fields for editing */}
                    <input
                      type="text"
                      name="previousCompanyName"
                      value={editedData.previousCompanyName}
                      onChange={handleInputChange}
                      placeholder="Previous Company Name"
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                    />
                    <input
                      type="text"
                      name="jobTitle"
                      value={editedData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Job Title"
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                    />
                    <input
                      type="date"
                      name="fromDate"
                      value={editedData.fromDate.split("T")[0]}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                    />
                    <input
                      type="date"
                      name="toDate"
                      value={editedData.toDate.split("T")[0]}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                    />

                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-green-400 mt-2 text-white rounded hover:bg-green-500"
                    >
                      {btnLoader ? (
                        <span
                          className="loading loading-spinner loading-sm
                      "
                        ></span>
                      ) : (
                        "Update"
                      )}
                    </button>

                    <button
                      onClick={() => handledelete(editedData._id)}
                      className="px-4 py-2 ml-2 bg-red-400 mt-2 text-white rounded hover:bg-red-600"
                    >
                      {deleteLoader ? (
                        <span
                          className="loading loading-spinner loading-sm
                      "
                        ></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <br />
            {workExperiences.map((experience, index) => (
              <div>
                <div className="mt-2 flex w-full justify-between">
                  <p>record</p>
                  <div className="">
                    <button
                      onClick={() => handleRemove(index)}
                      className="block hover:bg-red-400 text-red-700 font-semibold hover:text-white py-2 px-4 border-1 border-red-400 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-items-center"
                >
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Previous Company Name
                    </p>
                    <input
                      type="text"
                      name="previousCompanyName"
                      placeholder="Previous Company Name"
                      onChange={(e) => handleWorkExperienceChange(e, index)}
                      value={experience.previousCompanyName}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Job Title
                    </p>
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Job Title"
                      onChange={(e) => handleWorkExperienceChange(e, index)}
                      value={experience.jobTitle}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      From Date
                    </p>
                    <input
                      type="date"
                      name="fromDate"
                      onChange={(e) => handleWorkExperienceChange(e, index)}
                      value={experience.fromDate}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      To Date
                    </p>
                    <input
                      type="date"
                      name="toDate"
                      onChange={(e) => handleWorkExperienceChange(e, index)}
                      value={experience.toDate}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div></div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddMore}
              className="block mt-3 hover:bg-green-400 text-green-700 font-semibold hover:text-white py-2 px-4 border-1 border-green-400 rounded"
            >
              Add More
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col-reverse">
          <div>
            <button
              type="button"
              className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={workDetails_submit}
            >
              Save & Next
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

export default WorkDetail;
