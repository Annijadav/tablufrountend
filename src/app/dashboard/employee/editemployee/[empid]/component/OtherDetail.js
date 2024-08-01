import {
  delete_eduById,
  update_Education,
  update_EmergencyDetail,
  update_eduById,
} from "@/helpers/Services/Employee_services";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { emergencyContactValidation } from "../validations/emergencyContactValidation";
import { educationValidation } from "../validations/educationValidation";

function OtherDetail({ data, edudetail, refreshdata, userid }) {
  const [EducationDetail, setEducationDetail] = useState([
    {
      diplomaDegreeName: "",
      instituteName: "",
      PassingYear: "",
      percentage: "",
    },
  ]);
  // console.log(edudetail);
  const [contact, setContact] = useState({
    name: data?.name,
    address: data?.address,
    mobileNo: data?.mobileNo,
    relationShip: data?.relationShip,
    email: data?.email,
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const submit_Other_details = async () => {
    const { error } = emergencyContactValidation(contact);
    if (error) {
      toast.error(error.details[0].message);
      return;
    }

    try {
      const response1 = await update_EmergencyDetail(userid, contact);
      if (response1.status === 201) {
        toast.success(response1.data.message);
      } else {
        toast.error(response1.data.message);
      }
    } catch (error) {
      toast.error("somthing wrong...");
    }
  };

  const [editingItem, setEditingItem] = useState(null);
  const handleSingleEdit = async (item) => {
    setEditingItem(item);
  };
  const [updateLoader, setUpdateLoader] = useState(false);

  const handleUpdate = async (rid) => {
    setUpdateLoader(true);
    const { error } = educationValidation(editingItem);
    if (error) {
      toast.error(error.details[0].message);
      setUpdateLoader(false);
      return;
    }
    const response = await update_eduById(userid, rid, editingItem);
    if (response.status === 201) {
      toast.success(response.data.message);
      setUpdateLoader(false);
      refreshdata();
      setEditingItem(null);
    } else {
      toast.error(response.response.data.message);
      console.log(response);
      setUpdateLoader(false);
    }
  };
  const [deleteLoader, setDeleteLoader] = useState(false);
  const handleDelete = async (rid) => {
    setDeleteLoader(true);
    try {
      const response = await delete_eduById(userid, rid);

      if (response.status === 201) {
        toast.success(response.data.message);
        setEditingItem(null);
        setDeleteLoader(false);
        refreshdata();
      } else {
        toast.error(response.response.data.message);
        setDeleteLoader(false);
      }
    } catch (error) {
      setDeleteLoader(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({
      ...editingItem,
      [name]: value,
    });
  };

  const [newItem, setNewItem] = useState(null);
  const btnAddNew = async () => {
    setNewItem({
      diplomaDegreeName: "",
      instituteName: "",
      PassingYear: "",
      percentage: "",
    });
  };
  const submit_addnew = async () => {
    if (
      !newItem.diplomaDegreeName ||
      !newItem.instituteName ||
      !newItem.PassingYear ||
      !newItem.percentage
    ) {
      toast.error("please fill all fields..");
    } else {
      setUpdateLoader(true);
      const { error } = educationValidation(newItem);
      if (error) {
        toast.error(error.details[0].message);
        console.log(educationValidation(newItem));
        setUpdateLoader(false);
        return;
      }
      const response = await update_Education(userid, newItem);
      setUpdateLoader(false);
      if (response.status === 201) {
        setNewItem({
          diplomaDegreeName: "",
          instituteName: "",
          PassingYear: "",
          percentage: "",
        });
        toast.success(response.data.message);
        setNewItem(null);
        setUpdateLoader(false);
        refreshdata();
      } else {
        toast.error(response.response.data.message);
      }
    }
  };
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };
  return (
    <>
      <div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            <br />
            <h4>emergency Contacts Details</h4>
            <hr />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Name
                </p>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleContactChange}
                  value={contact.name}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Address
                </p>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  onChange={handleContactChange}
                  value={contact.address}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Mobile Number
                </p>
                <input
                  type="text"
                  name="mobileNo"
                  placeholder="Mobile Number"
                  onChange={handleContactChange}
                  value={contact.mobileNo}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Relationship
                </p>
                <input
                  type="text"
                  name="relationShip"
                  placeholder="Relationship"
                  onChange={handleContactChange}
                  value={contact.relationShip}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Email
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleContactChange}
                  value={contact.email}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
            </div>
            <div className="flex w-full flex-col-reverse">
              <div>
                <button
                  type="button"
                  className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={submit_Other_details}
                >
                  Update
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
            <br />
            <br />
            <div>
              <hr />
              <h4>Education Details</h4>
              <br />

              <div className="overflow-x-auto">
                <table className="min-w-full rounded divide-gray-200">
                  {/* Table header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="font-bold">Diploma/Degree Name</span>
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="font-bold">Institute Name</span>
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="font-bold">Percentage</span>
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="font-bold">Passing Year</span>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="bg-white divide-gray-200">
                    {edudetail.map((degree) => (
                      <tr
                        key={degree._id}
                        className="transition-colors duration-300 hover:bg-gray-100"
                      >
                        <td className="px-2 py-2 whitespace-nowrap">
                          {degree.diplomaDegreeName}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {degree.instituteName}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {degree.percentage}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {degree.PassingYear}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleSingleEdit(degree)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="text-white mr-8 mt-10 rounded bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={btnAddNew}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          {editingItem && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-10 rounded max-w-md relative">
                <h4 className="text-lg font-semibold mb-4">Edit Detail</h4>

                <button
                  onClick={() => setEditingItem(null)}
                  className="absolute top-4 right-4 text-red-400 px-4 py-2 rounded hover:text-white hover:bg-red-600"
                >
                  Cancel
                </button>
                <input
                  type="text"
                  name="diplomaDegreeName"
                  value={editingItem.diplomaDegreeName}
                  onChange={handleInputChange}
                  placeholder="Diploma/Degree Name"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <input
                  type="text"
                  name="instituteName"
                  value={editingItem.instituteName}
                  onChange={handleInputChange}
                  placeholder="Institute Name"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <input
                  type="text"
                  name="percentage"
                  value={editingItem.percentage}
                  onChange={handleInputChange}
                  placeholder="Percentage"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <input
                  type="date"
                  name="PassingYear"
                  value={editingItem.PassingYear}
                  onChange={handleInputChange}
                  placeholder="Percentage"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <button
                  onClick={() => handleUpdate(editingItem._id)}
                  className="px-4 py-2 bg-green-400 mt-2 text-white rounded hover:bg-green-500"
                >
                  {updateLoader ? (
                    <span
                      className="loading loading-spinner loading-sm
                      "
                    ></span>
                  ) : (
                    "Upadte"
                  )}
                </button>
                <button
                  onClick={() => handleDelete(editingItem._id)}
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

          {newItem && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-10 rounded w-3/5 max-w-lg relative">
                <h4 className="text-lg font-semibold mb-4">Add new Record</h4>
                <button
                  onClick={() => setNewItem(null)}
                  className="absolute top-4 right-4 text-red-400 px-4 py-2 rounded hover:text-white hover:bg-red-600"
                >
                  Cancel
                </button>
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Diploma / Degree Name
                </p>

                <input
                  type="text"
                  name="diplomaDegreeName"
                  value={newItem.diplomaDegreeName}
                  onChange={handleNewItemChange}
                  placeholder="Diploma/Degree Name"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Institute Name
                </p>
                <input
                  type="text"
                  name="instituteName"
                  value={newItem.instituteName}
                  onChange={handleNewItemChange}
                  placeholder="Institute Name"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Percentage
                </p>
                <input
                  type="text"
                  name="percentage"
                  value={newItem.percentage}
                  onChange={handleNewItemChange}
                  placeholder="Percentage"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Passing date
                </p>
                <input
                  type="date"
                  name="PassingYear"
                  value={newItem.PassingYear}
                  onChange={handleNewItemChange}
                  placeholder="PassingYear"
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-4"
                />
                <button
                  onClick={submit_addnew}
                  className="px-4 py-2 bg-green-400 mt-2 text-white rounded hover:bg-green-500"
                >
                  {updateLoader ? (
                    <span
                      className="loading loading-spinner loading-sm
                      "
                    ></span>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default OtherDetail;