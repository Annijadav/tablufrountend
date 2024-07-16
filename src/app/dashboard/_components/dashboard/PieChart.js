import React from "react";
import { Chart } from "react-google-charts";

const data = [
  ["Department", "Number of Employees"],
  ["Marketing", 10],
  ["Sales", 15],
  ["Engineering", 20],
  ["Finance", 8],
  ["HR", 5],
];

const options = {
  title: "Employee Department-wise Distribution",
};

const PieChart = () => {
  return (
    <div className="card w-100 ">
      <div className="card-body overflow-x-hidden overflow-y-hidden">
        <div className=" d-block align-items-center justify-content-between mb-9">
          <div className="mb-3 flex mb-sm-0">
            <h6 className="card-title fw-semibold">Department Headcount</h6>
          </div>
          {/* <Chart
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
          /> */}
          
        </div>
      </div>
    </div>
  );
};

export default PieChart;
