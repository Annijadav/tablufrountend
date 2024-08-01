"use client";
import { useEffect, useState } from "react";


import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  td,
  Chip,
  Tooltip,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import { getDepartments, updatestatus } from "@/helpers/Services/Department_services";
import { CirclePower, Settings } from "lucide-react";
import { toast } from "react-toastify";
const Department_setting = () => {
  const columns = [
    { key: "name", label: "Department Name" },
    { key: "manager", label: "Manager Name" },
    { key: "Employee Count", label: "Employee Count" },

    { key: "updatedAt", label: "Updated At" },
    { key: "Actions", label: "Actions" },
  ];
  const [department_data, setDepartment_data] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["2"]));

  const getDepartmentsList = async () => {
    try {
      const response = await getDepartments({"all":true});

      if (response.status === 200) {
        setDepartment_data(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDepartmentStatus = async (DepartmentId,Status)=>{
    try
    {
      const res = await updatestatus({"did":DepartmentId,"status":!Status});
      if(res.status == 200)
      {
        setDepartment_data(null);
        getDepartmentsList();
        toast.success(res.data.message)
      }
      else{
        toast.warning(res.response.data.message);
      }
    }catch(error)
    {
      toast.error("internal error");
    }
  }
  useEffect(() => {
    getDepartmentsList();
  }, []);
  return (
    <>
    <h5>Deparment Settings</h5>
    <hr />
      <div className="w-full overflow-auto">
        {department_data?<table
          
          className="table"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <thead columns={columns}>
            {columns.map((column) => (
              <td key={column.key}>{column.label}</td>
            ))}
          </thead>
          <tbody items={department_data}>
            {department_data?.map((row) => (
              <tr key={row._id}>
                <td>{row.name}</td>
                <td>{`${row.departmentManager}`}</td>
                <td>{row.employeeCount}</td>

                <td>
                  {new Date(row.updatedAt).toLocaleString()}
                </td>
                <td>
                  {" "}
                  <div className="relative flex items-center gap-2">
                    <Tooltip content={row?.status == true ? `${row?.name} is Active` : `${row?.name} is InActive`}>
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <CirclePower onClick={()=>handleDepartmentStatus(row._id,row.status)} color={row?.status == true ? `green` : `red`}/>
                        
                        
                      </span>
                    </Tooltip>
                    <Tooltip content="Edit user">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Settings />
                      </span>
                    </Tooltip>
                    {/* <Tooltip color="danger" content="Delete user">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        
                      </span>
                    </Tooltip> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>:<div className="flex items-center justify-center p-10"><Spinner label="Loading" color="secondary" labelColor="secondary"/></div>}
      </div>
    </>
  );
};
export default Department_setting;
