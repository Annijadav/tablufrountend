"use client";

import { getAllDepartment } from "@/helpers/Services/Department_services";
import {
  getAllDesignation,
  deleteDesignation,
  updateDesignation,
} from "@/helpers/Services/Designation_services";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [designation_data, setDesignation_data] = useState(null);
  const [department_data, setDepartment_data] = useState([]);

  const [editingItem, setEditingItem] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);
  const [departments, setDepartment] = useState([]);

  const getDesignationList = async () => {
    try {
      const res = await getAllDesignation();
      console.log("Response:", res);
      if (res.status === 200) {
        setDesignation_data(res.data);
      } else {
        console.log("error while getting data");
        toast.warning("Something went wrong with the server");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal error");
    }
  };

  const getDepartmentList = async () => {
    try {
      const res = await getAllDepartment();

      setDepartment_data(res.data);
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  const handleDelete = async (designationId) => {
    try {
      const res = await deleteDesignation(designationId); // Call delete API
      if (res.status === 200) {
        // If deletion is successful, refresh department list
        getDesignationList();
        toast.success("Designation deleted successfully");
        setEditingItem(null);
        toggleOverlayDelete();
      } else {
        console.error("Error while deleting record:", res);
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Internal error:", error);
      toast.error("Internal error ");
    }
  };

  const handleEdit = (designation) => {
    setEditingItem(designation);
  };

  const handleUpdateDesignation = async (id) => {
    if (id) {
      try {
        console.log("id", id);
        setUpdateLoader(true);
        // const data = {
        //   name: editingItem.name,
        //   departmentManager: editingItem.departmentManager,
        // };
        // console.log("data", data);
        const res = await updateDesignation(id, {
          name: editingItem.name,
          department: editingItem.department,
        });
        if (res.status === 201) {
          console.log("res", res);
          getDesignationList();
          toast.success("Designation updated successfully");
          setEditingItem(null);
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

  useEffect(() => {
    getDesignationList();
    getDepartmentList();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartment();
      if (res.status === 200) {
        setDepartment(res.data);
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

  const getDepartmentById = (departmentId) => {
    const department = department_data.find(
      (department) => department._id === departmentId
    );
    return department ? department.name : "Unknown";
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlayDelete = () => {
    setOverlayVisibleDelete(!overlayVisibleDelete);
  };

  return (
    // to show data in tree structure
    // <div className="card">
    //       {designation_data ? (
    //          <div className="grid grid-cols-1 gap-4">
    //          {Object.keys(designation_data).map((departmentName, index) => (
    //            <div key={departmentName} className="w-full m-2 rounded shadow-md">
    //              <h2 className="text-lg font-semibold m-2">{departmentName}</h2>
                 
    //              <ul className="list-disc pl-4 gap-2">
    //                {designation_data[departmentName].map((designation, idx) => (
    //                  <li key={designation._id} className="flex items-center mb-2">
    //                    <span className="font-semibold mr-2">{idx + 1}</span>
    //                    <span className="mr-2">{designation.name}</span>
    //                    <span className="text-gray-500 text-sm">
    //                      Created at: {new Date(designation.createdAt).toLocaleDateString()}
    //                    </span>
    //                  </li>
    //                ))}
    //              </ul>
    //            </div>
    //          ))}
    //        </div>
    //       ) : (
    //         <div className="flex flex-col gap-4 p-10 w-full">
    //           <br />
    //           <div className="skeleton h-32 w-full"></div>
    //         </div>
    //       )}
    //     </div>
    <div>
      <div>
        <div className="card">
          {designation_data ? (
            <div className="card-body">
              <div className="flex justify-end">
                <Link href="/dashboard/designation/addDesignation">
                  <button className="btn btn-primary flex items-center justify-center text-center">
                    <span className="flex items-center">
                      <i class="ti ti-solid ti-plus px-1"></i>

                      <span className="mr-2">Add Designation</span>
                    </span>
                  </button>
                </Link>
              </div>
              <p className="text-2xl font-bold mb-6">Designation List</p>
              <table className="min-w-full border rounded">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Department Name</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {designation_data.map((designation) => (
                    <tr
                      key={designation.id}
                      className="border-b hover:bg-blue-300"
                    >
                      <td className="py-3 px-4">{designation.name}</td>
                      <td className="py-3 px-4">
                        {designation.department.name}
                      </td>
                      <td className="py-3 px-4">
                        <i
                          className="ti ti-regular ti-pencil py-2 px-4  hover:text-white cursor-pointer"
                          onClick={() => handleEdit(designation)}
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
            <h4 className="text-lg font-semibold mb-2">Designation Details</h4>
            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
              Name
            </p>
            <input
              type="text"
              name="name"
              value={editingItem.name}
              onChange={handleInputChange}
              placeholder="Enter Designation Name"
              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4 "
            />
            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
              Department
            </p>
            <select
              name="department"
              onChange={handleInputChange}
              value={editingItem.department}
              className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
            >
              <option value="">Please Select</option>
              {departments.map((department) => (
                <option value={department._id}>{department.name}</option>
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
                Are you sure you want to update the Designation Details?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={toggleOverlay}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateDesignation(editingItem._id)}
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
                Are you sure you want to Delete the Designation Details?
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
