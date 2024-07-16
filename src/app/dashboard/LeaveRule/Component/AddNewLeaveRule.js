import { getAddLeaveRule } from "@/helpers/Services/Leave_services";
import { useState } from "react";
import { toast } from "react-toastify";

const AddNewLeaveRule=({setIsPopoverOpen,getRuleLeaveList})=>{
    const [leaveRuleName, setName] = useState("");
    const handleInputChange = (e) => {
        setName(e.target.value);
      };
      const handLeaveRule = async () => {
        if (!leaveRuleName) {
          toast.error("Please enter leave rule name");
          return;
        }
        try {
          //   const data = {
          //     name: name,
          //     department: department,
          //   };
          const res = await getAddLeaveRule({ leaveRuleName: leaveRuleName });
          console.log(res);
          if (res.status === 201) {
            toast.success(`${leaveRuleName} leave rule added successfully`);
            // handleAddLeaveRuleClose(false);
            setIsPopoverOpen(false);
            getRuleLeaveList();
            
          } else {
            toast.error(res.response.data.message);
          }
        } catch (error) {
          toast.error(error);
          console.error(error);
        }
      };
return(
    <>
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10  rounded max-w relative overflow-y-auto max-h-screen w-1/3"
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button className="-mt-4 -mr-4">
                <svg
                  className="swap-on mt--10 fill-current hover:text-blue-300 "
                  onClick={()=>{setIsPopoverOpen(false)}}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-md font-semibold mb-4">Create Leave Rule</h4>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Leave Rule Name
              </label>
              <input
                type="text"
                name="leaveRuleName"
                placeholder="Enter leave rule name"
                onChange={handleInputChange}
                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-2 mt-1"
              />
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                onClick={handLeaveRule}
                className="px-4 py-2 bg-blue-500 text-white rounded input-bordered text-md focus:outline-none "
              >
                Submit
              </button>
            </div>
            {/* End of leave balance popover */}
          </div>
        </div>
    </>
)
}
export default AddNewLeaveRule;