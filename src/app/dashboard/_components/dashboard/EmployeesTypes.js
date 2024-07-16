import React, { useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import { getEmployeesTypes } from "@/helpers/Services/Dashboard_services"; // Import your API function

const EmployeesTypes = () => {
  const [employeeTypes, setEmployeesTypes] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await getEmployeesTypes(); // Replace this with your actual API function
      const data = res.data;
      setEmployeesTypes(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-100">
      <div className="card-body overflow-x-hidden overflow-y-hidden">
        <div className="d-block align-items-center justify-content-between mb-9">
          <div className="mb-3 flex mb-sm-0">
            <h6 className="card-title fw-semibold">
              Employees Types
            </h6>
          </div>
          <div id="chart">
            {employeeTypes && (
              <ReactApexChart 
                options={{
                  chart: {
                    type: 'pie',
                  },
                  labels: employeeTypes.map(item => item._id || 'Unknown'),
                  responsive: [{
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }],
                }}
                series={employeeTypes.map(item => item.count)}
                type="pie"
                height={430}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesTypes;
