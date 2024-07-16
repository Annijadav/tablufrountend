import ImageView from "@/components/ImageView";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { terminateUser } from "@/helpers/Services/user_services";
const Employee = ({
  emp,
  currentPage,
  postPerPage,
  handleRowClick,
  handleStatusChange,
  handleFilter,
  sortBy,
  sortOrder,
}) => {
  const startIndex = (currentPage - 1) * postPerPage + 1;
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const openProfileImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowProfile(true);
  };

  const closeProfileImageView = () => {
    setShowProfile(false);
    setSelectedImage("");
  };
  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="toggle-switch-checkbox"
      />
      <span className="toggle-switch-slider"></span>
    </label>
  );
  const handleEmployeeAction =async (key,uid) => {
    if(key=="terminate")
      {
        try
        {
          const res = await terminateUser(uid,{terminate:true});
          console.log(res.data);
          if(res.status == 200)
            {
              toast.success(res.data?.message);
            }
            else{
              toast.error(res.response.data.message);
            }
      }catch(error){
        console.log(error);
        toast.error("internal error");
      }
    }
  };
  return (
    <div>
      {emp ? (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border rounded bg-gray-200 divide-y divide-gray-300">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-1 px-2 font-bold text-sm w-12">#</th>
                  <th className="py-1 px-2 font-bold text-sm w-12">Profile</th>
                  <th
                    onClick={() => handleFilter("firstName")}
                    className="py-1 px-2 hover:bg-blue-400 hover:text-bold cursor-pointer text-sm min-w-[150px]"
                  >
                    <div className="flex items-center">
                      Full Name
                      {sortBy === "firstName" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <ArrowBigUp
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.5}
                              absoluteStrokeWidth
                            />
                          ) : (
                            <ArrowBigDown
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.5}
                              absoluteStrokeWidth
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleFilter("email")}
                    className="py-1 px-2 hover:bg-blue-400 hover:text-bold cursor-pointer text-sm min-w-[150px]"
                  >
                    <div className="flex items-center">
                      Email
                      {sortBy === "email" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <ArrowBigUp
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.5}
                              absoluteStrokeWidth
                            />
                          ) : (
                            <ArrowBigDown
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.5}
                              absoluteStrokeWidth
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleFilter("phone")}
                    className="py-1 px-2 hover:bg-blue-400 hover:text-bold cursor-pointer text-sm min-w-[150px]"
                  >
                    <div className="flex items-center">
                      Phone
                      {sortBy === "phone" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <ArrowBigUp
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.5}
                              absoluteStrokeWidth
                            />
                          ) : (
                            <ArrowBigDown
                              size={16}
                              color="#ffffff"
                              strokeWidth={1.5}
                              absoluteStrokeWidth
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-1 px-2 font-bold text-sm min-w-[80px]">
                    Gender
                  </th>
                  <th className="py-1 px-2 font-bold text-sm min-w-[100px]">
                    Role
                  </th>
                  <th className="py-1 px-2 font-bold text-sm min-w-[100px]">
                    Type
                  </th>
                  <th className="py-1 px-2 font-bold text-sm min-w-[80px]">
                    Status
                  </th>
                  <th className="py-1 px-2 font-bold text-sm min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {emp?.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-purewhite "
                    } hover:bg-blue-300`}
                  >
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {startIndex + index}
                    </td>
                    <td>
                      {employee ? (
                        <div>
                          <img
                            onClick={() =>
                              employee?.personalDetails?.profileImage &&
                              openProfileImageView(
                                employee?.personalDetails?.profileImage
                              )
                            }
                            className="h-10 w-10 m-2 rounded-full object-cover cursor-pointer"
                            src={
                              employee?.personalDetails?.profileImage
                                ? `${employee.personalDetails.profileImage}`
                                : `/assets/images/profile/${
                                    employee.personalDetails?.gender == "Female"
                                      ? "woman.png"
                                      : "man.png"
                                  }`
                            }
                            alt="User"
                          />
                          {showProfile && (
                            <ImageView
                              imageUrl={selectedImage}
                              onClose={closeProfileImageView}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
                      )}
                    </td>
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {employee.loginDetails.firstName +
                        " " +
                        employee.loginDetails.lastName}
                    </td>
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {employee.loginDetails.email}
                    </td>
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {employee.loginDetails.phone}
                    </td>
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {employee?.personalDetails?.gender}
                    </td>
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {employee?.loginDetails?.role?.name}
                    </td>
                    <td
                      className="py-1 px-2"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      {employee?.workDetails?.employeeType}
                    </td>
                    <td className="py-1 px-2">
                      <label className="inline-flex items-center me-5 cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          name="employeeStatus"
                          className="sr-only peer"
                          onChange={(e) => handleStatusChange(e, employee?._id)}
                          defaultChecked={employee?.workDetails?.employeeStatus}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </td>
                    <td className="py-1 px-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-ellipsis-vertical"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Static Actions"
                          onAction={(key) => handleEmployeeAction(key,employee._id)}
                        >
                          <DropdownItem key="new"></DropdownItem>
                          <DropdownItem key="copy">Copy link</DropdownItem>
                          <DropdownItem key="edit">Edit file</DropdownItem>
                          <DropdownItem
                            key="terminate"
                            className="text-danger"
                            color="danger"
                          >
                            Terminate
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default Employee;
