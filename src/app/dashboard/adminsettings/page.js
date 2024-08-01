"use client"
import React, { useState } from "react";
import Basic_setting from "./compoment/Basic_setting";
import Users_setting from "./compoment/Users_setting";
import Department_setting from "./compoment/Department_setting";
import Designation_setting from "./compoment/Designation_setting";
import withRole from "@/components/withRole";
import { Menu } from 'antd';
const items = [
  {
    label: 'Website Information',
    key: 'web',
    
  },
  {
    label: 'Users',
    key: 'users',
   
  },
  {
    label: 'Deparment',
    key: 'department',
    
  },
  {
    label: 'Designation',
    key: 'designation',
    
  },
  {
    label: 'Roles & Permissions',
    key: 'role',
    
  },
  // {
  //   label: 'Navigation Three - Submenu',
  //   key: 'SubMenu',
  //   icon: <SettingOutlined />,
  //   children: [
  //     {
  //       type: 'group',
  //       label: 'Item 1',
  //       children: [
  //         {
  //           label: 'Option 1',
  //           key: 'setting:1',
  //         },
  //         {
  //           label: 'Option 2',
  //           key: 'setting:2',
  //         },
  //       ],
  //     },
  //     {
  //       type: 'group',
  //       label: 'Item 2',
  //       children: [
  //         {
  //           label: 'Option 3',
  //           key: 'setting:3',
  //         },
  //         {
  //           label: 'Option 4',
  //           key: 'setting:4',
  //         },
  //       ],
  //     },
  //   ],
  // },
  
  
];
function page() {
  
  const [current, setCurrent] = useState('web');
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const aciveDivCss = "bg-blue-500 text-white rounded";
  return (
    <>
      <div className="w-full overflow-auto"><Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /></div>
      <br/>
      <div className="lg:flex w-full  ">
        <div class="card w-full">
          <div class="card-body">
            {current=="web"&&<Basic_setting/>}
            {current=="users"&&<Users_setting/>}
            {current=="department"&&<Department_setting/>}
            {current=="designation"&&<Designation_setting/>}
          </div>
        </div>
      </div>
    </>
  );
}

export default withRole(page, ['Admin']);
