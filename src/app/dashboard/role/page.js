"use client";
import {
  getRoles,
  deleteRole,
  updateRole,
} from "@/helpers/Services/Role_services";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateForm } from "../role/validations/roleValidation";

function page() {
  const [Role_data, setroles_data] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [editedRoleName, setEditedRoleName] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);

  const getRoleList = async () => {
    try {
      const res = await getRoles();
      console.log("Response:", res);
      if (res.status === 200) {
        setroles_data(res.data);
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
    getRoleList();
  }, []);

  const handleDelete = async (roleId) => {
    try {
      setDeleteLoader(true);
      const res = await deleteRole(roleId);
      if (res.status === 200) {
        getRoleList();
        toast.success("Role deleted successfully");
        setEditingItem(null);
        toggleOverlayDelete();
      } else {
        console.error("Error while deleting record:", res);
        toast.error("Failed to delete record");
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
    setEditedRoleName(role.name);
  };

  const handleUpdateRole = async (id) => {
    if (id) {
      try {
        console.log("id", id);
        setUpdateLoader(true);
        const error = validateForm({ name: editedRoleName });
        if (error) {
          return toast.error(error);
        } else {
          const res = await updateRole(id, { name: editedRoleName });
          if (res.status === 201) {
            console.log("res", res);
            getRoleList();
            toast.success("Role updated successfully");
            setEditingItem(null);
            toggleOverlay();
          } else {
            toast.error(res.data);
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

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlayDelete = () => {
    setOverlayVisibleDelete(!overlayVisibleDelete);
  };

  return (
    <div>
      <div>
        <div className="card">
          {Role_data ? (
            <div className="card-body">
              <div className="flex justify-end">
                <Link href="/dashboard/role/addRole">
                  <button className="btn btn-primary flex items-center justify-center text-center">
                    <span className="flex items-center">
                      <i class="ti ti-solid ti-plus px-1"></i>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg> */}
                      <span className="mr-2">Add Role</span>
                    </span>
                  </button>
                </Link>
              </div>
              <p className="text-2xl font-bold mb-6">Role List</p>
              <table className="min-w-full border rounded">
                <thead className="bg-blue-300 text-white">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {Role_data.map((role) => (
                    <tr key={role.id} className="border-b hover:bg-blue-300">
                      <td className="py-3 px-4">{role.name}</td>
                      <td className="py-3 px-4">
                        <i
                          className="ti ti-regular ti-pencil py-2 px-4  hover:text-white cursor-pointer"
                          onClick={() => handleEdit(role)}
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
            <h4 className="text-lg font-semibold mb-2">Role Name</h4>
            {/* <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-red-400 px-4 py-2 rounded hover:text-white hover:bg-red-600"
            >
              Cancel
            </button> */}
            <input
              type="text"
              name="roleName"
              value={editedRoleName} // Bind the value of the input field to editedRoleName state
              onChange={(e) => setEditedRoleName(e.target.value)} // Update the editedRoleName state when the input changes
              placeholder="Enter Role Name"
              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
            />
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
                Are you sure you want to update the Role?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={toggleOverlay}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateRole(editingItem._id)}
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
                Are you sure you want to Delete the Role?
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
