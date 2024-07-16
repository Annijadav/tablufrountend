"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  postAddHolidayType,
  getAllHolidayType,
  getAllHolidayApplicableOn,
  postAddHoliday,
} from "@/helpers/Services/Holiday_services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Select} from "antd";

function Page() {
  const router = useRouter();
  const [holidayData, setHolidayData] = useState({
    name: "",
    holidayType: "",
    description: "",
    startDate: "",
    endDate: "",
    holidayApplicability: [{ applicableOn: "", additionalField: [] }],
  });
  const [isDateRange, setDateRange] = useState(false);
  const [isPopoverType, setIsPopoverType] = useState(false);
  const [name, setName] = useState("");
  const [holidayType, setHolidayType] = useState(null);
  const [holidayApplicability, setHolidayApplicability] = useState("");
  const [decode, setDecode] = useState("");
  const { Option } = Select;

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

  useEffect(() => {
    // Fetch users when component mounts
    fetchAllHolidayType();
    // fetchAllHolidayApplicability();
    const token = localStorage.getItem("authToken");
    // console.log("token", token);
    if (token) {
      setDecode(jwtDecode(token));
      // console.log("decoded", decode);
    } else {
      console.log("Token not found");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHolidayData({
      ...holidayData,
      [name]: value,
    });
  };

  const handleApplicabilityChange = (index, name, value) => {
    console.log("index, name, value", index, name, value);
    if (name === "applicableOn") {
      // Check if the selected applicableOn value already exists in another applicability
      const isAlreadySelected = holidayData.holidayApplicability.some(
        (applicability, idx) =>
          applicability.applicableOn === value && idx !== index
      );

      if (isAlreadySelected) {
        toast.error("This applicability option is already selected.");
        return;
      }
    }

    const newApplicability = [...holidayData.holidayApplicability];
    newApplicability[index] = {
      ...newApplicability[index],
      [name]: value,
    };

    if (name === "applicableOn") {
      newApplicability[index].additionalField = null;
    }

    setHolidayData({
      ...holidayData,
      holidayApplicability: newApplicability,
    });
  };

  const addApplicability = (index) => {
    setHolidayData({
      ...holidayData,
      holidayApplicability: [
        ...holidayData.holidayApplicability,
        { applicableOn: "", additionalField: [] },
      ],
    });
  };

  const removeApplicability = (index) => {
    if (holidayData.holidayApplicability.length > 1) {
      const newApplicability = holidayData.holidayApplicability.filter(
        (_, i) => i !== index
      );
      setHolidayData({
        ...holidayData,
        holidayApplicability: newApplicability,
      });
    }
  };

  const handleHolidayType = async () => {
    if (!name) {
      toast.error("Please enter holiday type");
      return;
    }
    try {
      //   const data = {
      //     name: name,
      //     department: department,
      //   };
      const res = await postAddHolidayType({ name: name });
      console.log(res);
      if (res.status === 201) {
        setIsPopoverType(false);
        toast.success(`${name} holiday type added successfully`);
        fetchAllHolidayType();
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };
  // console.log("decoded", decode);
  const handleHoliday = async () => {
    if (!holidayData.name) {
      toast.error("Please enter holiday name");
      return;
    }
    if (!holidayData.holidayType) {
      toast.error("Please select holiday type");
      return;
    }
    if (!holidayData.description) {
      toast.error("Please enter holiday description");
      return;
    }
    if (!holidayData.startDate) {
      toast.error("Please select holiday start date");
      return;
    }
    for (
      let index = 0;
      index < holidayData.holidayApplicability.length;
      index++
    ) {
      const applicability = holidayData.holidayApplicability[index];
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
      const data = {
        name: holidayData.name,
        holidayType: holidayData.holidayType,
        description: holidayData.description,
        startDate: holidayData.startDate,
        endDate: holidayData.endDate,
        holidayApplicability: holidayData.holidayApplicability,
        modifiedBy: decode.firstName + " " + decode.lastName,
      };
      const res = await postAddHoliday(data);
      console.log(res);
      if (res.status === 201) {
        toast.success(`${name} holiday added successfully`);
        router.push("/dashboard/holiday");
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title fw-semibold ml-4">Add Holiday</h5>
          {/* {JSON.stringify(holidayData)} */}
          <div className="container mx-auto">
            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Holiday Name"
                    value={holidayData.name}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
                <span className="mb-2 ml-8 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Holiday Type
                  </label>
                  <select
                    name="holidayType"
                    value={holidayData.holidayType}
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

            <div className="flex justify-start px-3">
              <button
                className="flex items-center justify-center text-center"
                onClick={() => setIsPopoverType(true)}
              >
                <span className="flex items-center text-black-100">
                  <i className="ti ti-solid ti-circle-plus px-1"></i>
                  <span className="mr-2">Add Holiday Type</span>
                </span>
              </button>
            </div>

            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    value={holidayData.description}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
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
                    value={holidayData.startDate}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
                {isDateRange === false && (
                  <span className="ml-auto">
                    <button
                      className="flex items-center justify-center text-center rounded"
                      onClick={() => setDateRange(true)}
                    >
                      <i className="ti ti-solid ti-circle-plus px-1"></i>
                      <span className="mr-2">Add Date Range</span>
                    </button>
                  </span>
                )}
                {isDateRange === true && (
                  <span className="mb-2 w-1/2 ml-8">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={holidayData.endDate}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                )}
              </div>
            </div>

            {isDateRange === true && (
              <div className="flex justify-start px-3 mb-4">
                <button
                  className="flex items-center justify-center text-center"
                  onClick={() => setDateRange(false)}
                >
                  <span className="flex items-center text-black-100">
                    <i className="ti ti-solid ti-circle-minus px-1"></i>
                    <span className="mr-2">Remove Date Range</span>
                  </span>
                </button>
              </div>
            )}

            {holidayData.holidayApplicability.map((applicability, index) => (
              <div className="px-4" key={index}>
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
                  {holidayData.holidayApplicability.length > 1 && (
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
            ))}

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
                  className="text-white rounded bg-blue-600 hover:bg-blue-800  px-5 py-2.5"
                  onClick={handleHoliday}
                >
                  Save
                </button>
                <button
                  onClick={() => router.push("/dashboard/holiday")}
                  className="ml-3 text-white rounded bg-gray-300 hover:bg-gray-500  px-5 py-2.5"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* create holiday type */}
      {isPopoverType && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10 rounded max-w relative overflow-y-auto max-h-screen w-1/3"
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300 "
                  onClick={() => {
                    setIsPopoverType(false), setName(null);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-md font-semibold mb-4">Create Holiday Type</h4>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Type Name
              </label>
              <input
                type="text"
                name="holidayTypeName"
                placeholder="Enter holiday type name"
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                onClick={handleHolidayType}
                className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
