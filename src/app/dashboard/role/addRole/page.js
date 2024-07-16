"use client";
import React, { useState, useEffect } from "react";
import { getAddRole } from "@/helpers/Services/Role_services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { validateForm } from "../validations/roleValidation";

function Page() {
  const router = useRouter();
  const [name, setName] = useState("");

  const redirectToDep = () => {
    setTimeout(() => {
      router.push("/dashboard/role");
    }, 1000);
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleRole = async () => {
    if (!name) {
      toast.error("Please Enter Role Name");
      return;
    }
    try {
      const error = validateForm({ name: name });
      if (error) {
        return toast.error(error);
      } else {
        const res = await getAddRole({ name: name });
        console.log(res);
        if (res.status === 201) {
          toast.success(`${name} role added successfully`);
          redirectToDep();
        } else {
          toast.error(`${name} role already exists`);
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
          <h5 className="card-title fw-semibold mb-4">Add Role</h5>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-items-center">
              <div className="w-full">
                {/* {JSON.stringify(name)} */}
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Name
                </p>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Role Name"
                  value={name}
                  onChange={handleInputChange}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full"></div>
              <div className="w-full">
                <button
                  type="button"
                  className="text-white rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleRole}
                >
                  Save
                </button>
                <button
                  onClick={() => router.push("/dashboard/role")}
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
