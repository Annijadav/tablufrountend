// import DropDown from "@/components/DropDown";
// import { getHeadcountDepartment } from "@/helpers/Services/Dashboard_services";
// import { useEffect, useState } from "react";
// import Chart from "react-google-charts";

// const HeadcountDepartment = () => {
//   useEffect(() => {
//     getdata();
//   }, []);
//   const keyToDisplay = {
//     Department: "Department",
//     Designation: "Designation",
//     Location: "Location",
//     Entity: "Entity",
//   };
//   const [filters, setfilters] = useState({
//     filter: "Department",
//   });
//   const changeFilter = (key) => {
//     setfilters({
//       filter: key,
//     });
//   };
//   const [depdata, setdepdata] = useState(null);
//   const getdata = async () => {
//     try {
//       const res = await getHeadcountDepartment();

//       const data = res.data;

//       const formattedData = data.map(([departmentName, headcount]) => [
//         departmentName,
//         headcount,
//       ]);
//       setdepdata(formattedData);
//       console.log(formattedData);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <>
//       <div className="card w-100">
//         <div className="card-body overflow-x-hidden overflow-y-hidden">
//           <div className=" d-block align-items-center justify-content-between mb-9">
//             <div className="mb-3 flex mb-sm-0">
//               <h6 className="card-title fw-semibold">Department Headcount</h6>
//               <div className="ml-auto">
//                 <DropDown
//                   keyToDisplay={keyToDisplay}
//                   defaultSelectedKey="Department"
//                   onChangeFilter={changeFilter}
//                 />
//               </div>
//             </div>
//             <br />
//             <br />
//             <div className="flex">
//               {depdata && (
//                 <Chart
//                   chartType="Bar"
//                   width="100%"
//                   height="300px"
//                   data={[["Departments", "Headcount"], ...depdata]}
//                   options={{
//                     title: "Department-wise Headcount",
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default HeadcountDepartment;
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { getHeadcountDepartment } from "@/helpers/Services/Dashboard_services";
import DropDown from "@/components/DropDown";

const HeadcountDepartment = () => {
  useEffect(() => {
    getData();
  }, []);
  const keyToDisplay = {
        Department: "Department",
        Designation: "Designation",
        Location: "Location",
        Entity: "Entity",
      };
      const [filters, setfilters] = useState({
        filter: "Department",
      });
      const changeFilter = (key) => {
        setfilters({
          filter: key,
        });
      };
  const [chartData, setChartData] = useState({
    series: [{
      data: []
    }],
    options: {
      chart: {
        height: 350,
        width:'full',
        type: 'bar',
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      }
    }
  });

  const getData = async () => {
    try {
      const res = await getHeadcountDepartment();
      const data = res.data;

      const categories = data.map(([departmentName]) => departmentName);
      const seriesData = data.map(([, headcount]) => headcount);

      setChartData({
        series: [{
          data: seriesData
        }],
        options: {
          ...chartData.options,
          xaxis: {
            ...chartData.options.xaxis,
            categories: categories
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-100">
    <div className="card-body overflow-x-hidden overflow-y-hidden">
      <div className=" d-block align-items-center justify-content-between mb-9">
        <div className="mb-3 flex mb-sm-0">
          <h6 className="card-title fw-semibold">Department Headcount</h6>
          <div className="ml-auto">
            {/* <DropDown
              keyToDisplay={keyToDisplay}
              defaultSelectedKey="Department"
              onChangeFilter={changeFilter}
            /> */}
          </div>
        </div>
        <br />
        <br />
        <div id="chart">

        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
        </div>
          </div>
        </div>
      </div>
  );
};

export default HeadcountDepartment;
