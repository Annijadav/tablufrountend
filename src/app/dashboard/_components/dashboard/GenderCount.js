import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

import DropDown from "@/components/DropDown";
import { getGendercount } from "@/helpers/Services/Dashboard_services";

const GenderCount = () => {
  const [genderData, setGenderData] = useState(null);
  const [filters, setFilters] = useState({
    filter: "Department",
  });

  const keyToDisplay = {
    Department: "Department",
    Designation: "Designation",
    Location: "Location",
    Entity: "Entity",
  };

  const changeFilter = (key) => {
    setFilters({
      filter: key,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await getGendercount();
      const data = res.data;
      setGenderData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-100">
      <div className="card-body overflow-x-hidden overflow-y-hidden">
        <div className=" d-block align-items-center justify-content-between mb-9">
          <div className="mb-3 flex mb-sm-0">
            <h6 className="card-title fw-semibold">Gender Ratio Department</h6>
            <div className="ml-auto">
              {/* <DropDown
                keyToDisplay={keyToDisplay}
                defaultSelectedKey="Department"
                onChangeFilter={changeFilter}
              /> */}
            </div>
          </div>
          <div id="chart">
            {genderData && (
              <ReactApexChart 
                options={{
                  chart: {
                    type: 'bar',
                    height: 430
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      dataLabels: {
                        position: 'top',
                      },
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                      fontSize: '12px',
                      colors: ['#fff']
                    }
                  },
                  stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff']
                  },
                  tooltip: {
                    shared: true,
                    intersect: false
                  },
                  xaxis: {
                    categories: genderData.map(item => item.departmentName || 'Unknown'),
                  },
                }}
                series={[
                  {
                    name: 'Male',
                    data: genderData.map(item => item.males),
                  }, 
                  {
                    name: 'Female',
                    data: genderData.map(item => item.females),
                  }
                ]}
                type="bar"
                height={430}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderCount;
