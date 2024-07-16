"use client";

import {
  getAllLeaves,
  deleteLeave,
  getOneLeave,
  leaveStatusApprove,
  leaveStatusReject,
} from "@/helpers/Services/Leave_services";
import { getFullname } from "@/helpers/Services/user_services";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Tooltip } from "@nextui-org/react";

function page() {
  const [leave_data, setLeaves_data] = useState(null);
  const [leave, setLeave] = useState(null);
  const [user_data, setUser_data] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverOpenReject, setIsPopoverOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [approvalName, setRoleName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const getLeaveList = async () => {
    try {
      const res = await getAllLeaves();
      console.log("getLeaveList:", res);
      if (res.status === 200) {
        setLeaves_data(res.data);
      } else {
        console.log("error while getting data");
        toast.warning("Something went wrong with the server");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal error");
    }
  };

  const getUserList = async () => {
    try {
      const res = await getFullname();
      console.log("user list", res);
      setUser_data(res.data);
      console.log("user_data...", user_data);
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  const getLeave = async (userId) => {
    try {
      setIsPopoverOpen(true);
      const res = await getOneLeave(userId);
      console.log("gett leave", res.data);
      setLeave(res.data);
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken" || "");
    if (token) {
      const decoded = jwtDecode(token);
      setRoleName(decoded.firstName + " " + decoded.lastName);
    }
    getLeaveList();
    // getLeave();
    getUserList();
  }, []);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
  };

  const getEmployeeById = (empId) => {
    const employee = user_data.find((employee) => employee._id === empId);
    return employee ? employee.fullName : "Unknown";
  };

  const getApproverById = (empId) => {
    const employee = user_data.find((employee) => employee._id === empId);
    return employee ? employee.fullName : "Not Approve";
  };

  // Function to handle deletion
  const handleDelete = async (deleteId) => {
    try {
      const res = await deleteLeave(deleteId); // Call delete API
      if (res.status === 200) {
        // If deletion is successful, refresh department list
        getLeaveList();
        toast.success("Leave deleted successfully");
      } else {
        console.error("Error while deleting record:", res);
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Internal error:", error);
      toast.error("Internal error ");
    }
  };

  // const handleUpdate = (leave) => {
  //   setSelectedLeave(leave);
  //   setIsPopoverOpen(true);
  // };
  // let leaveId = leave?.leave._id;
  // const data = {
  //   userId: leaveId,
  //   rejectReason: rejectReason
  // };
  // console.log("data", data);
  const handleRejectStatus = async () => {
    // setIsPopoverOpenReject(true);
    try {
      // let leaveId = leave?.leave._id;
      const data = {
        leaveID: selectedLeaveId,
        rejectReason: rejectReason,
        approvalName: approvalName,
      };
      console.log("data", data);
      console.log("userID", data.userId);
      const res = await leaveStatusReject(data);
      console.log("res.data)", res.data);
      // setLeave(res.data);
      if (res.status === 200) {
        console.log("user leave........", res.data);
        getLeaveList();
        toast.success("Leave Reject Successfully");
      }

      setIsPopoverOpen(false);
      setIsPopoverOpenReject(false);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleApproveStatus = async (userID) => {
    try {
      console.log("userID", userID);
      console.log("approvalName", approvalName);
      const res = await leaveStatusApprove(userID, {
        approvalName: approvalName,
      });
      setLeave(res.data);
      if (res.status === 200) {
        console.log("user leave........", res.data);
        getLeaveList();
        toast.success("Leave Approved Successfully");
      }
      setIsPopoverOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  const openRejectLeave = (id) => {
    console.log("reject leave id", id);
    setSelectedLeaveId(id);
    setIsPopoverOpenReject(true);
  };

  const closeRejectLeave = () => {
    setIsPopoverOpenReject(false);
    setRejectReason("");
  };

  const closeLeaveDetails = () => {
    setIsPopoverOpen(false);
  };

  return (
    <div>
      <div>
        <div className="card">
          {leave_data ? (
            <div className="card-body">
              <div className="flex justify-end">
                <Link href="/dashboard/leave/manageLeave">
                  <button className="btn btn-primary flex items-center justify-center text-center">
                    <span className="flex items-center">
                      <i class="ti ti-solid ti-list-check px-1"></i>
                      {/* <i class=" ti ti-duotone ti-bars ti-progress"></i> */}
                      <span className="mr-2">Manage Leave</span>
                    </span>
                  </button>
                </Link>
              </div>
              <p className="text-2xl font-bold mb-6">Leave List</p>
              {/* {JSON.stringify(leave_data)} */}
              <table className="min-w-full border rounded">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Employee Name</th>
                    <th className="py-2 px-4">Request Type</th>
                    <th className="py-2 px-4">Request Raised Date</th>
                    <th className="py-2 px-4">Approver Name</th>
                    <th className="py-2 px-5">Applied Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {leave_data.map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-blue-300">
                      <td className="py-2 px-4">
                        {getEmployeeById(leave.userID)}
                      </td>
                      <td className="py-2 px-4">{leave.leaveType}</td>
                      <td className="py-2 px-4">
                        {formattedDate(leave.createdAt)}
                      </td>
                      <td className="py-2 px-4">
                        {leave.status === "Pending"
                          ? approvalName
                          : leave.approvalName}
                      </td>
                      {leave.numberOfDays === 1 && (
                        <td className="py-2 px-4 relative">
                          <>{formattedDate(leave.selectedDates[0].startDate)}</>
                        </td>
                      )}
                      {leave.numberOfDays > 1 && (
                        <Tooltip
                          showArrow={true}
                          content={
                            <div>
                              <ul>
                                <p className="text-center">Applied Date</p>
                                <hr />
                                {/* Loop through each selected date */}
                                {leave.selectedDates.map((date, index) => {
                                  const startDate = new Date(date.startDate);
                                  const endDate = new Date(date.endDate);
                                  const dates = [];

                                  // Generate all dates between start and end date
                                  for (
                                    let currentDate = startDate;
                                    currentDate <= endDate;
                                    currentDate.setDate(
                                      currentDate.getDate() + 1
                                    )
                                  ) {
                                    dates.push(new Date(currentDate));
                                  }

                                  return dates.map((dateItem, index) => (
                                    <div>
                                      <li key={index} py-1 px-1>
                                        {formattedDate(dateItem)}&nbsp;-&nbsp;
                                        {date.time}
                                      </li>
                                    </div>
                                  ));
                                })}
                              </ul>
                            </div>
                          }
                        >
                          <td className="py-2 px-4 relative">
                            {formattedDate(leave.selectedDates[0].startDate)}
                            <sup className="text-blue-600 hover:text-white cursor-pointer">
                              &nbsp;&nbsp;+{leave.numberOfDays - 1}
                            </sup>{" "}
                          </td>
                        </Tooltip>
                      )}
                      <td
                        className={`py-2 px-4 ${
                          leave.status === "Pending"
                            ? "text-yellow-400"
                            : leave.status === "Approved"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {leave.status}
                      </td>
                      <td className="py-2 px-4 flex justify-center">
                        <i
                          className="ti ti-regular ti-eye py-2 px-2  hover:text-red-600 cursor-pointer"
                          onClick={() => getLeave(leave._id)}
                        ></i>
                        <i
                          className="ti ti-regular ti-trash py-2 px-2  hover:text-red-600 cursor-pointer"
                          onClick={() => handleDelete(leave._id)}
                        ></i>
                        {/* <div className="dropdown dropdown-left dropdown-end">
                          <div
                            tabIndex={0}
                            role="button"
                            className="rounded p-2 "
                          >
                            Click
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-blue-100 rounded w-42"
                          >
                            <li>
                              <div onClick={() => getLeave(leave._id)}>
                                View
                              </div>
                            </li>
                            <li>
                              <div onClick={() => handleDelete(leave._id)}>
                                Delete
                              </div>
                            </li>
                          </ul>
                        </div> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-10 w-full">
              <br />
              <div className="skeleton h-32 w-full"></div>
            </div>
          )}
        </div>
      </div>

      {isPopoverOpen && (
        // <div className="fixed inset-0 z-50 overflow-y-auto bg-black flex items-center justify-center">
        // <div className="bg-white p-10 rounded max-w-md relative overflow-y-auto max-h-screen">
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-5 p-10 rounded w-1/2 relative overflow-y-auto max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="mt-1 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300"
                  onClick={closeLeaveDetails}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <div className="flex">
              <h3>Leave</h3>&nbsp;
              <p
                className={`px-1 mt-1 rounded ${
                  leave?.leave?.status === "Pending"
                    ? "bg-yellow-400 border"
                    : leave?.leave?.status === "Approved"
                    ? "bg-green-400 border"
                    : "bg-red-400 border"
                }`}
              >
                {leave?.leave?.status}
              </p>
            </div>
            <p>
              Raised by: {getEmployeeById(leave?.leave?.userID)} | Raised on:
              {formattedDate(leave?.leave?.createdAt)}
            </p>
            <div className="mt-3">
              <b>Applied Dates</b>
              <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full">
                <ul>
                  {/* Loop through each selected date */}
                  {leave?.leave?.selectedDates.map((date, index) => {
                    const startDate = new Date(date.startDate);
                    const endDate = new Date(date.endDate);
                    const dates = [];

                    // Generate all dates between start and end date
                    for (
                      let currentDate = startDate;
                      currentDate <= endDate;
                      currentDate.setDate(currentDate.getDate() + 1)
                    ) {
                      dates.push(new Date(currentDate));
                    }

                    return dates.map((dateItem, index) => (
                      <li key={index} className="flex justify-between">
                        <p>{formattedDate(dateItem)}</p>
                        <p>{date.time}</p>
                      </li>
                    ));
                  })}
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <b>Leaves</b>
              <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full">
                <div className="flex">
                  <p className="w-1/2">
                    <h6>Leave Type</h6>
                  </p>
                  <p className="w-1/2 text-right">
                    <h6>Leave Balance</h6>
                  </p>
                </div>
                <div className="flex">
                  <p className="w-1/2">{leave?.leave?.leaveType}</p>
                  <p className="w-1/2 text-right">
                    {leave?.leave?.currentBalance}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <b>Reason</b>
              <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full">
                {leave?.leave?.leaveReason}
              </div>
            </div>
            {leave?.leave?.status == "Rejected" && (
              <div>
                <div className="mt-3 mb-1">
                  <b>Approver Update Details</b>
                  <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full">
                    <div className="flex">
                      <p className="w-1/3">
                        <h6>Rejected By</h6>
                      </p>
                      <p className="w-1/3 text-center">
                        <h6>Reason</h6>
                      </p>
                      <p className="w-1/3 text-right">
                        <h6>Date</h6>
                      </p>
                    </div>
                    <div className="flex">
                      <p className="w-1/3">{leave?.leave?.approvalName}</p>
                      <p className="w-1/3 text-center">
                        {leave?.leave?.rejectReason}
                      </p>
                      <p className="w-1/3 text-right">
                        {formattedDate(leave?.leave?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {leave?.leave?.status == "Approved" && (
              <div>
                <div className="mt-3 mb-3">
                  <b>Approver Update Details</b>
                  <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full">
                    <div className="flex">
                      <p className="w-1/2">
                        <h6>Approved By</h6>
                      </p>
                      <p className="w-1/2 text-right">
                        <h6>Date</h6>
                      </p>
                    </div>
                    <div className="flex">
                      <p className="w-1/2">{leave?.leave?.approvalName}</p>
                      <p className="w-1/2 text-right">
                        {formattedDate(leave?.leave?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {leave?.leave?.status == "Pending" && (
              <div>
                <div className="mt-3">
                  <b>Approver Update By</b>
                  <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full">
                    {approvalName}
                  </div>
                </div>
                <div className="flex justify-end mt-3 mb-3">
                  <button
                    type="button"
                    onClick={() => openRejectLeave(leave?.leave._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Reject
                  </button>
                  {/* {JSON.stringify(leave?.leave)} */}
                  <button
                    type="submit"
                    onClick={() => handleApproveStatus(leave?.leave._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isPopoverOpenReject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-50  flex items-center justify-center">
          <div className="bg-white p-9 rounded">
            {/* <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current"
                  onClick={closeLeaveDetails}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div> */}
            <div className="flex">
              {/* {JSON.stringify(leave)} */}
              <h4 className="text-md font-semibold">
                Are you sure you want to reject this request?
              </h4>
              <button className="ml-5 -mt-3">
                <svg
                  className="swap-on mt--10 fill-current"
                  onClick={closeRejectLeave}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <div className="flex">
              <h6>Employee will be notified about the rejection of request.</h6>
            </div>
            <div onSubmit={handleRejectStatus}>
              <div className="mb-2 mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <input
                  type="text"
                  name="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-1 p-1 border border-gray-300 rounded input-bordered w-full"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeRejectLeave}
                  className="px-4 py-2 bg-gray-300 rounded text-white input-bordered text-md focus:outline-none mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectStatus}
                  className="px-4 py-2 bg-red-500 text-white rounded input-bordered text-md focus:outline-none "
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
    </div>
  );
}

export default page;
