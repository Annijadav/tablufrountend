import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from "@nextui-org/react";

import { ChevronDown } from "lucide-react";
import { getLeaves } from "@/helpers/Services/Dashboard_services";
import { toast } from "react-toastify";
import DateRangeComp from "@/components/DateRangeComp";
import DropDown from "@/components/DropDown";
function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}/${month}/${date}`;
}
const Leaves =() => {
  const keyToDisplay = {
    prevWeek: "Previous Week",
    thisWeek: "This Week",
    nextWeek: "Next Week",
    prevMonth: "Previous Month",
    thisMonth: "This Month",
    nextMonth: "Next Month",
    Custom:"Custom"
  };
  const StatuskeyToDisplay = {
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
    All: "All",
    
};
  
  //   //------------------pagination-----------------------------
  //   const [page, setPage] = React.useState(1);
  //   const rowsPerPage = 4;

  //   const pages = Math.ceil(leavesData.length / rowsPerPage);

  //   const items = React.useMemo(() => {
  //     const start = (page - 1) * rowsPerPage;
  //     const end = start + rowsPerPage;

  //     return leavesData.slice(start, end);
  //   }, [page, leavesData]);
  // //------------------end pagination-----------------------------
  const [leavesData, setLeavesData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [dateFilter, setDateFilter] = useState("thisWeek");
  const [dateRange,setDateRange] = useState({
    start:"",
    end:"",
  });
  const getLeaveData = async (statusFilter, dateFilter , daterange) => {
    try {
      setLeavesData(null);
      const res = await getLeaves({ status: statusFilter, date: dateFilter,daterange:daterange,cdate:getDate() });
      if (res.status === 200) {
        setLeavesData(res.data.allLeaves);
        console.log(res.data);
      } else {
        toast.error(res.response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Frontend error:", error);
      toast.error("An error occurred");
    }
  };
  useEffect(() => {
    getLeaveData(statusFilter, dateFilter , {'start':dateRange.start,'end':dateRange.end});
  }, []);

  const changeStatusFilter = async (key) => {
    setStatusFilter(key);
    getLeaveData(key, dateFilter,{'start':dateRange.start,'end':dateRange.end});
    //toast.success(`Status filter applied: ${key}`);
  };

  const changeDateFilter = async (key) => {
    if(key!="Custom")
    {
      setDateFilter(key);
    getLeaveData(statusFilter, key , {'start':dateRange.start,'end':dateRange.end});
    }
    else{
      toast.success(`Date filter applied: ${key}`);
    }
    
  };
  const handleDateSelection = async(start,end)=>{
    setDateRange({
      [start]:start,
      [end]:end,
    })
    console.log(start,end);
    getLeaveData(statusFilter, dateFilter , {'start':start,'end':end});
  }
  return (
    <div className="card w-100 max-h-full overflow-auto">
      <div className="card-body ">
        <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
          <div className="mb-3 mb-sm-0">
            <h5 className="card-title fw-semibold">Leaves Overview</h5>
          </div>
          <div className="flex gap-1">
          <div>
              <DateRangeComp handleDateSelection={handleDateSelection}/>
            </div>
            <div>
              
              <DropDown keyToDisplay={StatuskeyToDisplay}
              defaultSelectedKey="Pending" // Optionally provide default selected key
              onChangeFilter={changeStatusFilter}/>
            </div>
            <div
              >
              <DropDown keyToDisplay={keyToDisplay}
              defaultSelectedKey="thisWeek" // Optionally provide default selected key
              onChangeFilter={changeDateFilter}/>
            </div>
           
          </div>
        </div>
        <div className="overflow-x-auto">
          {leavesData ? (
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
                      <h6 className="fw-semibold mb-0">Reason</h6>
                    </th>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Dates</h6>
                    </th>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Type</h6>
                    </th>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Status</h6>
                    </th>
                    <th className="border-bottom-0 px-2 py-3">
                      <h6 className="fw-semibold mb-0">Days</h6>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leavesData?.map((item, index) => (
                    <tr key={index}>
                      <td className="border-bottom-0 px-2 py-3">
                        <h6 className="fw-semibold mb-0">{index + 1}</h6>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        <h6 className="fw-semibold mb-1">
                          {item.userID.loginDetails.firstName}{" "}
                          {item.userID.loginDetails.lastName}
                        </h6>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        <h6 className="fw-semibold mb-0">{item.leaveReason}</h6>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        
                        {item.selectedDates.map((date, i) => (
                          <div key={i} className="mb-1">
                            <span>
                              {new Date(date.startDate).toLocaleDateString()}
                            </span>{" "}
                            <span>-</span>{" "}
                            <span>
                              {new Date(date.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        <h6 className="fw-semibold mb-1">{item.leaveType}</h6>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        <div className="d-flex align-items-center gap-2">
                        <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              item.status === "Approved"
                                ? "bg-green-500"
                                : item.status === "Rejected"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            } text-white font-semibold`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="border-bottom-0 px-2 py-3">
                        <h6 className="fw-semibold mb-0 text-lg">
                          {item.numberOfDays}
                        </h6>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex w-full justify-center">
                {/* <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          /> */}
              </div>
            </div>
          ) : (
            <center><Spinner label="Loading" color="primary" labelColor="primary" /></center>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaves;
