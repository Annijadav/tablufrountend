"use client";
import { getDesignationTree, updateDesignationStatus } from "@/helpers/Services/Designation_services";
import { Spinner, Tooltip } from "@nextui-org/react";
import { CirclePower, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Designation_setting = () => {
  const [designations, setDesignations] = useState(null);
  const getDesignation = async () => {
    try {
      const res = await getDesignationTree();
      if (res.status == 200) {
        setDesignations(res.data);
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error("internal error");
    }
  };
  useEffect(() => {
    getDesignation();
  }, []);
const handleStatusUpdate=async(did,status)=>{
    try{
        setDesignations(null);
        const res = await updateDesignationStatus({"did":did,"status":!status})
        if(res.status==200)
        {
            toast.success(res.data.message);
        }else{
            toast.warning(res.response.data.message);
        }
        getDesignation();
    }catch(error)
    {
        toast.error("internal error")
        console.log(error);
    }
}
  return (
    <><h5>Designation Settings</h5>
        <hr />
      {designations ? (
        <div className="grid grid-cols-1 gap-2">
          {Object.keys(designations).map((departmentName, index) => (
            <div key={departmentName} className="w-full m-1 ">
              <h2 className="text-lg font-semibold m-2">
                {index + 1}. {departmentName}
              </h2>
              <span>Manager: </span>
              <span>{designations[departmentName].departmentManager}</span>


              <table className="table table-xs items-center text-center w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Designation </th>
                    <th>Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {designations[departmentName].designations.map((designation, idx) => (
                    
                    <tr key={designation._id}>
                      <th>{idx + 1}</th>
                      <td>{designation.name}</td>
                      <td>{designation.empCount}</td>
                      <td>
                        <div className="relative flex items-center  gap-3 justify-items-center	">
                          <center><Tooltip
                            content={
                              designation?.status == true
                                ? `${designation?.name} is Active`
                                : `${designation?.name} is InActive`
                            }
                          >
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <CirclePower
                                onClick={() => handleStatusUpdate(designation._id,designation.status)}
                                color={
                                  designation?.status == true ? `green` : `red`
                                }
                              />
                            </span>
                          </Tooltip>
                          {/* <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <Settings />
                            </span>
                          </Tooltip> */}
                          </center>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-10"><Spinner label="Loading" color="secondary" labelColor="secondary"/></div>
      )}
    </>
  );
};

export default Designation_setting;
