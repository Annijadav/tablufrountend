"use client";
import {
  getAllIndustry,
  deleteIndustry,
  updateIndustry,
  postAddIndustry
} from "@/helpers/Services/Company_services";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [name, setName] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);
  const [industryData, setIndustryData] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [isPopoverIndustry, setIsPopoverIndustry] = useState(false);

  const handleIndustry = async () => {
    if (!name) {
      toast.error("Please enter industry name");
      return;
    }
    try {
      const res = await postAddIndustry({ name: name });
      console.log(res);
      if (res.status === 201) {
        setIsPopoverIndustry(false);
        toast.success(`${name} industry name added successfully`);
        fetchAllIndustry();
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  const fetchAllIndustry = async () => {
    try {
      const res = await getAllIndustry();
      if (res.status === 200) {
        setIndustryData(res.data);
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleIndustryEdit = (industry) => {
    setEditingIndustry(industry);
    setIsPopoverOpen(true);
  };

  const handleUpdateIndustry = async (id) => {
    if (id) {
      if (!editingIndustry.name) {
        toast.error("Please enter industry name");
        return;
      }
      try {
        setUpdateLoader(true);
        const res = await updateIndustry(id, {
          name: editingIndustry.name,
          status: editingIndustry.status ? editingIndustry.status : "not found",
        });
        if (res.status === 201) {
          console.log("res", res);
          fetchAllIndustry();
          toast.success("Industry updated successfully");
          setOverlayVisible(false);
          //   setIsPopoverOpen(true);
          //   setEditingIndustry(null);
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

  const handleDeleteIndustry = async (id) => {
    try {
      setDeleteLoader(true);
      const res = await deleteIndustry(id);
      if (res.status === 201) {
        fetchAllIndustry();
        toast.success("Industry deleted successfully");
        setOverlayVisibleDelete(false);
      } else {
        console.error("resmesssss", res.response.data.message);
        toast.error(res.response.data.message);
      }
    } catch (error) {
      console.error("eooor", error);
      toast.error("error");
    } finally {
      setDeleteLoader(false);
    }
  };

  useEffect(() => {
    fetchAllIndustry();
  }, []);

  return (
    <div>
      <div>
        <div className="card">
          {industryData ? (
            <div className="card-body">
              <div className="flex justify-end">
                <div className="justify-items-center">
                  <div className="w-full">
                    <button
                      onClick={() => setIsPopoverIndustry(true)}
                      className="ml-3 text-white rounded bg-blue-400 hover:bg-blue-600 px-3 py-2.5"
                    >
                      <span className="flex items-center">
                        <i class="ti ti-solid ti-plus mr-1"></i>
                        <span className="mr-2">Add Industry</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold mb-6">Industry List</p>
              {/* {JSON.stringify(company_data)} */}

              <ul className="flex justify-center">
                <table className="min-w-full border rounded text-left">
                  <thead className="bg-blue-300 text-white">
                    <tr>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100">
                    {industryData.map((industry) => (
                      <tr
                        key={industry._id}
                        className="border-b hover:bg-blue-300"
                      >
                        <td className="py-3 px-2">{industry.name}</td>
                        <td className="py-3 px-2">
                          {industry.status === true ? "Active" : "Inactive"}
                        </td>
                        <td className="py-3 px-2">
                          <i
                            className="ti ti-regular ti-pencil py-2 px-4 hover:text-white cursor-pointer"
                            onClick={() => handleIndustryEdit(industry)}
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

      {/* create industry */}
      {isPopoverIndustry && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10 rounded max-w relative overflow-y-auto max-h-screen w-1/3"
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:bg-blue-300 rounded-full"
                  onClick={() => {
                    setIsPopoverIndustry(false), setName(null);
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
            <h4 className="text-md font-semibold mb-4">Create Industry</h4>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter industry name"
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                onClick={handleIndustry}
                className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated industry modal */}
      {isPopoverOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded max-w-md relative">
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4 bg-color-400 rounded-lg">
                <svg
                  className="swap-on mt--10 fill-current bg-color-400 hover:bg-blue-300 rounded-full"
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
            <h4 className="text-lg font-semibold mb-2">Edit Industry</h4>
            {/* {JSON.stringify(editingIndustry)} */}
            <span className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editingIndustry.name}
                onChange={(e) =>
                  setEditingIndustry({
                    ...editingIndustry,
                    name: e.target.value,
                  })
                }
                placeholder="Enter industry name"
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
              />
            </span>
            <span className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={editingIndustry.status}
                onChange={(e) =>
                  setEditingIndustry({
                    ...editingIndustry,
                    status: e.target.value,
                  })
                }
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </span>
            {/* <button
              onClick={() => handleUpdateIndustry(editingIndustry._id)}
              className="px-4 py-2 bg-green-400 mt-2 text-white rounded hover:bg-green-600"
            >
              Update
            </button>
            <button
              onClick={() => {
                handleDeleteIndustry(editingIndustry._id);
              }}
              className="px-4 py-2 ml-2 bg-red-400 mt-2 text-white rounded hover:bg-red-600"
            >
              Delete
            </button> */}
            <div className="justify-items-center px-4 mt-4">
              <div className="w-full">
                <button
                  type="button"
                  className="text-white rounded bg-green-400 hover:bg-green-600 px-4 py-2.5"
                  onClick={() => {
                    setOverlayVisible(true);
                    setIsPopoverOpen(false);
                  }}
                >
                  {updateLoader ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Update"
                  )}
                </button>
                <button
                  onClick={() => {
                    setOverlayVisibleDelete(true);
                    setIsPopoverOpen(false);
                  }}
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
                Are you sure you want to update the '{editingIndustry.name}'
                Industry?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={() => {
                    setOverlayVisible(false), setIsPopoverOpen(true);
                  }}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateIndustry(editingIndustry._id)}
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
                Are you sure you want to Delete '{editingIndustry.name}'
                Industry?
              </p>
              <div className="flex mt-2  justify-end">
                <button
                  onClick={() => {
                    setOverlayVisibleDelete(false), setIsPopoverOpen(true);
                  }}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteIndustry(editingIndustry._id)}
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
