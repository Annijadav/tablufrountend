"use client";

import {
  getLeaveRules,
  deleteLeaveRule,
  postAddLeaveType,
  getLeaveTypes,
  updateBasicLeaveRule,
  updateLeaveDetailRule,
  updateLeaveRestrictionRule,
  updateAdvanceSettingsRule,
  updateLeaveRule,
  updateLeaveRuleStatus,
  getEmployeeListAsPerLeaveRule,
} from "@/helpers/Services/Leave_services";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Steps, Switch, Radio, Checkbox } from "antd";
import AddNewLeaveRule from "./Component/AddNewLeaveRule";

function page() {
  const [leaveRule_data, setLeaveRule_data] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAddLeaveType, setIsAddLeaveType] = useState(false);
  const [employeeListData, setEmployeeListData] = useState(null);

  const [leaveType, setLeaveType] = useState({
    basicLeave: {
      leaveName: "",
      status: "",
    },
    leaveDetail: {
      disbursementCycle: "",
      // disbursementTime: "",
      // isEnableTenureBasedOnLeaveDisbursement: "",
      // forTenure: [
      //   {
      //     lessThanYear: "",
      //     disburseLeaves: "",
      //   },
      // ],
      leaveCount: "",
      // leaveCountProbation: "",
      // isLeaveTypePaid: "",
      // isEncashLeaveBalance: "",
      // wantToRecoverTheExcessLeaveBalance: "",
      // gender: "",
      // maritalStatus: "",
      // isCarryForwardToNextDisbursementCycle: "",
      // isCarryForwardToNextYear: "",
      // setMaxCarryForwardLeave: "",
      // isLeaveDisbuseOnTenureCompletion: "",
    },
  });
  const items = [
    {
      title: "Basic Details",
    },
    {
      title: "Leave Details",
    },
    {
      title: "Leave Restrictions",
    },
    {
      title: "Advanced Settings",
    },
  ];

  // Function to handle adding a new tenure item
  const handleAddTenure = () => {
    setEditingLeaveType((prevState) => ({
      ...prevState,
      leaveDetail: {
        ...prevState.leaveDetail,
        forTenure: [
          ...prevState.leaveDetail.forTenure,
          { lessThanYear: "", disburseLeaves: "" },
        ],
      },
    }));
  };
  const handlRuleStatus = (e, id) => {
    toast.success(id + " data-" + e.target.value);
  };
  // Function to handle removing a tenure item
  const handleRemoveTenure = (indexToRemove) => {
    setEditingLeaveType((prevState) => ({
      ...prevState,
      leaveDetail: {
        ...prevState.leaveDetail,
        forTenure: prevState.leaveDetail.forTenure.filter(
          (_, index) => index !== indexToRemove
        ),
      },
    }));
  };

  // Function to handle changes in tenure input fields
  const handleTenureInputChange = (index, fieldName, value) => {
    setEditingLeaveType((prevState) => ({
      ...prevState,
      leaveDetail: {
        ...prevState.leaveDetail,
        forTenure: prevState.leaveDetail.forTenure.map((item, idx) => {
          if (idx === index) {
            return { ...item, [fieldName]: value };
          }
          return item;
        }),
      },
    }));
  };

  const [current, setCurrent] = useState(0);
  const [percent, setPercent] = useState(0);

  const getRuleLeaveList = async () => {
    try {
      const res = await getLeaveRules();
      console.log("Response:", res);
      if (res.status === 200) {
        setLeaveRule_data(res.data);
      } else {
        console.log("error while getting data");
        toast.warning("Something went wrong with the server");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal error");
    }
  };

  const getLeaveTypeList = async (id) => {
    try {
      const res = await getLeaveTypes(id);
      console.log("Response:", res);
      if (res.status === 200) {
        setEditingItem(res.data);
      } else {
        console.log("error while getting data");
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal error");
    }
  };

  const getEmployeeListByLeaveRule = async (id) => {
    try {
      const res = await getEmployeeListAsPerLeaveRule(id);
      console.log("Response:", res);
      if (res.status === 200) {
        setEmployeeListData(res.data);
      } else {
        console.log("error while getting data");
        toast.warning("Something went wrong with the server");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal error");
    }
  };

  useEffect(() => {
    getRuleLeaveList();
  }, []);

  const handleLeaveTypeStatusChange = (e, leaveId, status, leaveName) => {
    const { name, value } = e.target;
    const detailIndex = e.target.getAttribute("data-index");

    setEditingItem((prevItem) => ({
      ...prevItem,
      leaveDetails: prevItem.leaveDetails.map((detail, index) => {
        if (index === parseInt(detailIndex)) {
          return {
            ...detail,
            basicLeave: {
              ...detail.basicLeave,
              [name]: value,
            },
          };
        }
        return detail;
      }),
    }));
    // handleUpdateLeaveRuleStatus(leaves._id);
  };

  const handleDelete = async (roleId) => {
    try {
      setDeleteLoader(true);
      const res = await deleteLeaveRule(roleId);
      if (res.status === 200) {
        getRuleLeaveList();
        toast.success("Role deleted successfully");
        setEditingItem(null);
        toggleOverlayDelete();
      } else {
        console.error("Error while deleting record:", res);
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.error("Internal error:", error);
      toast.error("Internal error ");
    } finally {
      setDeleteLoader(false);
    }
  };

  const handleEdit = (role) => {
    setEditingItem(role);
  };
  const handleUpdateLeaveRule = async (leaveRuleId) => {
    if (leaveRuleId) {
      try {
        console.log("id", leaveRuleId);
        console.log("editingItem", editingItem._id);
        setUpdateLoader(true);
        const res = await updateLeaveRule(leaveRuleId, {
          leaveRuleName: editingItem.leaveRuleName,
        });
        if (res.status === 201) {
          console.log("res", res);

          toast.success(
            editingItem.leaveRuleName + " leave rule updated successfully"
          );
          setEditingItem(res.data);
          getLeaveTypeList(editingItem._id);
          getRuleLeaveList();
          toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrong..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleUpdateLeaveRuleStatus = async (
    leaveDetailId,
    status,
    leaveType
  ) => {
    if (leaveDetailId) {
      try {
        console.log("id", leaveDetailId);
        console.log("editingItem", editingItem._id);
        setUpdateLoader(true);
        const res = await updateLeaveRuleStatus(
          editingItem._id,
          leaveDetailId,
          {
            status: status,
          }
        );
        console.log("res", res);
        if (res.status === 201) {
          console.log("ressss", res);

          toast.success(leaveType + " status " + status);
          setEditingItem(res.data);
          await getRuleLeaveList();
          await getLeaveTypeList(editingItem._id);

          // handleUpdateLeaveRule(editingItem._id);
          // setEditingLeaveType(null);
          // toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrongwwww..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleUpdateBasicLeaveRule = async (leaveDetailId) => {
    if (leaveDetailId) {
      try {
        console.log("id", leaveDetailId);
        console.log("editingItem", editingItem._id);
        setUpdateLoader(true);
        const res = await updateBasicLeaveRule(editingItem._id, leaveDetailId, {
          leaveName: editingLeaveType.basicLeave.leaveName,
          status: editingLeaveType.basicLeave.status,
        });
        if (res.status === 201) {
          console.log("res", res);

          toast.success("Basic Leave Type updated successfully");
          setEditingItem(res.data);
          getLeaveTypeList(editingItem._id);
          setCurrent(1);
          setPercent(25);
          getRuleLeaveList();
          // setEditingLeaveType(null);
          // toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrong..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleUpdateLeaveDetailRule = async (leaveDetailId) => {
    if (leaveDetailId) {
      try {
        console.log("id", leaveDetailId);
        console.log("editingItem", editingItem._id);
        setUpdateLoader(true);
        const res = await updateLeaveDetailRule(
          editingItem._id,
          leaveDetailId,
          {
            disbursementCycle: editingLeaveType.leaveDetail.disbursementCycle,
            disbursementTime: editingLeaveType.leaveDetail.disbursementTime,
            isEnableTenureBasedOnLeaveDisbursement:
              editingLeaveType.leaveDetail
                .isEnableTenureBasedOnLeaveDisbursement,
            forTenure: editingLeaveType.leaveDetail.forTenure,
            leaveCount: editingLeaveType.leaveDetail.leaveCount,
            leaveCountProbation:
              editingLeaveType.leaveDetail.leaveCountProbation,
            isLeaveTypePaid: editingLeaveType.leaveDetail.isLeaveTypePaid,
            isEncashLeaveBalance:
              editingLeaveType.leaveDetail.isEncashLeaveBalance,
            wantToRecoverTheExcessLeaveBalance:
              editingLeaveType.leaveDetail.wantToRecoverTheExcessLeaveBalance,
            gender: editingLeaveType.leaveDetail.gender,
            maritalStatus: editingLeaveType.leaveDetail.maritalStatus,
            isCarryForwardToNextDisbursementCycle:
              editingLeaveType.leaveDetail
                .isCarryForwardToNextDisbursementCycle,
            isCarryForwardToNextYear:
              editingLeaveType.leaveDetail.isCarryForwardToNextYear,
            setMaxCarryForwardLeave:
              editingLeaveType.leaveDetail.setMaxCarryForwardLeave,
            isLeaveDisbuseOnTenureCompletion:
              editingLeaveType.leaveDetail.isLeaveDisbuseOnTenureCompletion,
          }
        );
        if (res.status === 201) {
          console.log("resss", res);
          toast.success("Leave detail updated successfully");
          setEditingItem(res.data);
          getLeaveTypeList(editingItem._id);
          setCurrent(2);
          setPercent(50);
          getRuleLeaveList();
          // setEditingLeaveType(null);
          // toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrong..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleUpdateLeaveRestrictionRule = async (leaveDetailId) => {
    if (leaveDetailId) {
      try {
        console.log("id", leaveDetailId);
        console.log("editingItem", editingItem._id);
        setUpdateLoader(true);
        const res = await updateLeaveRestrictionRule(
          editingItem._id,
          leaveDetailId,
          {
            probationLeavesAllowed:
              editingLeaveType.leaveRestriction.probationLeavesAllowed,
            probationLeaveVisibility:
              editingLeaveType.leaveRestriction.probationLeaveVisibility,
            noticePeriodLeavesAllowed:
              editingLeaveType.leaveRestriction.noticePeriodLeavesAllowed,
            roundOffLeaveBalance:
              editingLeaveType.leaveRestriction.roundOffLeaveBalance,
            isRestrictionWhileApplyingLeave:
              editingLeaveType.leaveRestriction.isRestrictionWhileApplyingLeave,
            backDatedLeaveRestriction:
              editingLeaveType.leaveRestriction.backDatedLeaveRestriction,
            countOfBackDatedLeaveRestriction:
              editingLeaveType.leaveRestriction
                .countOfBackDatedLeaveRestriction,
            priorNoticeForFutureLeaves:
              editingLeaveType.leaveRestriction.priorNoticeForFutureLeaves,
            countOffutureDatedLeavesBeforeDays:
              editingLeaveType.leaveRestriction
                .countOffutureDatedLeavesBeforeDays,
            isThierMaxLeavesPerMonth:
              editingLeaveType.leaveRestriction.isThierMaxLeavesPerMonth,
            maxLeavesPerMonth:
              editingLeaveType.leaveRestriction.maxLeavesPerMonth,
            leaveAvailAfterJoiningDays:
              editingLeaveType.leaveRestriction.leaveAvailAfterJoiningDays,
            minLeavesAtATime:
              editingLeaveType.leaveRestriction.minLeavesAtATime,
            isTheirLimitForConsecutiveLeave:
              editingLeaveType.leaveRestriction.isTheirLimitForConsecutiveLeave,
            consecutiveLeaveLimit:
              editingLeaveType.leaveRestriction.consecutiveLeaveLimit,
          }
        );
        if (res.status === 201) {
          console.log("resss", res);
          toast.success("Leave Restriction Type updated successfully");
          setEditingItem(res.data);
          getLeaveTypeList(editingItem._id);
          setCurrent(3);
          setPercent(75);
          getRuleLeaveList();
          // setEditingLeaveType(null);
          // toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrong..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleUpdateAdvanceSettingsRule = async (leaveDetailId) => {
    if (leaveDetailId) {
      try {
        console.log("id", leaveDetailId);
        console.log("editingItem", editingItem._id);
        setUpdateLoader(true);
        const res = await updateAdvanceSettingsRule(
          editingItem._id,
          leaveDetailId,
          {
            negativeLeaveAllowed:
              editingLeaveType.advanceSettings.negativeLeaveAllowed,
            maxNegativeLeaveCount:
              editingLeaveType.advanceSettings.maxNegativeLeaveCount,
            halfDayLeaveAllowed:
              editingLeaveType.advanceSettings.halfDayLeaveAllowed,
            viewLeaveDetailsOnDashboard:
              editingLeaveType.advanceSettings.viewLeaveDetailsOnDashboard,
            viewLeaveBalanceOnDashboard:
              editingLeaveType.advanceSettings.viewLeaveBalanceOnDashboard,
            proofRequiredForLeaveRequest:
              editingLeaveType.advanceSettings.proofRequiredForLeaveRequest,
            proofRequiredExceedingDays:
              editingLeaveType.advanceSettings.proofRequiredExceedingDays,
            manualLeaveDisbursement:
              editingLeaveType.advanceSettings.manualLeaveDisbursement,
            maxLeaveAvailPerYear:
              editingLeaveType.advanceSettings.maxLeaveAvailPerYear,
          }
        );
        if (res.status === 201) {
          console.log("resss", res);
          toast.success("Advance Settings updated successfully");
          setEditingItem(res.data);
          getLeaveTypeList(editingItem._id);
          setEditingLeaveType(null);
          setCurrent(0);
          setPercent(0);
          getRuleLeaveList();
          // setEditingLeaveType(null);
          // toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrong..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlayDelete = () => {
    setOverlayVisibleDelete(!overlayVisibleDelete);
  };

  // const handleAddLeaveRule = (e) => {
  //   setIsPopoverOpen(true);
  // };getRuleLeaveList
  const handleAddLeaveRuleClose = (e) => {
    setIsPopoverOpen(false);
  };
  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleAddLeaveType = () => {
    setIsAddLeaveType(true);
  };
  const handleAddLeaveTypeClose = () => {
    setIsAddLeaveType(false);
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    const [category, field] = name.split("."); // Splitting the name to extract category and field

    // setLeaveType((prevData) => ({
    //   ...prevData,
    //   [category]: {
    //     ...prevData[category], // Preserve the other category's data
    //     [field]: value, // Update the specific field in the category
    //   },
    // }));

    setEditingLeaveType((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category], // Preserve the other category's data
        [field]: value, // Update the specific field in the category
      },
    }));

    // setEditingLeaveType((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
  };

  const handleLeaveTypeInputChange = (e) => {
    console.log("e", e);
    const { name, value } = e.target;
    const [category, field] = name.split("."); // Splitting the name to extract category and field

    setLeaveType((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category], // Preserve the other category's data
        [field]: value, // Update the specific field in the category
      },
    }));
  };

  // const handLeaveRule = async () => {
  //   if (!leaveRuleName) {
  //     toast.error("Please enter leave rule name");
  //     return;
  //   }
  //   try {
  //     //   const data = {
  //     //     name: name,
  //     //     department: department,
  //     //   };
  //     const res = await getAddLeaveRule({ leaveRuleName: leaveRuleName });
  //     console.log(res);
  //     if (res.status === 201) {
  //       toast.success(`${leaveRuleName} leave rule added successfully`);
  //       handleAddLeaveRuleClose(false);
  //       getRuleLeaveList();
  //     } else {
  //       toast.error(res.response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error);
  //     console.error(error);
  //   }
  // };

  // const [numFields, setNumFields] = useState(1);

  // const handleAddField = () => {
  //   setNumFields(numFields + 1);
  // };

  // const handleRemoveField = () => {
  //   if (numFields > 1) {
  //     setNumFields(numFields - 1);
  //   }
  // };

  const handLeaveType = async (id) => {
    console.log("aa", leaveType);
    if (!leaveType.basicLeave.leaveName) {
      toast.error("Please enter leave name");
      return;
    }
    if (!leaveType.leaveDetail.disbursementCycle) {
      toast.error("Please select disbursement cycle");
      return;
    }
    if (!leaveType.leaveDetail.leaveCount) {
      toast.error("Please enter leave count");
      return;
    }
    if (!leaveType.basicLeave.status) {
      toast.error("Please select leave status");
      return;
    }
    try {
      //   const data = {
      //     name: name,
      //     department: department,
      //   };
      const res = await postAddLeaveType(id, {
        leaveName: leaveType.basicLeave.leaveName,
        disbursementCycle: leaveType.leaveDetail.disbursementCycle,
        leaveCount: leaveType.leaveDetail.leaveCount,
        status: leaveType.basicLeave.status,
      });
      console.log(res);
      if (res.status === 201) {
        toast.success(
          `${leaveType.basicLeave.leaveName} leave type added successfully`
        );
        setIsAddLeaveType(false);
        getLeaveTypeList(editingItem._id);
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <div className="card">
          {leaveRule_data ? (
            <div className="card-body">
              <div className="flex justify-end">
                <button
                  className="btn btn-primary flex items-center justify-center text-center"
                  onClick={() => {
                    setIsPopoverOpen(true);
                  }}
                >
                  <span className="flex items-center">
                    <i class="ti ti-solid ti-plus px-1"></i>
                    <span className="mr-2">Add Leave Rule</span>
                  </span>
                </button>
              </div>
              <p className="text-2xl font-bold mb-6">Leave Rules</p>
              <table className="min-w-full border rounded">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Leave Rule Name</th>
                    <th className="py-2 px-4">Employee Count</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {/* {JSON.stringify(leaveRule_data)} */}
                  {leaveRule_data.map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-blue-300">
                      <td className="py-3 px-4">{leave.leaveRuleName}</td>
                      <td className="py-3 px-4">{leave.userCount}</td>
                      <td className="py-3 px-4 text-center">
                        <i
                          className="ti ti-regular ti-eye py-2 px-2  hover:text-red-600 cursor-pointer"
                          onClick={() => getEmployeeListByLeaveRule(leave._id)}
                        ></i>
                        <i
                          className="ti ti-regular ti-pencil py-2 px-4  hover:text-red-600 cursor-pointer"
                          onClick={() => {
                            handleEdit(leave), console.log("leave", leave);
                          }}
                        ></i>
                        <i
                          className="ti ti-regular ti-trash py-2 px-2  hover:text-red-600 cursor-pointer"
                          onClick={() => {
                            setOverlayVisibleDelete(true);
                            handleEdit(leave);
                          }}
                        ></i>
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

      {/* Updated modal */}
      {editingItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-5 p-10 rounded w-1/1 relative overflow-y-auto overflow-x-auto max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300"
                  onClick={() => setEditingItem(null)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-lg font-semibold mb-2">Leave Rule Details</h4>
            {/* <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-red-400 px-4 py-2 rounded hover:text-white hover:bg-red-600"
            >
              Cancel
            </button> */}
            {/* {JSON.stringify(editingItem)} */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Leave Rule Name
              </label>
              <input
                type="text"
                name="roleName"
                value={editingItem.leaveRuleName} // Bind the value of the input field to editedRoleName state
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    leaveRuleName: e.target.value,
                  })
                }
                placeholder="Enter Role Name"
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
              />
            </div>
            {/* <div className="flex justify-between items-center mb-2 text-right">
  <button  onClick={handleAddLeaveType}>
  <i className="ti ti-solid ti-plus px-1 mb-1"></i>
    <h6>
      <b>Create Leave Type</b>
    </h6>
   
  </button>
</div> */}

            <div className="flex justify-end mb-3">
              <button
                className="flex items-center justify-center text-center"
                onClick={handleAddLeaveType}
              >
                <b>
                  <span className="flex items-center">
                    <i className="ti ti-solid ti-plus px-1"></i>
                    <span className="mr-2">Create Leave Type</span>
                  </span>
                </b>
              </button>
            </div>

            {/* <div className="rounded border border-gray-400 px-3 py-2 mt-1 w-full"> */}
            <ul>
              <table className="min-w-full border rounded">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4 w-full">Leave Name</th>
                    <th className="py-2 px-4 w-full">Disbursement Cycle</th>
                    <th className="py-2 px-4 w-full">Leave Count</th>
                    <th className="py-2 px-4 w-auto">Status</th>
                    <th className="py-2 px-4 w-full">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {/* Loop through each selected date */}
                  {editingItem.leaveDetails?.map((leaves, index) => (
                    <tr key={leaves._id} className="border-b hover:bg-blue-300">
                      <td className="py-3 px-4 w-full">
                        {leaves.basicLeave.leaveName}
                      </td>
                      <td className="py-3 px-4 w-full">
                        {leaves.leaveDetail.disbursementCycle}
                      </td>
                      <td className="py-3 px-4 w-full">
                        {leaves.leaveDetail.leaveCount}
                      </td>
                      <td className="py-3 px-4 w-auto">
                        <select
                          name="status"
                          value={leaves.basicLeave.status}
                          onChange={(e) => {
                            handleLeaveTypeStatusChange(
                              e,
                              leaves._id,
                              leaves.basicLeave.status,
                              leaves.basicLeave.leaveName
                            );
                          }}
                          onClick={() => {
                            handleUpdateLeaveRuleStatus(
                              leaves._id,
                              leaves.basicLeave.status,
                              leaves.basicLeave.leaveName
                            );
                          }}
                          data-index={index} // Assuming you have an index variable for mapping
                          className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 w-full">
                        <i
                          className="ti ti-regular ti-pencil py-2 px-2  hover:text-red-600 cursor-pointer"
                          onClick={() => setEditingLeaveType(leaves)}
                        ></i>
                        {/* <i
                          className="ti ti-regular ti-trash py-2 px-2  hover:text-red-600 cursor-pointer"
                          // onClick={() => handleEdit(role)}
                        ></i> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ul>
            {/* </div> */}
            {/* {JSON.stringify(editingItem)} */}

            <button
              onClick={() => setOverlayVisible(true)}
              className="px-4 py-2 bg-green-400 mt-2 text-white rounded hover:bg-green-600"
            >
              {updateLoader ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Update"
              )}
            </button>
            <button
              onClick={() => setOverlayVisibleDelete(true)}
              className="px-4 py-2 ml-2 bg-red-400 mt-2 text-white rounded hover:bg-red-600"
            >
              {deleteLoader ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Updated Confirmation */}
      {overlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {updateLoader ? (
            <div className="bg-white p-10 rounded shadow-lg">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="bg-white p-10 rounded shadow-lg">
              <p className="text-center mb-4">
                Are you sure you want to update this {editingItem.leaveRuleName}{" "}
                Rule leave name?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={toggleOverlay}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateLeaveRule(editingItem._id)}
                  className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Updated Confirmation */}
      {overlayVisibleDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {deleteLoader ? (
            <div className="bg-white p-10 rounded shadow-lg">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="bg-white p-10 rounded shadow-lg">
              <p className="text-center mb-4">
                Are you sure you want to Delete this {editingItem.leaveRuleName}{" "}
                Rule leave?
              </p>
              <div className="flex mt-2  justify-end">
                <button
                  onClick={toggleOverlayDelete}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(editingItem._id)}
                  className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* create leave rule */}
      {isPopoverOpen && (
        // <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        //   <div
        //     className="bg-white mt-3 p-10  rounded max-w relative overflow-y-auto max-h-screen w-1/3"
        //     style={{ overflowY: "auto", scrollbarWidth: "none" }}
        //   >
        //     <div className="flex justify-between items-center">
        //       <p></p>
        //       <button className="-mt-4 -mr-4">
        //         <svg
        //           className="swap-on mt--10 fill-current hover:text-blue-300 "
        //           onClick={handleAddLeaveRuleClose}
        //           xmlns="http://www.w3.org/2000/svg"
        //           width="25"
        //           height="25"
        //           viewBox="0 0 512 512"
        //         >
        //           <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        //         </svg>
        //       </button>
        //     </div>
        //     <h4 className="text-md font-semibold mb-4">Create Leave Rule</h4>

        //     <div className="mb-2">
        //       <label className="block text-sm font-medium text-gray-700">
        //         Leave Rule Name
        //       </label>
        //       <input
        //         type="text"
        //         name="leaveRuleName"
        //         placeholder="Enter leave rule name"
        //         onChange={handleInputChange}
        //         className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
        //       />
        //     </div>

        //     <div className="flex justify-start">
        //       <button
        //         type="submit"
        //         onClick={handLeaveRule}
        //         className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
        //       >
        //         Submit
        //       </button>
        //     </div>
        //     {/* End of leave balance popover */}
        //   </div>
        // </div>
        <AddNewLeaveRule
          setIsPopoverOpen={setIsPopoverOpen}
          getRuleLeaveList={getRuleLeaveList}
        />
      )}

      {/* add leave type */}
      {isAddLeaveType && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10  rounded max-w relative overflow-y-auto max-h-screen w-1/2"
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300 "
                  onClick={handleAddLeaveTypeClose}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-md font-semibold mb-4">Create Leave type</h4>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="basicLeave.leaveName"
                placeholder="Enter leave name"
                onChange={handleLeaveTypeInputChange}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Disbursement Cycle
              </label>
              <select
                value={isAddLeaveType.disbursementCycle}
                name="leaveDetail.disbursementCycle"
                onChange={handleLeaveTypeInputChange}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
              >
                <option value="">Select Disbursement Cycle</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Yearly">Yearly</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Based On Worked Days">
                  Based On Worked Days
                </option>
                <option value="Based On Tenure Completion">
                  Based On Tenure Completion
                </option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Leave Count
              </label>
              <input
                type="number"
                name="leaveDetail.leaveCount"
                placeholder="Enter Leave Count"
                onChange={handleLeaveTypeInputChange}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="basicLeave.status"
                value={isAddLeaveType.status}
                onChange={handleLeaveTypeInputChange}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-start">
              {/* {JSON.stringify(editingItem)} */}
              <button
                type="submit"
                onClick={() => handLeaveType(editingItem._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
              >
                Submit
              </button>
            </div>
            {/* End of leave balance popover */}
          </div>
        </div>
      )}

      {editingLeaveType && (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 py-5 px-7 rounded max-w relative overflow-y-auto max-h-screen w-75"
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            {/* {JSON.stringify(editingLeaveType)} */}
            <Steps
              className="mb-4 w-75"
              current={current}
              percent={percent}
              size="small"
              labelPlacement="horizontal"
              items={items}
            />

            {current === 0 && (
              <>
                <b>Basic Details</b>
                {/* {JSON.stringify(editingLeaveType)} */}
                <div className="flex mt-3 w-auto mb-3">
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="basicLeave.leaveName"
                      placeholder="Enter leave name"
                      value={editingLeaveType.basicLeave.leaveName}
                      onChange={handleInputChanges}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
                    />
                  </span>
                  {/* <span className="mb-2 ml-5 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Leave Count
                    </label>
                    <input
                      type="number"
                      name="leaveCount"
                      value={editingLeaveType.leaveCount}
                      placeholder="Enter Leave Count"
                      onChange={handleInputChanges}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
                    />
                  </span> */}
                  <span className="mb-2 ml-5 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="basicLeave.status"
                      value={editingLeaveType.basicLeave.status}
                      onChange={handleInputChanges}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </span>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <hr />
                <div className="flex justify-end py-3">
                  <button
                    type="button"
                    onClick={() => setEditingLeaveType(null)}
                    className="px-4 py-2 bg-gray-200 rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    onClick={() => {
                      handleUpdateBasicLeaveRule(editingLeaveType._id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {current === 1 && (
              <>
                <b>Leave Details</b>
                {/* {JSON.stringify(editingLeaveType)} */}
                <div className="flex mt-3 mb-2">
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Disbursement Cycle
                    </label>
                    <select
                      value={editingLeaveType.leaveDetail.disbursementCycle}
                      name="leaveDetail.disbursementCycle"
                      onChange={handleInputChanges}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    >
                      <option value="">Select Disbursement Cycle</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half Yearly">Half Yearly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Based On Worked Days">
                        Based On Worked Days
                      </option>
                      <option value="Based On Tenure Completion">
                        Based On Tenure Completion
                      </option>
                    </select>
                  </span>
                  <span className="mb-2 ml-5 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Disbursement Time
                    </label>
                    <select
                      value={editingLeaveType.leaveDetail.disbursementTime}
                      name="leaveDetail.disbursementTime"
                      onChange={handleInputChanges}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    >
                      <option value="">Select Disbursement Time</option>
                      <option value="Start Of The Cycle">
                        Start Of The Cycle
                      </option>
                      <option value="End Of The Cycle">End Of The Cycle</option>
                    </select>
                  </span>
                </div>

                <div className="flex mb-2">
                  <label className="block text-sm font-medium text-gray-700 w-1/2">
                    Enable tenure based on leave disbursement
                  </label>
                  <div className="flex items-center justify-end w-1/2">
                    <Switch
                      name="leaveDetail.isEnableTenureBasedOnLeaveDisbursement"
                      checked={
                        editingLeaveType.leaveDetail
                          .isEnableTenureBasedOnLeaveDisbursement
                      }
                      onClick={(e) =>
                        setEditingLeaveType({
                          ...editingLeaveType,
                          leaveDetail: {
                            ...editingLeaveType.leaveDetail,
                            isEnableTenureBasedOnLeaveDisbursement: e,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                {editingLeaveType.leaveDetail
                  .isEnableTenureBasedOnLeaveDisbursement && (
                  <div className="border rounded mt-3 mb-3">
                    {editingLeaveType.leaveDetail.forTenure.length === 0 ? (
                      <div className="flex mb-2 py-2 px-2 mt-2">
                        <label className="block text-sm font-medium text-gray-700 w-75">
                          For tenure less than
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            value={tenureItem?.lessThanYear || 0} // initial value
                            onChange={(e) =>
                              handleTenureInputChange(
                                0,
                                "lessThanYear",
                                e.target.value
                              )
                            }
                            min={0}
                            max={10}
                            minLength={2}
                          />
                          year, disburse
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            min={0}
                            max={10}
                            minLength={2}
                            value={tenureItem?.lessThanYear || 0} // initial value
                            onChange={(e) =>
                              handleTenureInputChange(
                                0,
                                "disburseLeaves",
                                e.target.value
                              )
                            }
                          />{" "}
                          leaves
                        </label>
                        <div className="flex items-center justify-end w-25">
                          <button
                            className="flex items-center text-blue-600 justify-center text-center"
                            onClick={handleAddTenure}
                          >
                            <span className="flex items-center">
                              <i className="ti ti-solid ti-plus px-1"></i>
                              <span className="mr-2">Add</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      editingLeaveType.leaveDetail.forTenure.map(
                        (tenureItem, index) => (
                          <div key={index} className="flex mb-2 py-2 px-2 mt-2">
                            <label className="block text-sm font-medium text-gray-700 w-75">
                              For tenure less than
                              <input
                                className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                                type="number"
                                value={tenureItem.lessThanYear || 0}
                                onChange={(e) =>
                                  handleTenureInputChange(
                                    index,
                                    "lessThanYear",
                                    e.target.value
                                  )
                                }
                                min={0}
                                max={10}
                                minLength={2}
                              />
                              year, disburse
                              <input
                                className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                                type="number"
                                min={0}
                                max={10}
                                minLength={2}
                                value={tenureItem.disburseLeaves || 0}
                                onChange={(e) =>
                                  handleTenureInputChange(
                                    index,
                                    "disburseLeaves",
                                    e.target.value
                                  )
                                }
                              />{" "}
                              leaves
                            </label>
                            <div className="flex items-center justify-end w-25">
                              {index === 0 && (
                                <button
                                  className="flex items-center text-blue-600 justify-center text-center"
                                  onClick={handleAddTenure}
                                >
                                  <span className="flex items-center">
                                    <i className="ti ti-solid ti-plus px-1"></i>
                                    <span className="mr-2">Add</span>
                                  </span>
                                </button>
                              )}
                              {index !== 0 && (
                                <button
                                  className="flex items-center text-red-600 justify-center text-center"
                                  onClick={() => handleRemoveTenure(index)}
                                >
                                  <span className="flex items-center">
                                    <i className="ti ti-solid ti-trash px-1"></i>
                                    <span className="mr-2">Remove</span>
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                )}

                <div className="flex mb-2 py- px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Enter a number of leaves credited per disbursement cycle:
                    <input
                      className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                      type="number"
                      name="leaveDetail.leaveCount"
                      value={editingLeaveType.leaveDetail.leaveCount}
                      min={0}
                      max={10}
                      minLength={2}
                      onChange={handleInputChanges}
                    />
                    Days.
                  </label>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Enter a number of leaves credited during probation:
                    <input
                      className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                      type="number"
                      name="leaveDetail.leaveCountProbation"
                      value={editingLeaveType.leaveDetail.leaveCountProbation}
                      min={0}
                      max={10}
                      minLength={2}
                      onChange={handleInputChanges}
                    />
                    Days.
                  </label>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    This leave type is Paid i.e. employees will get paid for
                    that day if on leave
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="leaveDetail.isLeaveTypePaid"
                    onChange={handleInputChanges}
                    value={editingLeaveType.leaveDetail.isLeaveTypePaid}
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employee will get paid for the day if he/she is on
                      leave.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, Employee will incur loss of pay if he/she is on leave
                    </Radio>
                  </Radio.Group>
                </div>

                {editingLeaveType.leaveDetail.isLeaveTypePaid &&
                  editingLeaveType.leaveDetail.isLeaveTypePaid === "Yes" && (
                    <div className="mb-2 border rounded py-2 px-2 mt-2">
                      <label className="block text-sm font-medium text-gray-700 w-auto px-2 py-2">
                        Can employees encash their leave balance at full &
                        final?
                      </label>
                      <Radio.Group
                        className="px-2 py-2"
                        name="leaveDetail.isEncashLeaveBalance"
                        onChange={handleInputChanges}
                        value={
                          editingLeaveType.leaveDetail.isEncashLeaveBalance
                        }
                      >
                        <Radio className="mt-2" value={"Yes"}>
                          Yes, Employees can encash unutilised leave balance at
                          full & final.
                        </Radio>
                        <br />
                        <Radio className="mt-2" value={"No"}>
                          No, the unutilised leave balance will be lapsed and
                          not be paid.
                        </Radio>
                      </Radio.Group>
                      <br />
                      <label className="block text-sm font-medium text-gray-700 w-auto px-2 py-2">
                        Do want to recover the excess leave balance of employees
                        at the time of FNF?
                      </label>
                      <Radio.Group
                        className="px-2 py-2"
                        name="leaveDetail.wantToRecoverTheExcessLeaveBalance"
                        onChange={handleInputChanges}
                        value={
                          editingLeaveType.leaveDetail
                            .wantToRecoverTheExcessLeaveBalance
                        }
                      >
                        <Radio className="mt-2" value={"Yes"}>
                          Yes, the excess leave balance assigned to the employee
                          shall be recoverd at the time of FNF.
                        </Radio>
                        <br />
                        <Radio className="mt-2" value={"No"}>
                          No, Such recovery is required.
                        </Radio>
                      </Radio.Group>
                    </div>
                  )}

                <div className="py-2 px-2">
                  <b>Applicability</b>
                  <br />
                  <br />
                  The leave type Applicable to
                  <div className="mb-2 flex mt-2 py-2 px-2">
                    <span className="mb-2 w-1/2">
                      <label className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        value={editingLeaveType.leaveDetail.gender}
                        name="leaveDetail.gender"
                        onChange={handleInputChanges}
                        className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="All">All</option>
                      </select>
                    </span>
                    <span className="mb-2 w-1/2 ml-5">
                      <label className="block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <select
                        value={editingLeaveType.leaveDetail.maritalStatus}
                        name="leaveDetail.maritalStatus"
                        onChange={handleInputChanges}
                        className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                      >
                        <option value="">Select marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="All">All</option>
                      </select>
                    </span>
                  </div>
                </div>

                <div className="py-2 px-2 mb-2">
                  <b>Carry forward settings</b>
                  <br />
                  <br />
                  <div className="flex mb-3">
                    <label className="block text-sm font-medium text-gray-700 w-75">
                      Allow carry forward leave balance to next disbursement
                      cycle
                    </label>
                    <div className="flex items-center justify-end w-25">
                      <Switch
                        name="leaveDetail.isCarryForwardToNextDisbursementCycle"
                        onClick={(e) =>
                          setEditingLeaveType({
                            ...editingLeaveType,
                            leaveDetail: {
                              ...editingLeaveType.leaveDetail,
                              isCarryForwardToNextDisbursementCycle: e,
                            },
                          })
                        }
                        value={
                          editingLeaveType.leaveDetail
                            .isCarryForwardToNextDisbursementCycle
                        }
                      />
                    </div>
                  </div>
                  <div className="flex mb-2">
                    <label className="block text-sm font-medium text-gray-700 w-75">
                      Allow carry forward leave balance to next year
                    </label>
                    <div className="flex items-center justify-end w-25">
                      <Switch
                        name="leaveDetail.isCarryForwardToNextYear"
                        value={
                          editingLeaveType.leaveDetail.isCarryForwardToNextYear
                        }
                        onClick={(e) =>
                          setEditingLeaveType({
                            ...editingLeaveType,
                            leaveDetail: {
                              ...editingLeaveType.leaveDetail,
                              isCarryForwardToNextYear: e,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  {editingLeaveType.leaveDetail.isCarryForwardToNextYear &&
                    editingLeaveType.leaveDetail.isCarryForwardToNextYear ===
                      true && (
                      <div className="mb-2 border rounded py-2 px-2">
                        <label className="block text-sm font-medium text-gray-700 w-auto">
                          Set maximum yearly carry forward leave limit for
                          employees:
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            name="leaveDetail.setMaxCarryForwardLeave"
                            value={
                              editingLeaveType.leaveDetail
                                .setMaxCarryForwardLeave
                            }
                            min={0}
                            max={10}
                            minLength={2}
                            onChange={handleInputChanges}
                          />
                          Days.
                        </label>
                      </div>
                    )}
                </div>

                <div className="py-2 px-2">
                  <b>Enhancement of leaves on your completion</b>
                  <br />
                  <br />
                  <div className="flex mb-3">
                    <label className="block text-sm font-medium text-gray-700 w-75">
                      Disbuse leave on tenure completion
                    </label>
                    <div className="flex items-center justify-end w-25">
                      <Switch
                        name="leaveDetail.isLeaveDisbuseOnTenureCompletion"
                        value={
                          editingLeaveType.leaveDetail
                            .isLeaveDisbuseOnTenureCompletion
                        }
                        onClick={(e) =>
                          setEditingLeaveType({
                            ...editingLeaveType,
                            leaveDetail: {
                              ...editingLeaveType.leaveDetail,
                              isLeaveDisbuseOnTenureCompletion: e,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <hr />

                <div className="flex justify-end py-3">
                  <button
                    type="button"
                    onClick={() => setEditingLeaveType(null)}
                    className="px-4 py-2 bg-gray-200 rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Cancel
                  </button>
                  {/* {JSON.stringify(leave?.leave)} */}
                  <button
                    type="submit"
                    onClick={() => {
                      setCurrent(0), setPercent(0);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      handleUpdateLeaveDetailRule(editingLeaveType._id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {current === 2 && (
              <>
                <b>Leave Restrictions</b>
                {/* <p className="w-1/2">{JSON.stringify(editingLeaveType)}</p> */}

                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Employees can apply foe leaves during probation?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="leaveRestriction.probationLeavesAllowed"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.leaveRestriction.probationLeavesAllowed
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employee can avail leaves during probation period.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, Employee can not apply leaves leaves during probation
                      period.
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Is leave grid visible during probation period?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="leaveRestriction.probationLeaveVisibility"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.leaveRestriction.probationLeaveVisibility
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No and leave balance will be assigned on monthly basis but
                      can view only after probation Confirmation.
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Employee can apply for leaves during notice period?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="leaveRestriction.noticePeriodLeavesAllowed"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.leaveRestriction
                        .noticePeriodLeavesAllowed
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employee will be able to apply leave during notice
                      period.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, Employee can not apply leave during notice period.
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Do you want to round-off the leave balance for employees?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="leaveRestriction.roundOffLeaveBalance"
                    // onChange={(e) => {
                    //   setWantTORoundOffLeaveBalance(e.target.value);
                    // }}
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.leaveRestriction.roundOffLeaveBalance
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, if leaves balance is in decimals, the leave balance
                      will be round-off (i.e. Leave Balance (1.01 to 1.49) will
                      be rounded off to 1 & 1.5 will be 1.5 & (1.51 to 1.99)
                      will be rounded off to 2).
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, do not round-off decimals. The leave will be remainin
                      decimals only.
                    </Radio>
                  </Radio.Group>
                </div>
                {editingLeaveType.leaveRestriction.roundOffLeaveBalance &&
                  editingLeaveType.leaveRestriction.roundOffLeaveBalance ===
                    "No" && (
                    <div>
                      <div className=" border rounded py-2 px-2 mt-2">
                        <Checkbox
                          className="px-2 py-2"
                          name="leaveRestriction.isRestrictionWhileApplyingLeave"
                          onClick={(e) =>
                            setEditingLeaveType({
                              ...editingLeaveType,
                              leaveRestriction: {
                                ...editingLeaveType.leaveRestriction,
                                isRestrictionWhileApplyingLeave:
                                  e.target.checked,
                              },
                            })
                          }
                          checked={
                            editingLeaveType.leaveRestriction
                              .isRestrictionWhileApplyingLeave
                          }
                        >
                          Restrictions on Employees while Applying Leave.
                        </Checkbox>
                        <label className="block text-sm font-medium text-gray-700 w-auto px-2 py-2">
                          Restict employees to apply for back dated leaves?
                        </label>
                        <Radio.Group
                          className="px-2 py-2"
                          name="leaveRestriction.backDatedLeaveRestriction"
                          onChange={handleInputChanges}
                          value={
                            editingLeaveType.leaveRestriction
                              .backDatedLeaveRestriction
                          }
                        >
                          <Radio className="mt-2" value={"Yes"}>
                            Yes, restict employee to apply leaves for past days
                            within{" "}
                            <input
                              className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                              type="number"
                              name="leaveRestriction.countOfBackDatedLeaveRestriction"
                              value={
                                editingLeaveType.leaveRestriction
                                  .countOfBackDatedLeaveRestriction
                              }
                              min={0}
                              max={10}
                              minLength={2}
                              onChange={handleInputChanges}
                            />
                            Days.
                          </Radio>
                          <br />
                          <Radio className="mt-2" value={"No"}>
                            No such restriction applicable.
                          </Radio>
                        </Radio.Group>
                        <br />
                        <label className="block text-sm font-medium text-gray-700 w-auto px-2 py-2">
                          Prior notice is required to apply for future dated
                          leaves? it'll ensure that leaves are intimated in
                          advance and zero indicates leave can be applied on
                          same day?
                        </label>
                        <Radio.Group
                          className="px-2 py-2"
                          name="leaveRestriction.priorNoticeForFutureLeaves"
                          onChange={handleInputChanges}
                          value={
                            editingLeaveType.leaveRestriction
                              .priorNoticeForFutureLeaves
                          }
                        >
                          <Radio className="mt-2" value={"Yes"}>
                            Yes, restict employee to apply leaves for future
                            dated leaves at-least before
                            <input
                              className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                              type="number"
                              name="leaveRestriction.countOffutureDatedLeavesBeforeDays"
                              value={
                                editingLeaveType.leaveRestriction
                                  .countOffutureDatedLeavesBeforeDays
                              }
                              min={0}
                              max={10}
                              minLength={2}
                              onChange={handleInputChanges}
                            />
                            Days.
                          </Radio>
                          <br />
                          <Radio className="mt-2" value={"No"}>
                            No, Such prior notice is required for future dated
                            leave applicaion.
                          </Radio>
                        </Radio.Group>
                        <br />
                        <label className="block text-sm font-medium text-gray-700 w-auto px-2 py-2">
                          Is there a limit on the maximum number of leaves that
                          can be availed in a month?
                        </label>
                        <Radio.Group
                          className="px-2 py-2"
                          name="leaveRestriction.isThierMaxLeavesPerMonth"
                          onChange={handleInputChanges}
                          value={
                            editingLeaveType.leaveRestriction
                              .isThierMaxLeavesPerMonth
                          }
                        >
                          <Radio className="mt-2" value={"Yes"}>
                            Yes, Employee is restricted to avail maximum days of
                            leave balance in a month{" "}
                            <input
                              className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                              type="number"
                              name="leaveRestriction.maxLeavesPerMonth"
                              value={
                                editingLeaveType.leaveRestriction
                                  .maxLeavesPerMonth
                              }
                              min={0}
                              max={10}
                              minLength={2}
                              onChange={handleInputChanges}
                            />
                            Days.
                          </Radio>
                          <br />
                          <Radio className="mt-2" value={"No"}>
                            No, there is no limit on maximum leaves that can be
                            availed in a month.
                          </Radio>
                        </Radio.Group>
                        <br />
                        <lable className="text-black text-sm px-2 py-2">
                          {" "}
                          Employee can avail leaves only after{" "}
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            name="leaveRestriction.leaveAvailAfterJoiningDays"
                            min={0}
                            max={10}
                            minLength={2}
                            onChange={handleInputChanges}
                            value={
                              editingLeaveType.leaveRestriction
                                .leaveAvailAfterJoiningDays
                            }
                          />
                          Days of joining
                        </lable>
                        <br />
                        <lable className="text-black text-sm px-2 py-2">
                          {" "}
                          Employee can avail minimum
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            name="leaveRestriction.minLeavesAtATime"
                            min={0}
                            max={10}
                            minLength={2}
                            onChange={handleInputChanges}
                            value={
                              editingLeaveType.leaveRestriction.minLeavesAtATime
                            }
                          />
                          Days of leaves at a time.
                        </lable>
                        <br />
                        <label className="block text-sm font-medium text-gray-700 w-auto px-2 py-2">
                          Is their a limit on the number of consecutive days
                          this leaves can be taken?
                        </label>
                        <Radio.Group
                          className="px-2 py-2"
                          name="leaveRestriction.isTheirLimitForConsecutiveLeave"
                          onChange={handleInputChanges}
                          value={
                            editingLeaveType.leaveRestriction
                              .isTheirLimitForConsecutiveLeave
                          }
                        >
                          <Radio className="mt-2" value={"Yes"}>
                            Yes, Limit to a maximum of{" "}
                            <input
                              className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                              type="number"
                              name="leaveRestriction.consecutiveLeaveLimit"
                              value={
                                editingLeaveType.leaveRestriction
                                  .consecutiveLeaveLimit
                              }
                              min={0}
                              max={10}
                              minLength={2}
                              onChange={handleInputChanges}
                            />{" "}
                            consecutive days of leaves (excluding weekends &
                            holidays).
                          </Radio>
                          <br />
                          <Radio className="mt-2" value={"No"}>
                            No limit, employee can apply any number of
                            consecutive leaves provided he/she has available
                            leave balance.
                          </Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  )}

                <hr />
                <div className="flex justify-end py-3">
                  <button
                    type="button"
                    onClick={() => setEditingLeaveType(null)}
                    className="px-4 py-2 bg-gray-200 rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Cancel
                  </button>
                  {/* {JSON.stringify(leave?.leave)} */}
                  <button
                    type="submit"
                    onClick={() => {
                      setCurrent(1), setPercent(25);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      handleUpdateLeaveRestrictionRule(editingLeaveType._id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {current === 3 && (
              <>
                <b>Advanced Settings</b>

                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Employees are eligable to have negative leave balance (or
                    'leave in advance') ?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="advanceSettings.negativeLeaveAllowed"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.advanceSettings.negativeLeaveAllowed
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employee can avail leaves even if the remaining leave
                      balance is zero and it'll be deducted when more leave
                      balance is created.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, employee can apply leave only if has suffcient leave
                      balance.
                    </Radio>
                  </Radio.Group>
                  {editingLeaveType.advanceSettings.negativeLeaveAllowed &&
                    editingLeaveType.advanceSettings.negativeLeaveAllowed ===
                      "Yes" && (
                      <div className="border rounded mb-2 py-3 px-2  mt-2">
                        <label className="block text-sm font-medium text-gray-700 w-full">
                          Set maximum negative leave alowed count for employees
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            name="advanceSettings.maxNegativeLeaveCount"
                            value={
                              editingLeaveType.advanceSettings
                                .maxNegativeLeaveCount
                            }
                            min={0}
                            max={10}
                            minLength={2}
                            onChange={handleInputChanges}
                          />
                          Days.
                        </label>
                      </div>
                    )}
                </div>

                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Do you want to allow employees to apply for half day leave?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="advanceSettings.halfDayLeaveAllowed"
                    onChange={handleInputChanges}
                    value={editingLeaveType.advanceSettings.halfDayLeaveAllowed}
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employees can apply for half day leave either for the
                      first half or second half of the day.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, Employees can't apply for half day leave.
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Do you want employees to view leave details on dashboard?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="advanceSettings.viewLeaveDetailsOnDashboard"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.advanceSettings
                        .viewLeaveDetailsOnDashboard
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employees can view thier leave history and other
                      details on dashboard.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, leave details shall not be visible to employees.
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Do you want to employees to view thier leave balance on the
                    dashboard?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="advanceSettings.viewLeaveBalanceOnDashboard"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.advanceSettings
                        .viewLeaveBalanceOnDashboard
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employees can view thier leave balance on dashboard.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, leave balance not be visible to employees.
                    </Radio>
                  </Radio.Group>
                </div>

                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Employee is required to submit a document proof or attchment
                    for this leave request ?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="advanceSettings.proofRequiredForLeaveRequest"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.advanceSettings
                        .proofRequiredForLeaveRequest
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Employee shall submit a proof to apply for this leave
                      type.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, Proof is not required for this leave type.
                    </Radio>
                  </Radio.Group>
                  {editingLeaveType.advanceSettings
                    .proofRequiredForLeaveRequest &&
                    editingLeaveType.advanceSettings
                      .proofRequiredForLeaveRequest === "Yes" && (
                      <div className="border rounded mb-2 py-3 px-2  mt-2">
                        <label className="block text-sm font-medium text-gray-700 w-full">
                          Proof will be required if the leaves applied exceeds
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            name="advanceSettings.proofRequiredExceedingDays"
                            value={
                              editingLeaveType.advanceSettings
                                .proofRequiredExceedingDays
                            }
                            min={0}
                            max={10}
                            minLength={2}
                            onChange={handleInputChanges}
                          />
                          Days.
                        </label>
                      </div>
                    )}
                </div>

                <div className="mb-2 py-2 px-2">
                  <label className="block text-sm font-medium text-gray-700 w-auto">
                    Do you want to disburse leaves manually to employee who
                    joins before or after a date in a month?
                  </label>
                  <Radio.Group
                    className="mt-2"
                    name="advanceSettings.manualLeaveDisbursement"
                    onChange={handleInputChanges}
                    value={
                      editingLeaveType.advanceSettings.manualLeaveDisbursement
                    }
                  >
                    <Radio className="mt-2" value={"Yes"}>
                      Yes, Allow disbursing leaves manually.
                    </Radio>
                    <br />
                    <Radio className="mt-2" value={"No"}>
                      No, Leaves credit shall be same irrespective of the
                      joining date of the employee.
                    </Radio>
                  </Radio.Group>
                  {editingLeaveType.advanceSettings.manualLeaveDisbursement &&
                    editingLeaveType.advanceSettings.manualLeaveDisbursement ===
                      "No" && (
                      <div className="border rounded mb-2 py-3 px-2  mt-2">
                        <label className="block text-sm font-medium text-gray-700 w-full">
                          Employee can avail this leave
                          <input
                            className="input focus:bg-gray-100 text-center placeholder:text-gray-200 w-8 px-1 ml-2 mr-2 input-bordered"
                            type="number"
                            min={0}
                            max={10}
                            minLength={2}
                            name="advanceSettings.maxLeaveAvailPerYear"
                            onChange={handleInputChanges}
                            value={
                              editingLeaveType.advanceSettings
                                .maxLeaveAvailPerYear
                            }
                          />
                          times in a year.
                        </label>
                      </div>
                    )}
                </div>

                <hr />
                <div className="flex justify-end py-3">
                  <button
                    type="button"
                    onClick={() => setEditingLeaveType(null)}
                    className="px-4 py-2 bg-gray-200 rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Cancel
                  </button>
                  {/* {JSON.stringify(leave?.leave)} */}
                  <button
                    type="submit"
                    onClick={() => {
                      setCurrent(2), setPercent(75);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      handleUpdateAdvanceSettingsRule(editingLeaveType._id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none mr-2"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* view Employee list modal */}
      {employeeListData && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-5 p-10 rounded w-1/1 relative overflow-y-auto overflow-x-auto max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300"
                  onClick={() => setEmployeeListData(null)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-lg font-semibold mb-2">Employee List</h4>
            <ul className="flex justify-center">
              <table className="min-w-full border rounded text-left">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Employee Name</th>
                    <th className="py-2 px-4">Department</th>
                    <th className="py-2 px-4">Designation</th>
                    <th className="py-2 px-4">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {employeeListData?.map((data, index) => (
                    <tr key={index} className="border-b hover:bg-blue-300">
                      <td className="py-3 px-4">{data.username}</td>
                      <td className="py-3 px-4">{data.department}</td>
                      <td className="py-3 px-4">{data.designation}</td>
                      <td className="py-3 px-4">{data.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ul>

            {/* </div> */}
            {/* {JSON.stringify(editingItem)} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
