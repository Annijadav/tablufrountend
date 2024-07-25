"use client";
import React, { useState, useEffect } from "react";
import { getAddDepartment } from "@/helpers/Services/Department_services";
import { getFullname } from "@/helpers/Services/user_services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { validateForm } from "../../department/validations/departmentValidation";

function Page() {
  const router = useRouter();
  const [department, setDepartment] = useState({
    name: "",
    departmentManager: "",
  });
  const [decode, setDecode] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers();
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setDecode(decoded);
    } else {
      console.log("Token not found");
    }
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

  const redirectToDep = () => {
    setTimeout(() => {
      router.push("/dashboard/department");
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDepartment = async () => {
    if (!department.name) {
      toast.error("Please Enter Department Name");
      return;
    } else if (!department.departmentManager) {
      toast.error("Please Select Department Manager");
      return;
    }

    try {
      const data = {
        name: department.name,
        departmentManager: department.departmentManager,
        company : decode.companyId
      };
      const error = validateForm(data);
      if (error) {
        return toast.error(error);
      } else {
        const res = await getAddDepartment(data);
        console.log(res);
        if (res.status === 201) {
          toast.success(`${department.name} department added successfully`);
          redirectToDep();
        } else {
          toast.error(`${department.name} department already exists`);
        }
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
          <h5 className="card-title fw-semibold mb-4">Add Department</h5>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-items-center">
              <div className="w-full">
                {/* {JSON.stringify(department)} */}
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Name
                </p>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Department Name"
                  value={department.name}
                  onChange={handleInputChange}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Department Manager
                </p>
                <select
                  name="departmentManager"
                  onChange={handleInputChange}
                  value={department.departmentManager._id}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value="">Please Select</option>
                  {users.map((user) => (
                    <option value={user._id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="text-white rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleDepartment}
                >
                  Save
                </button>
                <button
                  onClick={() => router.push("/dashboard/department")}
                  className="ml-3 text-white rounded bg-gray-300 hover:bg-gray-500  px-5 py-2.5"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
