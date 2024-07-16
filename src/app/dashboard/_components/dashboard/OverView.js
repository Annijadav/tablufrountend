import { getStats } from "@/helpers/Services/Dashboard_services";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}/${month}/${date}`;
}

const Skeleton = () => {
  return <div className="skeleton h-4 w-28"></div>;
};

const OverView = () => {
  const [stats, setStats] = useState(null);

  const getStatsdata = async () => {
    try {
      const res = await getStats({ todayDate: getDate() });
      if (res.status === 200) {
        setStats(res.data);
      } else {
        toast.error(res.response.message);
      }
    } catch (error) {
      toast.error("Internal error..");
    }
  };

  useEffect(() => {
    getStatsdata();
  }, []);

  return (
    <div className="card w-100">
      <div className="card-body overflow-x-hidden overflow-y-hidden">
        <div>
          <div className="mb-3 mb-sm-0">
            <h5 className="card-title fw-semibold">Company Overview</h5>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-full">
            {/* Employees */}
            <div className=" flex items-center shadow-sm p-4 bg-white rounded transform transition duration-300 hover:scale-105">
              <div className="flex flex-shrink-0 items-center justify-center bg-greennn-200 h-16 w-16 rounded">
                <img src="/assets/images/teamwork.png" alt="image" />
              </div>
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-xl font-bold">Employees</span>
                <div className="flex items-center justify-between">
                  {stats && stats.activeempcount !== undefined && (
                    <>
                      <span className="text-gray-500">
                        {" "}
                        <span className="text-green-500 font-bold ml-1 mr-1">
                          {stats.activeempcount}
                        </span>
                        Active , Total
                        <span className="text-green-500 font-bold ml-1 mr-1">
                          {stats.totalemp}
                        </span>
                      </span>
                    </>
                  )}
                  {!(stats && stats.departmentcount !== undefined) && (
                    <Skeleton />
                  )}

                  <Link href="/dashboard/employee">
                    <span className="text-green-500 text-sm font-semibold ml-2">
                      view
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="flex items-center shadow-sm p-4 bg-white rounded transform transition duration-300 hover:scale-105">
              <div className="flex flex-shrink-0 items-center justify-center bg-redd-200 h-16 w-16 rounded">
                <img src="/assets/images/building.png" alt="image" />
              </div>
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-xl font-bold">Departments</span>
                <div className="flex items-center justify-between">
                  {stats && stats.departmentcount !== undefined && (
                    <>
                      <span className="text-gray-500">
                        Total
                        <span className="text-green-500 font-bold ml-1 mr-1">
                          {stats.departmentcount}
                        </span>
                        Departments
                      </span>
                    </>
                  )}
                  {!(stats && stats.departmentcount !== undefined) && (
                    <Skeleton />
                  )}
                  <Link href="/dashboard/department">
                    <span className="text-green-500 text-sm font-semibold ml-2">
                      view
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Today's Leave Count */}
            <div className="flex items-center shadow-sm p-4 bg-white rounded transform transition duration-300 hover:scale-105">
              <div className="flex flex-shrink-0 items-center justify-center bg-greeen-200 h-16 w-16 rounded">
                <img src="/assets/images/leave.png" alt="image" />
              </div>
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-xl font-bold">Leaves</span>
                <div className="flex items-center justify-between">
                  {stats &&
                  stats.todayLevaseCount[0]?.totalEmployeesOnLeave !==
                    undefined ? (
                    <span className="text-gray-500">
                      Today
                      <span className="text-green-500 font-bold ml-1 mr-1">
                        {stats.todayLevaseCount[0]?.totalEmployeesOnLeave}
                      </span>
                      Employee on Leave
                    </span>
                  ) : (
                    stats && <span className="">All Employee present</span>
                  )}
                  {!(stats && stats.departmentcount !== undefined) && (
                    <Skeleton />
                  )}
                  {
                    <Link href="/dashboard/leave">
                      <span className="text-green-500 text-sm font-semibold ml-2">
                        view
                      </span>
                    </Link>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;
