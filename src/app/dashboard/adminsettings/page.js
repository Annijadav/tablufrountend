"use client"
import React, { useState } from "react";
import Basic_setting from "./compoment/Basic_setting";
import Users_setting from "./compoment/Users_setting";
import Department_setting from "./compoment/Department_setting";
import Designation_setting from "./compoment/Designation_setting";

function page() {
  const [detail, setdetail] = useState(1);
  const aciveDivCss = "bg-blue-500 text-white rounded";
  return (
    <>
      <h5 class="card-title fw-semibold mb-4">Admin Dashboard Settings</h5>
      <div className="lg:flex w-full  ">
        <div><ul className="menu  mx-2 mb-2 menu-vertical px-2 shadow-md gap-1 align-center lg:menu-vertical bg-base-200 rounded-xl border bg-white">
          <h6 className="m-1 text-center w-auto whitespace-nowrap">
            Settings Menu
          </h6>

          <li className={detail==1&&aciveDivCss}>
              <button className={detail==1&&"text-white"} onClick={() => setdetail(1)}>Basic</button>
            </li>
            <li className={detail==2&&aciveDivCss}>
            <button className={detail==2&&"text-white"} onClick={() => setdetail(2)}>Users</button>
          </li>
          <li className={detail==3&&aciveDivCss}>
            <button className={detail==3&&"text-white"} onClick={() => setdetail(3)}>Department</button>
          </li>
          <li className={detail==4&&aciveDivCss}>
            <button className={detail==4&&"text-white"} onClick={() => setdetail(4)}>Designation</button>
          </li>
        </ul></div>
        <div class="card w-full">
          <div class="card-body">
            {detail==1&&<Basic_setting/>}
            {detail==2&&<Users_setting/>}
            {detail==3&&<Department_setting/>}
            {detail==4&&<Designation_setting/>}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
