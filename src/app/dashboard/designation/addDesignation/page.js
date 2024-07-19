"use client";
import React, { useState, useEffect } from "react";
import { getAddDesignation } from "@/helpers/Services/Designation_services";
import { getAllDepartment } from "@/helpers/Services/Department_services";
import { validateForm } from "../validations/designationValidation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [designantion, setDesignation] = useState({
    name: "",
    department: "",
  });

  const [departments, setDepartment] = useState([]);

  useEffect(() => {
    // Fetch users when component mounts
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

  const redirectToDep = () => {
    setTimeout(() => {
      router.push("/dashboard/designation");
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDesignation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDepartment = async () => {
    const { name, department } = designantion;
    if (!name) {
      toast.error("Please Enter Designation Name");
      return;
    } else if (!department) {
      toast.error("Please Select Department Name");
      return;
    }
    try {
      const data = {
        name: name,
        department: department,
      };
      const error = validateForm(data);
      if (error) {
        return toast.error(error);
      } else {
        const res = await getAddDesignation(data);
        console.log(res);
        if (res.status === 201) {
          toast.success(`${name} designation added successfully`);
          redirectToDep();
        } else {
          toast.error(`${name} designation already exists`);
        }
      }
      const res = await getAddDesignation(data);
      console.log(res);
      if (res.status === 201) {
        toast.success(`${name} designation added successfully`);
        redirectToDep();
      } else {
        toast.error(`${name} designation already exists`);
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
          <h5 className="card-title fw-semibold mb-4">Add Designation</h5>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-items-center">
              <div className="w-full">
                {/* {JSON.stringify(designantion)} */}
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Name
                </p>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Department Name"
                  value={designantion.name}
                  onChange={handleInputChange}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Department Name
                </p>
                <select
                  name="department"
                  onChange={handleInputChange}
                  value={designantion._id}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value="">Please Select</option>
                  {departments.map((department) => (
                    <option value={department._id}>{department.name}</option>
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
                  onClick={() => router.push("/dashboard/designation")}
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
