"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Input, message, Radio } from "antd";
import {
  get_EmployeesByPage,
  update_employeeStatus,
} from "@/helpers/Services/Employee_services";
import Link from "next/link";
import FilterEmployee from "../../employee/_components/FilterEmployee";

const Users_setting = () => {
  const router = useRouter();
  const [emp, setEmp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(null);
  const [empCount, setEmpCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("loginDetails.firstName");
  const [sortOrder, setSortOrder] = useState("ascend");
  const [filter, setFilter] = useState(false);
  const [employeeStatusKeys, setEmployeeStatusKeys] = useState("All");
  const [employeeTypeKeys, setEmployeeTypeKeys] = useState("All");
  const [employeeGenderKeys, setEmployeeGenderKeys] = useState("All");
  const [employeeDepartmentKeys, setEmployeeDepartmentKeys] = useState("All");
  const [employeeDesignationKeys, setEmployeeDesignationKeys] = useState("All");
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      render: (text, record, index) =>
        index + 1 + (currentPage - 1) * postPerPage,
    },
    {
      title: "First Name",
      dataIndex: ["loginDetails", "firstName"],
      sorter: (a, b) =>
        a.loginDetails.firstName.localeCompare(b.loginDetails.firstName),
      sortOrder: sortBy === "loginDetails.firstName" && sortOrder,
      onHeaderCell: () => ({
        onClick: () => handleFilter("loginDetails.firstName"),
      }),
    },
    {
      title: "Last Name",
      dataIndex: ["loginDetails", "lastName"],
      sorter: (a, b) =>
        a.loginDetails.lastName.localeCompare(b.loginDetails.lastName),
      sortOrder: sortBy === "loginDetails.lastName" && sortOrder,
      onHeaderCell: () => ({
        onClick: () => handleFilter("loginDetails.lastName"),
      }),
    },
    {
      title: "Email",
      dataIndex: ["loginDetails", "email"],
      sorter: (a, b) =>
        a.loginDetails.email.localeCompare(b.loginDetails.email),
      sortOrder: sortBy === "loginDetails.email" && sortOrder,
      onHeaderCell: () => ({
        onClick: () => handleFilter("loginDetails.email"),
      }),
    },
    {
      title: "Phone",
      dataIndex: ["loginDetails", "phone"],
    },
    {
      title: "Role",
      dataIndex: ["loginDetails", "role", "name"],
    },
    {
      title: "Employee Code",
      dataIndex: ["workDetails", "employeeCode"],
    },
    {
      title: "Status",
      dataIndex: ["workDetails", "employeeStatus"],
      render: (status, record) => (
        <Radio.Group
          value={status ? "Active" : "Inactive"}
          onChange={(e) => handleStatusChange(e.target.value, record._id)}
        >
          <Radio value="Active">Active</Radio>
          <Radio value="Inactive">Inactive</Radio>
        </Radio.Group>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id) => (
        <Button onClick={() => handleRowClick(id)}>View Details</Button>
      ),
    },
  ];

  const getEmpList = async () => {
    setLoading(true);
    try {
      const res = await get_EmployeesByPage(postPerPage, currentPage, {
        search,
        sortBy,
        sortOrder: sortOrder === "ascend" ? "asc" : "desc",
        empStatus: employeeStatusKeys,
        empType: employeeTypeKeys,
        gender: employeeGenderKeys,
        department: employeeDepartmentKeys,
        designation: employeeDesignationKeys,
      });
      if (res.status === 200) {
        setEmp(res.data.emps);
        setPageCount(res.data.page);
        setEmpCount(res.data.employeeCount);
      } else {
        message.warning("Something went wrong with the server");
      }
    } catch (error) {
      message.error("Internal error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleStatusChange = async (status, id) => {
    setLoading(true);
    try {
      const res = await update_employeeStatus(id, {
        Status: status === "Active",
      });
      if (res.status === 200) {
        message.success(res.data.message);
        getEmpList();
      } else {
        message.warning(res.response.data.message);
      }
    } catch (error) {
      message.error("Internal error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (employeeId) => {
    router.push(`/dashboard/employee/viewemployee/${employeeId}`);
  };

  const handleFilter = (param) => {
    if (sortBy === param) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === "ascend" ? "descend" : "ascend"
      );
    } else {
      setSortBy(param);
      setSortOrder("ascend");
    }
  };

  const handleEmployeeFilters = (key, filterName) => {
    switch (filterName) {
      case "employeeStatusKeys":
        setEmployeeStatusKeys(key);
        break;
      case "employeeTypeKeys":
        setEmployeeTypeKeys(key);
        break;
      case "employeeGenderKeys":
        setEmployeeGenderKeys(key);
        break;
      case "employeeDepartmentKeys":
        setEmployeeDepartmentKeys(key);
        break;
      case "employeeDesignationKeys":
        setEmployeeDesignationKeys(key);
        break;
      case "clear":
        setEmployeeStatusKeys("All");
        setEmployeeTypeKeys("All");
        setEmployeeGenderKeys("All");
        setEmployeeDepartmentKeys("All");
        setEmployeeDesignationKeys("All");
        setFilter(false);
        break;
      default:
        break;
    }
  };

  const timerRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => getEmpList(), 1000);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPostPerPage(pagination.pageSize);
    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const handleCheckboxChange = (e, id) => {
    const newSelectedRowKeys = e.target.checked
      ? [...selectedRowKeys, id]
      : selectedRowKeys.filter((key) => key !== id);
    setSelectedRowKeys(newSelectedRowKeys);
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
  return (
    <div
      className={`w-full ${
        showFullScreen
          ? "fixed inset-0 z-50 bg-white overflow-auto"
          : "overflow-x-auto"
      }`}
    >
      <div className="m-1">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          <h3 className="text-lg font-semibold">Employee List</h3>
          <div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
              <Link href="employee/newemployee">
                <Button className="flex flex-row justify-center  w-full md:w-auto">
                  <svg
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Add Employee
                </Button>
              </Link>
              <Button
                onClick={() => setShowFullScreen(!showFullScreen)}
                className="w-full md:w-auto"
              >
                {showFullScreen ? "Exit Full Screen" : "Full Screen"}
              </Button>
              <Button
                onClick={() => setFilter(!filter)}
                className="w-full md:w-auto"
              >
                Filters
              </Button>
            </div>
            <div className="flex flex-row md:flex-col md:items-center w-full mt-2 md:mt-0">
              <Input
                type="text"
                className="border rounded-md py-2 px-3 w-full"
                placeholder="Search"
                onChange={handleSearchChange}
                value={search}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    getEmpList();
                  }
                }}
                suffix={
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
                }
              />
            </div>
          </div>
        </div>
        <br />
        {filter && (
          <FilterEmployee handleEmloyeeFilters={handleEmloyeeFilters} />
        )}
        <br />
        <Table
  rowSelection={{
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  }}
  columns={columns}
  dataSource={emp}
  pagination={{
    current: currentPage,
    pageSize: postPerPage,
    total: empCount,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    onChange: (page, pageSize) => {
      setCurrentPage(page);
      setPostPerPage(pageSize);
    },
  }}
  loading={loading}
  onChange={handleTableChange}
  rowKey={(record) => record._id}
  bordered
  size="small" // Added to make the table more compact
/>

      </div>
    </div>
  );
};

export default Users_setting;
