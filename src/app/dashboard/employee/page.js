"use client";
import {
  get_Employees,
  get_EmployeesByPage,
  searchEmp,
  update_employeeStatus,
} from "@/helpers/Services/Employee_services";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Employee from "./_components/Employee";
import { toast } from "react-toastify";
import Pagination from "./_components/Pagination";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Spinner,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { FilterIcon, ScanEye } from "lucide-react";
import BulkUpload from "./_components/BulkUpload";
import FilterEmployee from "./_components/FilterEmployee";

function page() {
  const router = useRouter();
  const [emp, setemp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [empCount, setempCount] = useState(null);
  const [pageCount, setpageCount] = useState(null);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["All"]));
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [showBulk, setShowBulk] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState(false);
  const [employeeStatusKeys, setEmployeeStatusKeys] = useState("All");
  const [employeeTypeKeys, setEmployeeTypeKeys] = useState("All");
  const [employeeGenderKeys, setEmployeeGenderKeys] = useState("All");
  const [employeeDepartmentKeys, setEmployeeDepartmentKeys] = useState("All");
  const [employeeDesignationKeys, setEmployeeDesignationKeys] = useState("All");
  const [showFullScreen, setShowFullScreen] = useState(false);
  useEffect(() => {
    getEmpList();
  }, [
    postPerPage,
    currentPage,
    search,
    sortBy,
    sortOrder,
    employeeStatusKeys,
    employeeTypeKeys,
    employeeGenderKeys,
    employeeDepartmentKeys,
    employeeDesignationKeys,
  ]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const handleFilter = (param) => {
    if (sortBy === param) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(param);
      setSortOrder("asc");
    }
  };
  const handleEmloyeeFilters = (key, filterName) => {
    if (filterName == "employeeStatusKeys") {
      setEmployeeStatusKeys(key);
    } else if (filterName == "employeeTypeKeys") {
      setEmployeeTypeKeys(key);
    } else if (filterName == "employeeGenderKeys") {
      setEmployeeGenderKeys(key);
    } else if (filterName == "employeeDepartmentKeys") {
      setEmployeeDepartmentKeys(key);
    } else if (filterName == "employeeDesignationKeys") {
      setEmployeeDesignationKeys(key);
    } else if (filterName == "clear") {
      setEmployeeStatusKeys("All");
      setEmployeeTypeKeys("All");
      setEmployeeGenderKeys("All");
      setEmployeeDepartmentKeys("All");
      setEmployeeDesignationKeys("All");
      setFilter(!filter);
    }
  };
  const getEmpList = async () => {
    setemp(null);
    try {
      const res = await get_EmployeesByPage(postPerPage, currentPage, {
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
        empStatus: employeeStatusKeys,
        empType: employeeTypeKeys,
        gender: employeeGenderKeys,
        department: employeeDepartmentKeys,
        designation: employeeDesignationKeys,
      });
      if (res.status === 200) {
        setemp(res.data.emps);
        setpageCount(res.data.page);
        setempCount(res.data.employeeCount);
      } else {
        toast.warning("Something went wrong with the server");
      }
    } catch (error) {
      toast.error("Internal error");
      console.log(error);
    }
  };

  const chanagePage = async (page) => {
    try {
      if(currentPage!=page){
      setemp(null);
      await setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };
  const chanagePostPerPage = async (count) => {
    try {
      await setPostPerPage(count);
      setemp(null);
      await setCurrentPage(1);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };
  const handleRowClick = (employeeId) => {
    router.push(`/dashboard/employee/viewemployee/${employeeId}`);
  };
  const handleStatusChange = async (status, id) => {
    const newStatus = status;
    setemp(null);
    try{
    const res = await update_employeeStatus(id, { Status: newStatus });
    if (res.status === 200) {
      toast.success(res.data.message);
      getEmpList();
    }
    else
    {
      toast.success(res.response.data.message);
    }}catch(error)
    {
      toast.error("internal error")
      console.log(error);
    }
    // Update the employee status in the backend using the newStatus value
  };

  const timerRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {}, 1000);
  };
  const goSearch = async (search) => {};

  return (
    <>
      {showBulk && <BulkUpload setShowBulk={setShowBulk} />}

      <div className="text-sm breadcrumbs ">
        <ul>
          <li className="font-semibold	">
            <Link className="text-black	" href={"/dashboard/"}>
              Home
            </Link>
          </li>

          <li>Employees </li>
        </ul>
      </div>
      <div class={showFullScreen?"fixed inset-0 z-50 bg-white w-full overflow-auto": "card w-full "}>
        <div class="card-body p-2 m-1">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Employee List</h3>
            <div className="flex items-center">
              <div class="md:inline-block mr-4 md:w-auto w-full">
                <Link href="employee/newemployee">
                  <button class="btn btn-primary flex items-center justify-center text-center">
                    <span class="flex items-center">
                      <span class="mr-2">Add New</span>
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

              <button
                class={`btn btn-${showFullScreen?"danger":"primary"} m-0 p-2 flex items-center justify-center text-center`}
                // onClick={() => {
                //   setShowBulk(true);
                // }}
                onClick={() => {
                  setShowFullScreen(!showFullScreen);
                }}
              >
                <ScanEye />
              </button>
            </div>
          </div>

          <hr />
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex overflow-auto items-center mb-4 md:mb-0 md:w-auto w-full">
              <div>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow border-none"
                    name="search"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    value={search}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        goSearch(search);
                      }
                    }}
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
              <Button className="ml-2" onClick={() =>{handleEmloyeeFilters("","clear")}} isIconOnly color="green" variant="faded" aria-label="Take a photo">
              <FilterIcon />
      </Button>
              
            </div>
          </div>
          {filter && (
            <FilterEmployee handleEmloyeeFilters={handleEmloyeeFilters} />
          )}
          {emp ? (
            <div className="w-full">
              <Employee
                emp={emp}
                currentPage={currentPage}
                postPerPage={postPerPage}
                handleRowClick={handleRowClick}
                handleStatusChange={handleStatusChange}
                handleFilter={handleFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                getEmpList={getEmpList}
              />
              <Pagination
                currentPage={currentPage}
                postPerPage={postPerPage}
                empCount={empCount}
                pageCount={pageCount}
                chanagePage={chanagePage}
                chanagePostPerPage={chanagePostPerPage}
              />
            </div>
          ) : (
            <Spinner color="primary" size="lg" label="Loading.." />
          )}
        </div>
      </div>
    </>
  );
}

export default page;