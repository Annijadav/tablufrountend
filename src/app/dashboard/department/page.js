"use client";
import {
  getDepartmentPagination,
  deleteDepartment,
  updateDepartment,
} from "@/helpers/Services/Department_services";
import { getFullname } from "@/helpers/Services/user_services";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import { validateForm } from "../../../app/dashboard/department/validations/departmentValidation";

function page() {
  const [department_data, setDepartment_data] = useState(null);

  const [manager_data, setManager_data] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalDepartment, settotalDepartment] = useState(0);
  const [users, setUsers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);
  const [decode, setDecode] = useState("");

  const getDepartmentList = async (currentPage, recordsPerPage) => {
    try {
      console.log("currentPage", currentPage);
      console.log("recordsPerPage", recordsPerPage);
      const res = await getDepartmentPagination(currentPage, recordsPerPage);
      console.log("Response:", res);
      if (res.status === 200) {
        setTotalPages(res.data.totalPages);
        settotalDepartment(res.data.totalDepartments);
        setRecordsPerPage(res.data.recordsPerPage);
        setDepartment_data(res.data.department_data);

        console.log("res.data.department_data", res.data.department_data);
      } else {
        console.log("error while getting data");
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getManagerList = async () => {
    try {
      const res = await getFullname();
      console.log(res, "manager list");
      setManager_data(res.data);
      console.log("manager_data...", manager_data);
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  const handleDelete = async (departmentId) => {
    try {
      const res = await deleteDepartment(departmentId);
      if (res.status === 200) {
        getDepartmentList(currentPage, recordsPerPage);
        toast.success("Record deleted successfully");
        setEditingItem(null);
        toggleOverlayDelete();
      } else {
        console.error(res.response.data.message);
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.error("Internal error:", error);
      toast.error("Internal error");
    }
  };

  const handlePageChange = (currentPage, recordsPerPage) => {
    getDepartmentList(currentPage, recordsPerPage);
  };

  const handleEdit = (department) => {
    console.log("department", department);
    setEditingItem(department);
    // setEditedDepartmentData({
    //   name: department.name,
    //   departmentManager: department.departmentManager,
    // });
  };

  const handleUpdateDepartment = async (id) => {
    if (id) {
      try {
        console.log("id", id);
        setUpdateLoader(true);
        const data = {
          name: editingItem.name,
          departmentManager: editingItem.departmentManager,
        };
        // console.log("data", data);
        const error = validateForm(data);
        if (error) {
          return toast.error(error);
        } else {
          const res = await updateDepartment(id, data);
          if (res.status === 201) {
            console.log("res", res);
            getDepartmentList(currentPage, recordsPerPage);
            toast.success("Department updated successfully");
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

  useEffect(() => {
    getDepartmentList(currentPage, recordsPerPage);
    getManagerList();
  }, [currentPage, recordsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getFullname();
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getNameById = (managerId) => {
    const manager = manager_data.find((manager) => manager._id === managerId);
    return manager ? manager.fullName : "Unknown";
  };

  // const indexOfLastRecord = currentPage * recordsPerPage;
  // const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentRecords =
  //   department_data &&
  //   department_data.slice(indexOfFirstRecord, indexOfLastRecord);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlayDelete = () => {
    setOverlayVisibleDelete(!overlayVisibleDelete);
  };

  const currentRecords = department_data
    ? department_data.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
      )
    : [];

  return (
    <div>
      <div>
        <div className="card">
          {department_data ? (
            <div className="card-body">
              <div className="flex justify-end">
                <Link href="/dashboard/department/addDepartment">
                  <button className="btn btn-primary flex items-center justify-center text-center">
                    <span className="flex items-center">
                      <i class="ti ti-solid ti-plus px-1"></i>

                      <span className="mr-2">Add Department</span>
                    </span>
                  </button>
                </Link>
              </div>
              <p className="text-2xl font-bold mb-6">Department List</p>
              {/* {JSON.stringify(currentRecords)} */}
              <table className="min-w-full border rounded">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Department Manager</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {currentRecords &&
                    currentRecords.map((department) => (
                      <tr
                        key={department._id}
                        className="border-b hover:bg-blue-300"
                      >
                        <td className="py-3 px-4">{department.name}</td>
                        <td className="py-3 px-4">
                          {department.departmentManager.loginDetails.firstName}{" "}
                          {department.departmentManager.loginDetails.lastName}
                        </td>
                        <td className="py-2 px-4">
                          <i
                            className="ti ti-regular ti-pencil py-2 px-4  hover:text-white cursor-pointer"
                            onClick={() => handleEdit(department)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <Pagination
                className="flex justify-end mt-3"
                total={totalDepartment}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[5, 10, 20, 50, 100]}
                showTotal={(total) => `Total ${total} items`}
                responsive
                pageSize={recordsPerPage}
                onChange={(current, pageSize) =>
                  handlePageChange(current, pageSize, decode.companyId)
                }
              />
            </div>
          ) : (
            // <div className="flex flex-col gap-4 p-10 w-full">
            //   <br />
            //   <div className="skeleton h-32 w-full"></div>
            // </div>
            <div className="card-body">
              <div className="flex justify-end">
                <Link href="/dashboard/department/addDepartment">
                  <button className="btn btn-primary flex items-center justify-center text-center">
                    <span className="flex items-center">
                      <i class="ti ti-solid ti-plus px-1"></i>

                      <span className="mr-2">Add Department</span>
                    </span>
                  </button>
                </Link>
              </div>
              <p className="text-2xl font-bold mb-6">Department List</p>

              <div className="bt-4">
                <h4>Department is emplty!</h4>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Updated modal */}
      {editingItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded max-w-md relative">
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
            <h4 className="text-lg font-semibold mb-2">Department Details</h4>
            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
              Name
            </p>
            <input
              type="text"
              name="name"
              value={editingItem.name}
              onChange={handleInputChange}
              placeholder="Enter Department Name"
              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4 "
            />
            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
              Department Manager
            </p>
            <select
              name="departmentManager"
              onChange={handleInputChange}
              value={editingItem.departmentManager._id}
              className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md mb-4 w-full"
            >
              <option value="">Please Select</option>
              {users.map((user) => (
                <option value={user._id}>{user.fullName}</option>
              ))}
            </select>
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
                Are you sure you want to update the Department Details?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={toggleOverlay}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateDepartment(editingItem._id)}
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
                Are you sure you want to Delete the Department Details?
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
    </div>
  );
}

export default page;
