import { getBirthday } from "@/helpers/Services/Dashboard_services";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Spinner,
  } from "@nextui-org/react";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import DateRangeComp from "@/components/DateRangeComp";
import DropDown from "@/components/DropDown";


function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}/${month}/${date}`;
}
const Birthday = () => {
  const [birthdayData, setBirthdayData] = useState(null);
  const keyToDisplay = {
    prevWeek: "Previous Week",
    thisWeek: "This Week",
    nextWeek: "Next Week",
    prevMonth: "Previous Month",
    thisMonth: "This Month",
    nextMonth: "Next Month"
  };
  const [selectedKeys, setSelectedKeys] = useState(new Set(["thisMonth"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const [filters, setfilters] = useState({
    filter: "thisMonth",
    cdate: getDate(),
  });
  const changeFilter=(key)=>{
    setfilters({
        filter: key,
    cdate: getDate(),
    });
  }
  const getBirthdaydata = async (filter) => {
    setBirthdayData(null)
    try {
      const res = await getBirthday(filter);
      if(res.status==200)
      {
        setBirthdayData(res?.data?.birthdayData);
        console.log(res?.data?.birthdayData);
      }
      else
      {
        toast.error(res?.response?.message);
      }
    } catch (error) {
      toast.error("internal error");
    }
  };
  useEffect(() => {
    getBirthdaydata(filters);
  }, [filters]);
  return (
    <>
      <div className="card w-100 h-screen">
        <div className="card-body overflow-x-hidden overflow-y-hidden">
        <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
          <div className="mb-3 mb-sm-0">
            <h6 className="card-title fw-semibold">BirthDays</h6>
          </div>
          <div className="flex gap-1">
            <div>
              
              <DropDown keyToDisplay={keyToDisplay}
              defaultSelectedKey="thisMonth" // Optionally provide default selected key
              onChangeFilter={changeFilter}/>
            </div>
           
          </div>
        </div>
        
          {birthdayData ? (
            <div>
                
              <table className="table text-sm sm:text-base text-nowrap mb-0 align-middle">
                <thead className="text-dark fs-4 bg-gray-100 rounded">
                  <tr>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Id</h6>
                    </th>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Name</h6>
                    </th>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Birth Date</h6>
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {birthdayData?.map((item, index) => (
                    <tr key={index}>
                      <td className="border-bottom-0 px-2 py-3">
                        <h6 className="fw-semibold mb-0">{index + 1}</h6>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        <Link href={`/dashboard/employee/viewemployee/${item._id}`}><span className="fw-semibold text-sm">
                          {item?.loginDetails?.firstName}{" "}
                          {item?.loginDetails?.lastName}
                        </span>
                        </Link>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                      <span className="fw-semibold text-sm">{item?.personalDetails?.dateOfBirth}</span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex w-full justify-center"></div>
            </div>
          ) : (
            <Spinner label="Loading" color="primary" labelColor="primary" />
          )}
        </div>
      </div>
    </>
  );
};
export default Birthday;