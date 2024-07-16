"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { toast } from "react-toastify";
import { getEmployeeById } from "@/helpers/Services/Employee_services";
import { getRoles } from "@/helpers/Services/Role_services";
import BasicDetail from "./component/BasicDetail";
import PersonalDetail from "./component/PersonalDetail";
import WorkDetail from "./component/WorkDetail";
import BankDeatil from "./component/BankDeatil";
import OtherDetail from "./component/OtherDetail";

function Page({ params }) {
  const [employee, setemployee] = useState(null);
  const [loader, setloader] = useState(true);
  const [component, setComponent] = useState(1);
  const [roles_data, setroles_data] = useState([]);
  
  const getemployee = async () => {
    try {
      
      const response = await getEmployeeById({ employeeId: params.empid });
      if (response.status === 200) {
        console.log(response.data);
        setemployee(response.data);
        setloader(false);
      } else {
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("somthing wrong...");
    }
  };
  const getRolelist = async () => {
    try {
      const res = await getRoles();
      if (res.status === 200) {
        setroles_data(res.data);

        //console.log(res.data);
      } else {
        toast.error("connection failed...");
      }
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };
  useEffect(() => {
    getemployee();
    getRolelist();
  }, []);

  if (loader) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    <span className="loading loading-ring loading-md"></span>
</div>;
  }
  return (
    <>
      <div className="text-sm breadcrumbs">
        <ul>
          <li className="font-semibold	">
            <Link className="text-black	" href={"/dashboard/"}>
              Home
            </Link>
          </li>
          <li>
            <Link className="text-black	" href={"/dashboard/employee"}>
              Employee
            </Link>
          </li>
          <li>
            <Link
              className="text-black	"
              href={`/dashboard/employee/viewemployee/${params.empid}`}
            >
              View Employee
            </Link>
          </li>
          <li>Update Employee</li>
        </ul>
      </div>
      <div className="w-full flex items-center	">
        <center><div role="tablist" className="tabs tabs-boxed items-stretch	">

          <button role="tab" onClick={()=>setComponent(1)} className={component===1 ? 'tab-active tab text-white' : 'tab'}>
            <span className="">Basic Details</span>
          </button>
          <button role="tab" onClick={()=>setComponent(2)} className={component===2 ? 'tab-active tab text-white' : 'tab'}>
          <span className="">Personal Details</span>
          </button>
          <button role="tab" onClick={()=>setComponent(3)} className={component===3 ? 'tab-active tab text-white' : 'tab'}>
            Work Details
          </button>
          <button role="tab" onClick={()=>setComponent(4)} className={component===4 ? 'tab-active tab text-white' : 'tab'}>
            Bank Details
          </button>
          <button role="tab" onClick={()=>setComponent(5)} className={component===5 ? 'tab-active tab text-white' : 'tab'}>
            Other Details
          </button>
        </div></center>
      </div>
      {
        component===1 && (
          <BasicDetail data={employee.loginDetails} uid={params.empid} roles_data ={roles_data}/>
        )
      }
      {
        component===2 && (
          <PersonalDetail data={employee.personalDetails} address={employee.addressDetails} userid={params.empid} />
        )
      }
      {
        component===3 && (
          <WorkDetail data={employee.workDetails} refreshdata={getemployee} workXp={employee.workExperinceDetails} userid={params.empid} />
        )
      }
      {
        component===4 && (
          <BankDeatil data={employee.bankDetails} refreshdata={getemployee} userid={params.empid} />
        )
      }
      {
        component===5 && (
          <OtherDetail data={employee.emergencyDetails} edudetail={employee.qualificationDetails} refreshdata={getemployee} userid={params.empid} />
        )
      }
      
      
    </>
  );
}

export default Page;
