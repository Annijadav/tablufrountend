"use client";
import {
  getAllHoliday,
  deleteHoliday,
  getAllHolidayType,
  getAllHolidayApplicableOn,
  updateHoliday,
  updateHolidayType,
  deleteHolidayType,
} from "@/helpers/Services/Holiday_services";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { validateForm } from "../holiday/validations/holidayValidation";
import { toast } from "react-toastify";
import { Select } from "antd";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

function page() {
  const [holiday_data, setHoliday_data] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [editedRoleName, setEditedRoleName] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);
  const [holidayType, setHolidayType] = useState(null);
  const [holidayApplicability, setHolidayApplicability] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editingHolidayType, setEditingHolidayType] = useState(null);
  const { Option } = Select;
  const router = useRouter();

  const getHolidayList = async () => {
    try {
      const res = await getAllHoliday();
      console.log("Response:", res);
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

  const fetchAllHolidayApplicability = async (applicability) => {
    try {
      const res = await getAllHolidayApplicableOn(applicability);
      if (res.status === 200) {
        setHolidayApplicability(res.data);
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    }
  };

  const handleApplicabilityChange = (index, name, value) => {
    console.log("index, name, value", index, name, value);
    if (name === "applicableOn") {
      console.log(
        "editingItem.holidayApplicabilities",
        editingItem.holidayApplicabilities
      );
      // Check if the selected applicableOn value already exists in another applicability
      const isAlreadySelected = editingItem.holidayApplicabilities.some(
        (applicability, idx) =>
          applicability.applicableOn === value && idx !== index
      );

      if (isAlreadySelected) {
        toast.error("This applicability option is already selected.");
        return;
      }
    }

    const newApplicability = [...editingItem.holidayApplicabilities];
    newApplicability[index] = {
      ...newApplicability[index],
      [name]: value,
    };

    if (name === "applicableOn") {
      newApplicability[index].additionalField = null;
    }

    setEditingItem({
      ...editingItem,
      holidayApplicabilities: newApplicability,
    });
  };

  const addApplicability = (index) => {
    console.log("callindddddd", index);
    setEditingItem({
      ...editingItem,
      holidayApplicabilities: [
        ...editingItem.holidayApplicabilities,
        { applicableOn: "", additionalField: [] },
      ],
    });
  };

  const removeApplicability = (index) => {
    if (editingItem.holidayApplicabilities.length > 1) {
      const newApplicability = editingItem.holidayApplicabilities.filter(
        (_, i) => i !== index
      );
      setEditingItem({
        ...editingItem,
        holidayApplicabilities: newApplicability,
      });
    }
  };

  useEffect(() => {
    getHolidayList();
  }, []);

  const handleDelete = async (HolidayId) => {
    try {
      setDeleteLoader(true);
      const res = await deleteHoliday(HolidayId);
      if (res.status === 200) {
        getHolidayList();
        toast.success("Holiday deleted successfully");
        setEditingItem(null);
        toggleOverlayDelete();
      } else {
        console.error(res.response.data.message);
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Internal error");
      toast.error("Internal error ");
    } finally {
      setDeleteLoader(false);
    }
  };

  const handleDeleteType = async (id) => {
    try {
      const res = await deleteHolidayType(id);
      console.log("HolidayTypeId", id);
      console.log("delres", res);
      if (res.status === 201) {
        fetchAllHolidayType();
        toast.success("Holiday deleted successfully");
        setEditingHolidayType(null);
      } else {
        console.error("resmesssss", res.response.data.message);
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.error("eooor", error);
      toast.error("error");
    }
  };

  const fetchAllHolidayType = async () => {
    try {
      const res = await getAllHolidayType();
      if (res.status === 200) {
        setHolidayType(res.data);
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    }
  };

  const handleEdit = (holiday) => {
    console.log("sesesese", holiday);
    setEditingItem(holiday); // Update the state with the selected holiday

    fetchAllHolidayType(); // Fetch all holiday types

    // Use useEffect to watch for changes in editingItem and fetch applicabilities

    if (holiday && holiday.holidayApplicabilities) {
      // Check if the selected applicableOn value already exists in another applicability
      holiday.holidayApplicabilities.forEach((applicability) => {
        fetchAllHolidayApplicability(applicability.applicableOn);
      });
    } // This effect will run when the holiday changes
  };

  const handleTypeEdit = (holidayTypee) => {
    setEditingHolidayType(holidayTypee); // Update the state with the selected holiday
  };

  const handleUpdateHoliday = async (id) => {
    if (id) {
      if (!editingItem.name) {
        toast.error("Please enter holiday name");
        return;
      }
      if (!editingItem.holidayType) {
        toast.error("Please select holiday type");
        return;
      }
      if (!editingItem.description) {
        toast.error("Please enter holiday description");
        return;
      }
      if (!editingItem.startDate) {
        toast.error("Please select holiday start date");
        return;
      }
      for (
        let index = 0;
        index < editingItem.holidayApplicabilities.length;
        index++
      ) {
        const applicability = editingItem.holidayApplicabilities[index];
        if (!applicability.applicableOn) {
          toast.error(`Please select applicable on ${index + 1}`);
          return;
        }
        if (!applicability.additionalField) {
          toast.error(
            `Please select ${applicability.applicableOn} in applicable on${
              index + 1
            }`
          );
          return;
        }
      }
      try {
        console.log("id", id);
        setUpdateLoader(true);
        let decode = "";
        const token = localStorage.getItem("authToken");
        console.log("token", token);
        if (token) {
          decode = jwtDecode(token);
          console.log("decoded", decode);
        } else {
          console.log("Token not found");
        }
        const data = {
          name: editingItem.name,
          holidayType: editingItem.holidayType,
          description: editingItem.description,
          startDate: editingItem.startDate,
          endDate: editingItem.endDate,
          holidayApplicabilities: editingItem.holidayApplicabilities,
          status: editingItem.status,
          modifiedBy: decode.firstName
            ? decode.firstName + " " + decode.lastName
            : "not found",
        };

        const error = validateForm(data);
        if (error) {
          return toast.error(error);
        } else {
          console.log("datadatadata", data);
          const res = await updateHoliday(id, data);
          if (res.status === 201) {
            console.log("res", res);
            getHolidayList();
            toast.success("Holiday updated successfully");
            setEditingItem(null);
            toggleOverlay();
          } else {
            toast.error(res.response.data.message);
          }
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

  const handleUpdateHolidayType = async (id) => {
    if (id) {
      if (!editingHolidayType.name) {
        toast.error("Please enter holiday type");
        return;
      }
      try {
        const res = await updateHolidayType(id, {
          name: editingHolidayType.name,
        });
        if (res.status === 201) {
          console.log("res", res);
          fetchAllHolidayType();
          getHolidayList();
          toast.success("Holiday type updated successfully");
          setEditingHolidayType(null);
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wrong..");
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlayDelete = () => {
    setOverlayVisibleDelete(!overlayVisibleDelete);
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
  };

  return (
    <div>
      <div>
        <div className="card">
          {holiday_data ? (
            <div className="card-body">
              <div className="flex justify-end">
                <div className="justify-items-center">
                  <div className="w-full">
                    <button
                      onClick={() => {
                        setIsPopoverOpen(true), fetchAllHolidayType();
                      }}
                      className="ml-3 text-white rounded bg-green-400 hover:bg-green-600 px-3 py-2.5"
                    >
                      <span className="flex items-center">
                        <i class="ti ti-solid ti-eye mr-1"></i>
                        <span className="mr-2">Holiday Type</span>
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        router.push("/dashboard/holiday/addHoliday")
                      }
                      className="ml-3 text-white rounded bg-blue-400 hover:bg-blue-600 px-3 py-2.5"
                    >
                      <span className="flex items-center">
                        <i class="ti ti-solid ti-plus mr-1"></i>
                        <span className="mr-2">Add Holiday</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold mb-6">Holiday List</p>
              {/* {JSON.stringify(holiday_data)} */}

              <ul className="flex justify-center">
                <table className="min-w-full border rounded text-left">
                  <thead className="bg-blue-300 text-white">
                    <tr>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-2 ">Type</th>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Applicability</th>
                      <th className="py-2 px-2">Modified By</th>
                      <th className="py-2 px-2">Modified On</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100">
                    {holiday_data.map((holiday) => (
                      <tr
                        key={holiday._id}
                        className="border-b hover:bg-blue-300"
                      >
                        <td className="py-3 px-4">{holiday.name}</td>
                        <td className="py-3 px-2">
                          {holiday.holidayType
                            ? holiday.holidayType.name
                            : "N/A"}
                        </td>
                        <td className="py-3 px-2">
                          {/* {holiday.startDate
                            ? new Date(holiday.startDate).toLocaleDateString()
                            : "N/A"} */}
                          {holiday.startDate
                            ? formattedDate(holiday.startDate)
                            : "N/A"}
                        </td>
                        <td className="py-3 px-2">
                          {holiday.holidayApplicabilities
                            ? holiday.holidayApplicabilities[0].applicableOn
                            : "N/A"}
                        </td>
                        <td className="py-3 px-2">{holiday.modifiedBy}</td>
                        <td className="py-3 px-2">
                          {holiday.updatedAt
                            ? formattedDate(holiday.updatedAt)
                            : "N/A"}
                        </td>
                        <td className="py-3 px-2">
                          {holiday.status === true ? "Active" : "Inactive"}
                        </td>
                        <td className="py-3 px-2">
                          <i
                            className="ti ti-regular ti-pencil py-2 px-4 hover:text-white cursor-pointer"
                            onClick={() => handleEdit(holiday)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-10 w-full">
              <br />
              <div className="skeleton h-32 "></div>
            </div>
          )}
        </div>
      </div>

      {/* Updated modal */}
      {editingItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10  rounded w-1/2 relative overflow-y-auto max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button
                className="-mt-4 -mr-4"
                onClick={() => setEditingItem(null)}
              >
                <svg
                  className="swap-on mt--10 fill-current hover hover:bg-blue-300 rounded-full"
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-lg font-semibold mb-2">Holiday Details</h4>
            {/* {JSON.stringify(editingItem)}
            {JSON.stringify(holidayApplicability)} */}
            <div className="container mx-auto">
              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Holiday Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Holiday Name"
                      value={editingItem.name}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Holiday Type
                    </label>
                    <select
                      name="holidayType"
                      value={editingItem?.holidayType?._id}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                    >
                      <option value="">Select Holiday Type</option>
                      {holidayType &&
                        holidayType.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter Description"
                      value={editingItem.description}
                      onChange={handleInputChange}
                      className="textarea focus:bg-gray-100 placeholder:text-gray-200 text-black textarea-bordered w-full mb-3 mt-1"
                    ></textarea>
                  </span>

                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editingItem.status}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex items-center">
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={dayjs(editingItem.startDate).format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                  <span className="mb-2 w-1/2 ml-8">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={
                        editingItem.endDate
                          ? dayjs(editingItem.endDate).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                </div>
              </div>

              {editingItem.holidayApplicabilities.map(
                (applicability, index) => (
                  <div className="px-4 h-50 h-fixed" key={index}>
                    <div className="flex items-center">
                      <span className="mb-2 w-1/2">
                        <label className="block text-sm font-medium text-gray-700">
                          ({index + 1}) Applicable On
                        </label>
                        <select
                          name="applicableOn"
                          value={applicability.applicableOn}
                          onChange={(e) =>
                            handleApplicabilityChange(
                              index,
                              e.target.name,
                              e.target.value
                            )
                          }
                          className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                        >
                          <option value="">Select Applicability</option>
                          <option value="Department">Department</option>
                          <option value="Designation">Designation</option>
                          <option value="Employee">Employee</option>
                          <option value="Role">Role</option>
                        </select>
                      </span>
                      {editingItem.holidayApplicabilities.length > 1 && (
                        <span className="ml-auto">
                          <button
                            className="flex items-center justify-center text-center text-red-600"
                            onClick={() => removeApplicability(index)}
                          >
                            <i className="ti ti-solid ti-circle-minus px-1"></i>
                            <span className="mr-2">Remove Applicability</span>
                          </button>
                        </span>
                      )}
                    </div>
                    {applicability.applicableOn && (
                      <div className="flex mt-3">
                        <span className="mb-2 w-1/2">
                          <label className="block text-sm font-medium text-gray-700">
                            {applicability.applicableOn}
                          </label>
                          <Select
                            mode="multiple"
                            placeholder="Select applicability"
                            value={applicability.additionalField}
                            onDropdownVisibleChange={() =>
                              fetchAllHolidayApplicability(
                                applicability.applicableOn
                              )
                            }
                            onChange={(value) =>
                              handleApplicabilityChange(
                                index,
                                "additionalField",
                                value
                              )
                            }
                            className="focus:bg-gray-100 placeholder:text-gray-200 text-black bordered w-full mb-3 mt-1"
                          >
                            {holidayApplicability &&
                              holidayApplicability.map((type) => (
                                <Option key={type._id} value={type._id}>
                                  {type.name}
                                </Option>
                              ))}
                          </Select>
                        </span>
                        <span className="mb-2 ml-8 w-1/2"></span>
                      </div>
                    )}
                  </div>
                )
              )}
              <div className="flex justify-start px-3">
                <button
                  className="flex items-center justify-center text-center"
                  onClick={addApplicability}
                >
                  <span className="flex items-center text-black-100">
                    <i className="ti ti-solid ti-circle-plus px-1"></i>
                    <span className="mr-2">Add Applicability</span>
                  </span>
                </button>
              </div>

              <div className="justify-items-center px-4 mt-4">
                <div className="w-full">
                  <button
                    type="button"
                    className="text-white rounded bg-green-400 hover:bg-green-600 px-4 py-2.5"
                    onClick={() => {
                      setOverlayVisible(true);
                    }}
                  >
                    {updateLoader ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Update"
                    )}
                  </button>
                  <button
                    onClick={() => setOverlayVisibleDelete(true)}
                    className="ml-3 text-white rounded bg-red-400 hover:bg-red-600 px-4 py-2.5"
                  >
                    {deleteLoader ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
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
                Are you sure you want to update the '{editingItem.name}' Holiday
                ?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={toggleOverlay}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateHoliday(editingItem._id)}
                  className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* delete Confirmation */}
      {overlayVisibleDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {deleteLoader ? (
            <div className="bg-white p-10 rounded shadow-lg">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="bg-white p-10 rounded shadow-lg">
              <p className="text-center mb-4">
                Are you sure you want to Delete '{editingItem.name}' Holiday?
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

      {/* view Holiday Type  */}
      {isPopoverOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-5 p-10  rounded w-1/2 relative max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300"
                  onClick={() => setIsPopoverOpen(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-lg font-semibold mb-3">Holiday Type List</h4>
            <ul className="flex justify-center">
              <table className="border w-full rounded text-left px-5">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Type Name</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100 w-full">
                  {holidayType?.map((type, index) => (
                    <tr key={index} className="border-b hover:bg-blue-300">
                      <td className="py-3 px-4">{type.name}</td>
                      <td className="py-3 px-4">
                        <i
                          className="ti ti-regular ti-pencil py-2 px-4 hover:text-white cursor-pointer"
                          onClick={() => handleTypeEdit(type)}
                        ></i>
                      </td>
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

      {/* Updated modal */}
      {editingHolidayType && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded max-w-md relative">
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300"
                  onClick={() => setEditingHolidayType(null)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-lg font-semibold mb-2">Edit Holiday Type</h4>
            {/* {JSON.stringify(editingHolidayType)} */}
            <input
              type="text"
              name="holidayType"
              value={editingHolidayType.name} // Bind the value of the input field to editedRoleName state
              onChange={(e) =>
                setEditingHolidayType({
                  ...editingHolidayType,
                  name: e.target.value,
                })
              } // Update the editedRoleName state when the input changes
              placeholder="Enter holiday type name"
              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
            />
            <button
              onClick={() => handleUpdateHolidayType(editingHolidayType._id)}
              className="px-4 py-2 bg-green-400 mt-2 text-white rounded hover:bg-green-600"
            >
              Update
            </button>
            <button
              onClick={() => {
                handleDeleteType(editingHolidayType._id);
              }}
              className="px-4 py-2 ml-2 bg-red-400 mt-2 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
