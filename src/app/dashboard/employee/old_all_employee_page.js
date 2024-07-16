"use client";
import { get_Employees, update_employeeStatus } from "@/helpers/Services/Employee_services";
import { getRoles } from "@/helpers/Services/Role_services";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["All"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const router = useRouter();
  const handleRowClick = (employeeId) => {
    router.push(`/dashboard/employee/viewemployee/${employeeId}`);
  };
  const [employee_data, setemployee_data] = useState(null);
  const [roles_data, setroles_data] = useState([]);
  const getEmpList = async () => {
    try {
      const res = await get_Employees();
      if (res.status === 200) {
        setemployee_data(res.data);
        console.log(employee_data, res.data);
      } else {
        console.log("error while getting data");
        toast.warning("somthing wrong with server");
      }
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  const getRolelist = async () => {
    try {
      const res = await getRoles();
      setroles_data(res.data);
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };

  useEffect(() => {
    getEmpList();
    getRolelist();
  }, []);

  const getNameRoleById = (roleid) => {
    const role = roles_data.find((role) => role._id === roleid);
    
    return role ? role.name : "Unknown";
  };
  const filterData = (name) => {
    if (name == "Ascending ") {
      const sorteddata = [...employee_data].sort((a, b) =>
        a.loginDetails.firstName.localeCompare(b.loginDetails.firstName)
      );
      setemployee_data(sorteddata);
    }
    if (name == "Descending") {
      const sorteddata = [...employee_data].sort((a, b) =>
        b.loginDetails.firstName.localeCompare(a.loginDetails.firstName)
      );
      setemployee_data(sorteddata);
    }
  };
  const [search, setSearch] = useState(null);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const filteredEmployees = employee_data?.filter((employee) => {
    if (!search) {
      return true;
    } else {
      const searchWords = search.toLowerCase().split(" ");
      const fullName =
        `${employee.loginDetails.firstName} ${employee.loginDetails.lastName}`.toLowerCase();
      return searchWords.every((word) => fullName.includes(word));
    }
  });
  const handleStatusChange = async (e, id) => {
    const newStatus = e.target.checked;
    toast.success(newStatus);
    const res  = await update_employeeStatus(id,{Status:newStatus});
    if(res.status===200)
    {
      toast.success(res.data.message);
      getEmpList();
    }
    // Update the employee status in the backend using the newStatus value
};
  return (
    <div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li className="font-semibold	">
            <Link className="text-black	" href={"/dashboard/"}>
              Home
            </Link>
          </li>

          <li>Employees </li>
        </ul>
      </div>
      <div>
        <div class="card">
          {employee_data ? (
            <div class="card-body">
              <h3>Employee List</h3>
              <hr />
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0 md:w-auto w-full">
                  <div>
                    <label className="input input-bordered flex items-center gap-2">
                      <input
                        type="text"
                        className="grow border-none"
                        name="search"
                        onChange={handleSearch}
                        placeholder="Search"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>
                  </div>
                  <div className="ml-4">
                    <Dropdown className="">
                      <DropdownTrigger>
                        <Button variant="bordered" className="capitalize">
                          {selectedValue}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        onAction={(key) => filterData(key)}
                      >
                        <DropdownItem key="All">All</DropdownItem>
                        <DropdownItem key="Ascending ">Ascending </DropdownItem>
                        <DropdownItem key="Descending">Descending</DropdownItem>
                        <DropdownItem key="Emoloyee">Emoloyee</DropdownItem>
                        <DropdownItem key="Active">Active</DropdownItem>
                        <DropdownItem key="Inactive">Inactive</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <div className="block md:inline-block md:w-auto w-full">
                  <Link href="employee/newemployee">
                    <button className="btn btn-primary flex items-center justify-center text-center">
                      <span className="flex items-center">
                        <span className="mr-2">Add New</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-user-round-plus"
                        >
                          <path d="M2 21a8 8 0 0 1 13.292-6" />
                          <circle cx="10" cy="8" r="5" />
                          <path d="M19 16v6" />
                          <path d="M22 19h-6" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border rounded bg-gray-200">
                  <thead className="bg-blue-300 text-white">
                    <tr>
                      <th className="py-2 px-4">#</th>
                      <th className="py-2 px-4">Full Name</th>
                      
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Phone</th>
                      <th className="py-2 px-4">Role/Type</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee, index) => (
                      <tr
                        key={employee.id}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-gray-100" : "bg-purewhite "
                        } hover:bg-blue-300`}
                      >
                        <td
                          className="py-2 px-4"
                          onClick={() => handleRowClick(employee._id)}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="py-2 px-4"
                          onClick={() => handleRowClick(employee._id)}
                        >
                          {/* <Link
                            href={`/dashboard/employee/viewemployee/${employee._id}`}
                          > */}
                          {employee.loginDetails.firstName + ' ' + employee.loginDetails.lastName}
                        </td>
                        
                        <td
                          className="py-2 px-4"
                          onClick={() => handleRowClick(employee._id)}
                        >
                          {employee.loginDetails.email}
                        </td>
                        <td
                          className="py-2 px-4"
                          onClick={() => handleRowClick(employee._id)}
                        >
                          {employee.loginDetails.phone}
                        </td>
                        <td
                          className="py-2 px-4"
                          onClick={() => handleRowClick(employee._id)}
                        >
                          {getNameRoleById(employee.loginDetails.role)}
                          <br />
                          {employee?.workDetails?.employeeType}
                        </td>
                        <td className="py-4 px-6 flex justify-center items-center">
                          <div>
                          <label class="inline-flex items-center me-5 cursor-pointer">
  <input type="checkbox" value="" name="employeeStatus" class="sr-only peer" onChange={(e)=>handleStatusChange(e,employee?._id)} defaultChecked={employee?.workDetails?.employeeStatus}/>
  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
  
</label>
                          
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="dropdown dropdown-left dropdown-end">
                            <div
                              tabIndex={0}
                              role="button"
                              className="rounded-md p-2 "
                            >
                              Options
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-blue-100 rounded-box w-42"
                            >
                              <li>
                                <Link
                                  href={`/dashboard/employee/viewemployee/${employee._id}`}
                                >
                                  View
                                </Link>
                              </li>
                              <li>
                                <a>Update</a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-10 w-full">
              <br />
              <div className="skeleton h-32 w-full"></div>

              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
