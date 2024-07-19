"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { DateRangePicker } from "@nextui-org/react";
import {
  getApplyLeave,
  getLeaveBalance,
  getLeaveTypesByLeaveRule,
  getSelectedLeaveRule,
} from "@/helpers/Services/Leave_services";
import {
  getAllHoliday,
  getCalendarData,
} from "@/helpers/Services/Holiday_services";
import { validateLeaveRequestForm } from "@/app/myDashboard/validations/leaveValidation";
import { toast } from "react-toastify";
import { DatePicker, Badge, Calendar } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

export default function Page() {
  const router = useRouter();
  const [cellRender, setCellRender] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [leaveData, setLeaveData] = useState({
    userID: "",
    leaveType: "",
    selectedDates: [{ startDate: "", endDate: "", time: "" }],
    leaveReason: "",
    proof: "",
  });
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [decoded, setDecode] = useState("");
  const [leaveRule, setLeaveRule] = useState(null);
  const [totalAppliedDay, setTotalAppliedDay] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [holiday_data, setHoliday_data] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("token", token);
    let decode = "";
    if (token) {
      decode = jwtDecode(token);
      setDecode(decode);
      console.log("decoded", decoded);
      // setLeaveData((prevLeaveData) => ({
      //   ...prevLeaveData,
      //   userID: decoded.id,
      // }));
      // Fetch leave balance here
      // fetchLeaveBalance(decoded.id);
    } else {
      console.log("Token not found");
      router.push("/login");
    }

    if (decode) {
      console.log("decoded.id)", decode.id);
      getHolidayList(decode.id);
    }

    // if (leaveData) {
    //   for (let i = 0; i < leaveData.selectedDates.length; i++) {
    //     if (!leaveData.selectedDates[i].endDate) {
    //       leaveData.selectedDates[i].endDate =
    //         leaveData.selectedDates[i].startDate;
    //     }
    //   }

    // }

    // let totalAppliedDay_ = 0;
    // let totalLeaves_ = leaveData.selectedDates.reduce((total, dateRange) => {
    //   const startDate = new Date(dateRange.startDate);
    //   const endDate = new Date(dateRange.endDate);
    //   const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    //   if (dateRange.time === "Full Day") {
    //     totalAppliedDay_ += daysDiff;
    //     return total + daysDiff;
    //   } else {
    //     totalAppliedDay_ += daysDiff;
    //     return total + (daysDiff / 2);
    //   }
    // }, 0);

    // setTotalAppliedDay(totalAppliedDay_);
    // setTotalLeaves(totalLeaves_);

    // fetchLeaveTypes(decoded.id);
  }, []);

  console.log("UserID", leaveData.userID);
  console.log("leaveRule", leaveRule);
  console.log("holiday_data", holiday_data);
  // const fetchLeaveBalance = async (userID) => {
  //   try {
  //     // Make API call to get leave balance
  //     // Example API call:
  //     console.log("start");
  //     const response = await getLeaveBalance(userID);
  //     console.log("response", response);
  //     // const data = await response.json();
  //     setLeaveBalance(response.data);
  //     console.log("leaveBalance", leaveBalance);
  //     // Dummy data for demonstration
  //     // setLeaveBalance({
  //     //   sick: 10,
  //     //   casual: 20,
  //     //   earned: 15,
  //     // });
  //   } catch (error) {
  //     console.error("Error fetching leave balance:", error);
  //   }
  // };

  const fetchLeaveTypes = async (userID) => {
    try {
      // Make API call to get leave balance
      // Example API call:
      console.log("userIDuserID", userID);
      console.log("startttttt");
      const response = await getLeaveTypesByLeaveRule(userID);
      console.log("response", response);
      // const data = await response.json();
      setLeaveType(response.data);
      console.log("leaveType", leaveType);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  };

  const handleLeaveRule = async (userId, leaveTypeId) => {
    if (userId && leaveTypeId) {
      try {
        const response = await getSelectedLeaveRule(userId, leaveTypeId);
        console.log("response", response);
        // const data = await response.json();
        setLeaveRule(response.data);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    } else {
      console.log("something wrong");
    }
  };

  const handleLeaveClick = () => {
    setIsPopoverOpen(true);
    fetchLeaveTypes(decoded.id);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setLeaveData({
      userID: leaveData.userID,
      leaveType: "",
      selectedDates: [{ startDate: "", endDate: "", time: "" }],
      leaveReason: "",
      proof: "",
    });
    setLeaveRule(null);
  };
  const [newLeaveTypeID, setNewLeaveTypeID] = useState("");
  var newLeaveType = "";
  const handleLeaveType = async (e) => {
    newLeaveType = e.target.value;
    setNewLeaveTypeID(newLeaveType);
    setLeaveData((prevState) => {
      const updatedLeaveData = { ...prevState, leaveType: newLeaveType };
      handleLeaveRule(decoded.id, newLeaveType);
      return updatedLeaveData;
    });
  };

  const handleAddDate = () => {
    setLeaveData({
      ...leaveData,
      selectedDates: [
        ...leaveData.selectedDates,
        { startDate: "", endDate: "", time: "" },
      ],
    });
  };

  const handleDateChange = (index, field, value) => {
    const newDate = new Date(value);

    // Check if the selected date is a Sunday
    if (newDate.getDay() === 0 || newDate.getDay() === 6) {
      toast.error("Please choose another date.");
      return;
    }
    const newDates = [...leaveData.selectedDates];
    newDates[index][field] = value;
    setLeaveData({
      ...leaveData,
      selectedDates: newDates,
    });
    if (leaveData) {
      for (let i = 0; i < leaveData.selectedDates.length; i++) {
        if (!leaveData.selectedDates[i].endDate) {
          leaveData.selectedDates[i].endDate =
            leaveData.selectedDates[i].startDate;
        }
      }
    }

    let totalAppliedDay_ = 0;
    let totalLeaves_ = leaveData.selectedDates.reduce((total, dateRange) => {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const daysDiff =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      if (dateRange.time === "Full Day") {
        totalAppliedDay_ += daysDiff;
        return total + daysDiff;
      } else {
        totalAppliedDay_ += daysDiff;
        return total + daysDiff / 2;
      }
    }, 0);

    setTotalAppliedDay(totalAppliedDay_);
    setTotalLeaves(totalLeaves_);
  };

  const handleRemoveDate = (index) => {
    const newDates = [...leaveData.selectedDates];
    newDates.splice(index, 1);
    setLeaveData({
      ...leaveData,
      selectedDates: newDates,
    });
  };

  const handleFileChange = (e) => {
    setLeaveData({ ...leaveData, proof: e.target.files?.[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if leave type is selected
    if (!leaveData.leaveType) {
      toast.error("Please Select Leave Type");
      return;
    }
    if (leaveData) {
      // Calculate total leaves and total applied days

      // Check for minimum leaves requirement
      if (leaveRule.leaveRestriction.minLeavesAtATime < totalAppliedDay) {
        toast.error(
          `You cannot select more than ${leaveRule.leaveRestriction.minLeavesAtATime} days for leaves`
        );
        return;
      }

      // Check sufficient leave balance
      const data = leaveType.find((type) => type.id === newLeaveTypeID);
      if (data) {
        const { negativeLeaveAllowed, maxNegativeLeaveCount } =
          leaveRule.advanceSettings;

        if (negativeLeaveAllowed === "No" && data.totalLeaves < totalLeaves) {
          toast.error(`Insufficient balance`);
          return;
        }
        console.log(
          "san",
          data.totalLeaves,
          maxNegativeLeaveCount,
          totalLeaves
        );
        if (
          negativeLeaveAllowed === "Yes" &&
          data.totalLeaves + maxNegativeLeaveCount < totalLeaves
        ) {
          toast.error(
            `Insufficient balance: ${totalLeaves} leaves requested, ${data.totalLeaves} available, max negative allowed: ${maxNegativeLeaveCount}`
          );
          return;
        }
      } else {
        toast.error(`Leave type not found`);
        return;
      }

      // Check date restrictions
      for (let i = 0; i < leaveData.selectedDates.length; i++) {
        const currentDate = new Date();
        const startDate = new Date(leaveData.selectedDates[i].startDate);
        const endDate = new Date(leaveData.selectedDates[i].endDate);

        const diffInDaysPast = Math.ceil(
          (currentDate - startDate) / (1000 * 60 * 60 * 24)
        );

        if (
          diffInDaysPast >
            leaveRule.leaveRestriction.countOfBackDatedLeaveRestriction &&
          leaveRule.leaveRestriction.isRestrictionWhileApplyingLeave &&
          leaveRule.leaveRestriction.backDatedLeaveRestriction === "Yes"
        ) {
          toast.error(
            `You can only select up to ${
              leaveRule.leaveRestriction.countOfBackDatedLeaveRestriction
            } past days. Check selected date ${i + 1}'s start date.`
          );
          return;
        }

        const diffInDaysFuture = Math.ceil(
          (startDate - currentDate) / (1000 * 60 * 60 * 24)
        );

        if (
          diffInDaysFuture >
            leaveRule.leaveRestriction.countOffutureDatedLeavesBeforeDays &&
          leaveRule.leaveRestriction.isRestrictionWhileApplyingLeave &&
          leaveRule.leaveRestriction.priorNoticeForFutureLeaves === "Yes"
        ) {
          toast.error(
            `You can only select up to ${
              leaveRule.leaveRestriction.countOffutureDatedLeavesBeforeDays
            } future days. Check selected date ${i + 1}'s start date.`
          );
          return;
        }

        // Additional validations
        if (!leaveData.selectedDates[i].startDate) {
          toast.error(`Please select start date for selected date ${i + 1}`);
          return;
        }
        if (!leaveData.selectedDates[i].endDate) {
          leaveData.selectedDates[i].endDate =
            leaveData.selectedDates[i].startDate;
        }
        if (
          leaveData.selectedDates[i].endDate <
          leaveData.selectedDates[i].startDate
        ) {
          toast.error(
            `Start date cannot be bigger than end date for selected date ${
              i + 1
            }`
          );
          return;
        }
        if (!leaveData.selectedDates[i].time) {
          toast.error(`Please select time for selected date ${i + 1}`);
          return;
        }
      }

      // Check for duplicate dates
      const dateSet = new Set();
      for (let i = 0; i < leaveData.selectedDates.length; i++) {
        const dateRange = leaveData.selectedDates[i];
        const startDate = new Date(dateRange.startDate).toDateString();
        const endDate = new Date(dateRange.endDate).toDateString();

        for (
          let date = new Date(startDate);
          date <= new Date(endDate);
          date.setDate(date.getDate() + 1)
        ) {
          const dateString = date.toDateString();
          // Check if the selected date is a Sunday
          // if (date.getDay() === 0) {
          //   toast.error(
          //     "Sundays are not selectable. Please choose another date."
          //   );
          //   return;
          // }
          if (dateSet.has(dateString)) {
            toast.error(
              `Date ${dateString} already selected. Check selected date ${
                i + 1
              }`
            );
            return;
          }
          dateSet.add(dateString);
        }
      }

      // Ensure user ID and leave reason are provided
      if (!leaveData.userID) {
        leaveData.userID = decoded.id;
      }
      if (!leaveData.leaveReason) {
        toast.error("Please enter leave reason");
        return;
      }

      // Check for proof requirement
      if (
        leaveRule.advanceSettings.proofRequiredForLeaveRequest === "Yes" &&
        leaveRule.advanceSettings.proofRequiredExceedingDays <=
          totalAppliedDay &&
        !leaveData.proof
      ) {
        toast.error("Proof is required");
        return;
      }
    }
    try {
      const data = {
        userID: leaveData.userID,
        leaveType: leaveData.leaveType,
        selectedDates: leaveData.selectedDates,
        leaveReason: leaveData.leaveReason,
        proof: leaveData.proof,
      };

      const error = validateLeaveRequestForm(data);
      if (error) {
        return toast.error(error);
      } else {
        const res = await getApplyLeave(data);
        if (res.status === 201) {
          toast.success("Leave applied successfully");
          handleClosePopover();
          // fetchLeaveTypes(leaveData.userID);
          getHolidayList(decoded.id);
        } else {
          toast.error(res.response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const holidays = [
    { date: "2024-06-01", name: "New Year's Day" },
    { date: "2024-06-04", name: "Independenc Day" },
    { date: "2024-06-25", name: "Christmas D" },
    // Add more holidays as needed
  ];
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDate = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      console.log("Formatted Date:", formattedDate);
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null); // Handle the case when the date is cleared
    }
  };

  const disabledDate = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const holiday = holiday_data?.holidays?.find(
      (h) => dayjs(h.date).format("YYYY-MM-DD") === formattedDate
    );
    return date.day() === 0 || date.day() === 6 || holiday; // Disable Sundays and Saturdays
  };

  const dateFullCellRender = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const holiday = holiday_data?.holidays.find(
      (h) => dayjs(h.date).format("YYYY-MM-DD") === formattedDate
    );
    const pending = holiday_data?.pendingLeaves.find(
      (h) => dayjs(h.date).format("YYYY-MM-DD") === formattedDate
    );
    const approved = holiday_data?.approvedLeaves.find(
      (h) => dayjs(h.date).format("YYYY-MM-DD") === formattedDate
    );
    const present = holiday_data?.presentDates.find(
      (h) => dayjs(h.date).format("YYYY-MM-DD") === formattedDate
    );

    const isWeekend = disabledDate(date);

    const dateCellStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100px", // Fixed height
      width: "115px", // Fixed width
      padding: "6px",
      boxSizing: "border-box", // Ensure padding doesn't affect size
      overflow: "hidden", // Hide overflow content
    };

    const dateNumberStyle = {
      alignSelf: "flex-end",
      fontSize: "12px",
      color: "#888",
    };

    if (holiday) {
      return (
        <div
          className="rounded border"
          style={{ ...dateCellStyle, backgroundColor: "#85C1E9 " }}
        >
          <div
            className="p-1 px-1 bg-red-500 rounded-full text-red-500"
            style={dateNumberStyle}
          >
            {date.date()}
          </div>
          <div
            className="flex-1 px-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              color: "white",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {holiday.name}
            <br />
          </div>
        </div>
      );
    }
    if (pending) {
      return (
        <div
          className="rounded border"
          style={{ ...dateCellStyle, backgroundColor: "#FADBD8" }}
        >
          <div className="py-1 px-1" style={dateNumberStyle}>
            {date.date()}
          </div>
          <div
            className="flex-1 px-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              color: "gray",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {pending.status} <br />({pending.time})
          </div>
        </div>
      );
    }
    if (approved && approved.time === "Full Day") {
      return (
        <div
          className="rounded border"
          style={{ ...dateCellStyle, backgroundColor: "#CD6155" }}
        >
          <div className="py-1 px-1 text-white" style={dateNumberStyle}>
            {date.date()}
          </div>
          <div
            className="flex-1 px-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              color: "white",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {/* {approved.status} */}Absent
            <br />({approved.time})
          </div>
        </div>
      );
    }
    if (
      approved &&
      (approved.time === "First Half" || approved.time === "Second Half")
    ) {
      return (
        <div
          className="rounded border"
          style={{ ...dateCellStyle, backgroundColor: "#F7DC6F" }}
        >
          <div className="py-1 px-1 " style={dateNumberStyle}>
            {date.date()}
          </div>
          <div
            className="flex-1 px-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              color: "gray",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {approved.status} <br />({approved.time})
          </div>
        </div>
      );
    }
    if (present) {
      return (
        <div
          className="rounded border"
          style={{ ...dateCellStyle, backgroundColor: "#2ECC71 " }}
        >
          <div className="py-1 px-1 text-white" style={dateNumberStyle}>
            {date.date()}
          </div>
          <div
            className="flex-1 px-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              color: "white",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {present.status}
          </div>
        </div>
      );
    }

    if (isWeekend) {
      return (
        <div
          className="rounded border"
          style={{ ...dateCellStyle, backgroundColor: "#BB8FCE" }}
        >
          <div className="py-1 px-1 text-white " style={dateNumberStyle}>
            {date.date()}
          </div>
          <div
            className="flex-1 px-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              color: "white",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            Week off
          </div>
        </div>
      );
    }

    return (
      <div className="rounded border" style={dateCellStyle}>
        <div className="py-1 px-1" style={dateNumberStyle}>
          {date.date()}
        </div>
      </div>
    );
  };

  const CalendarHeader = () => {
    // const statuses = [
    //   { label: "Full Day", color: "#00FF00" },
    //   { label: "Half Day", color: "#FFFF00" },
    //   { label: "Less than half day", color: "#FFA500" },
    //   { label: "Absent", color: "#FF0000" },
    //   { label: "Week Off", color: "#A9A9A9" },
    //   { label: "Holiday", color: "#FFD700" },
    //   { label: "Restricted Holiday", color: "#ADD8E6" },
    //   { label: "Pending Request", color: "#FFC0CB" },
    //   { label: "Late Coming", color: "#8A2BE2" },
    //   { label: "Early Going", color: "#8B0000" },
    // ];
    const statuses = [
      { label: "Present", color: "#2ECC71" },
      { label: "Half Day", color: "#F7DC6F" },
      { label: "Less than half day", color: "#FFA500" },
      { label: "Absent", color: "#CD6155" },
      { label: "Week Off", color: "#BB8FCE" },
      { label: "Holiday", color: "#85C1E9" },
      { label: "Restricted Holiday", color: "#ADD8E6" },
      { label: "Pending Request", color: "#FADBD8" },
      { label: "Late Coming", color: "#8A2BE2" },
      { label: "Early Going", color: "#8B0000" },
    ];
    return (
      <div className="flex flex-wrap bg-white px-4 py-1 rounded items-center justify-start">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center mr-4 mb-2">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: status.color,
                marginRight: "8px",
              }}
            ></span>
            <span className="text-sm">{status.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const getHolidayList = async (userID) => {
    try {
      const res = await getCalendarData(userID);
      console.log("Response:", res.data);
      if (res.status === 200) {
        setHoliday_data(res.data);
      } else {
        console.log(res.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal error");
    }
  };

  return (
    <div>
      <div className="flex justify-between mt-3 mb-3">
        <div>
          <h2 className="text-2xl ml-10">My Dashboard</h2>
          {/* {JSON.stringify(leaveType)} */}
        </div>
        <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
          <li className="nav-item dropdown">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-lg focus:outline-none mr-10"
              href=""
              id="drop2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              // onClick={handleLeaveClick}
            >
              Apply New
            </button>
            <div
              className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
              aria-labelledby="drop2"
            >
              <div className="message-body">
                <button
                  className="d-flex align-items-center gap-2 dropdown-item"
                  onClick={handleLeaveClick}
                >
                  <i className="ti ti-user fs-6"></i>
                  <p className="mb-0 fs-3">Leave</p>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="px-4 py-4 bg-gray-200">
        <div className="flex mb-4">
          <div className="w-2/3 border rounded">
            <Calendar
              className="bg-white rounded px-4 py-4"
              // fullscreen={false}
              onSelect={handleDate}
              fullCellRender={dateFullCellRender}
              disabledDate={disabledDate}
            />
            <CalendarHeader />
            {/* {selectedDate && <p>Selected Date: {selectedDate}</p>} */}
          </div>
          <div className="w-1/3 flex flex-col justify-between ml-5">
            <div className="h-1/2 border rounded bg-white mb-4">
              <h6 className="px-2 py-2">Announcements</h6>
            </div>
            <div className="h-1/2 border rounded bg-white">
              <h6 className="px-2 py-2">Let’s get to work</h6>
            </div>
          </div>
        </div>
        <div className=" flex  ">
          <div className=" w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4 ">
            <h6>Pending Task</h6>
          </div>
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Attendance</h6>
          </div>
          <div className=" w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Leave</h6>
          </div>
        </div>
        <div className="flex ">
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Quick Link</h6>
          </div>
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Pending on Me</h6>
          </div>
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>My pending request</h6>
          </div>
        </div>
        <div className="flex ">
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Celebration</h6>
          </div>
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Holiday</h6>
          </div>
          <div className="w-1/3 h-80 border rounded bg-white my-4 mx-2 p-4">
            <h6>Insight</h6>
          </div>
        </div>
      </div>

      {isPopoverOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10  rounded max-w relative overflow-y-auto max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current "
                  onClick={handleClosePopover}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-md font-semibold mb-4">Leave Application</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Leave Type
                  {/* {JSON.stringify(leaveRule)} */}
                </label>
                <select
                  value={leaveData.leaveType}
                  onChange={(e) => {
                    handleLeaveType(e);
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded input-bordered w-full"
                >
                  <option value="">Select Leave Type</option>

                  {leaveType?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.leaveName}
                    </option>
                  ))}
                </select>
              </div>
              {leaveData.selectedDates.map((date, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Date {index + 1}
                  </label>
                  <div className="flex items-center">
                    <input
                      type="date"
                      value={date.startDate}
                      onChange={(e) =>
                        handleDateChange(index, "startDate", e.target.value)
                      }
                      className="mt-1 p-2 border border-gray-300 rounded input-bordered mr-2"
                    />
                    - &nbsp;
                    <input
                      type="date"
                      value={date.endDate}
                      onChange={(e) =>
                        handleDateChange(index, "endDate", e.target.value)
                      }
                      className="mt-1 p-2 border border-gray-300 rounded input-bordered mr-2"
                    />
                    <select
                      value={date.time}
                      onChange={(e) =>
                        handleDateChange(index, "time", e.target.value)
                      }
                      className="mt-1 mr-5p-2 border border-gray-300 rounded input-bordered"
                    >
                      <option value="">Select Time</option>
                      <option value="Full Day">Full Day</option>
                      {leaveRule &&
                        leaveRule.advanceSettings?.halfDayLeaveAllowed ===
                          "Yes" && (
                          <>
                            <option value="First Half">First Half</option>
                            <option value="Second Half">Second Half</option>
                          </>
                        )}
                    </select>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(index)}
                        className="text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDate}
                className="text-blue-500 mb-4"
              >
                Add Date
              </button>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <input
                  value={leaveData.leaveReason}
                  onChange={(e) =>
                    setLeaveData({ ...leaveData, leaveReason: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded input-bordered w-full"
                  rows="3"
                />
              </div>
              {/* <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Proof
                </label>
                <RangePicker  onChange={(e) =>
                    console.log("e.target.value",e.) }
                  />
                
              </div> */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Proof
                </label>
                <input
                  type="file"
                  name="proof"
                  onChange={handleFileChange}
                  className="mt-1 p-1 border border-gray-300 rounded input-bordered w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopover}
                  className="px-4 py-2 bg-red-500 text-white rounded input-bordered text-md focus:outline-none mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
                >
                  Submit
                </button>
              </div>
            </form>
            {/* Leave balance popover */}
            {/* <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Leave Balance</h4>
              <ul>
                <li>
                  Sick Leave:{" "}
                  <span
                    className={
                      leaveBalance.sick <= 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {leaveBalance.sick}
                  </span>
                </li>
                <li>
                  Casual Leave:{" "}
                  <span
                    className={
                      leaveBalance.casual <= 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {leaveBalance.casual} 
                  </span>
                </li>
                <li>
                  Earned Leave:{" "}
                  <span
                    className={
                      leaveBalance.earned <= 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {leaveBalance.earned}
                  </span>
                </li>
              </ul>
            </div> */}
            {/* End of leave balance popover */}
          </div>
        </div>
      )}
      {/* Leave balance popover */}
      {leaveData.leaveType && (
        <div className="fixed inset-y-0 right-0 z-50 bg-gray 800 mt-10 items-center mr-20">
          <div className="bg-white p-10 rounded input-bordered -mb-120">
            <h4 className="text-lg font-semibold mb-2">Leave Balance</h4>
            <ul className="space-y-1">
              {leaveType.map((leave) => (
                <li
                  key={leave.id}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{leave.leaveName}:</span>
                  <span
                    className={
                      leave.totalLeaves <= 0 ? "text-red-500" : "text-green-500"
                    }
                  >
                    {leave.totalLeaves}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* End of leave balance popover */}
    </div>
  );
}
