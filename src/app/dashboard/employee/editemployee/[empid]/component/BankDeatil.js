import { update_BankDetails } from "@/helpers/Services/Employee_services";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { bankValidation } from "../validations/bankValidation";

function BankDeatil({ data, refreshdata, userid }) {
  const [bankDetails, setBankDetails] = useState({
    paymentType: data?.paymentType,
    bankName: data?.bankName,
    accountNo: data?.accountNo,
    IFSCcode: data?.IFSCcode,
    accountHolderName: data?.accountHolderName,
  });

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevBankDetails) => ({
      ...prevBankDetails,
      [name]: value,
    }));
  };

  const bankDetails_submit = async () => {
    setloader(true);
    try {
      const {error} = bankValidation(bankDetails);
      if(error)
      {
        toast.error(error.details[0].message);
        setOverlayVisible(false);
        setloader(false);
        return;
      }
      const response = await update_BankDetails(userid, bankDetails);
      if (response.status === 201) {
        toast.success(response.data.message);
        setOverlayVisible(false);
        setloader(false);
        refreshdata();
      } else {
        toast.error(response.response.data.message);
       // console.log(response.response);
        setOverlayVisible(false);
        setloader(false);
      }
    } catch (error) {
      //console.log(error);
      toast.error("somthing wrong..");
      setOverlayVisible(false);
      setloader(false);
    }
  };
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [loader,setloader] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  return (
    <>
    {overlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
        {loader?<div className="bg-white p-10 rounded shadow-lg"><span className="loading loading-spinner loading-md"></span></div>:
          <div className="bg-white p-10 rounded shadow-lg">
            <p className="text-center mb-4">
              Are you sure you want to update the employee details?
            </p>
            <div className="flex mt-2  justify-end	">
              <button
                onClick={toggleOverlay}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={bankDetails_submit}
                className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
              >
                Update
              </button>
            </div>
          </div>
        }
        </div>
      )}
      <div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            <br />
            <h4>Bank Details</h4>
            <hr />

            <br />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
              {/* <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Payment Type
                </p>
                <select
                  name="paymentType"
                  onChange={handleBankDetailsChange}
                  value={bankDetails.paymentType}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value="">Please Select</option>
                  <option value="NEFT">NEFT</option>
                  <option value="IMPS">IMPS</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IFT">IFT</option>
                  <option value="CASH">CASH</option>
                  <option value="CHEQUE">CHEQUE</option>
                </select>
              </div> */}
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Bank Name
                </p>
                <input
                  type="text"
                  name="bankName"
                  placeholder="Bank Name"
                  onChange={handleBankDetailsChange}
                  value={bankDetails.bankName}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Account Number
                </p>
                <input
                  type="text"
                  name="accountNo"
                  placeholder="Account Number"
                  onChange={handleBankDetailsChange}
                  value={bankDetails.accountNo}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  IFSC Code
                </p>
                <input
                  type="text"
                  name="IFSCcode"
                  placeholder="IFSC Code"
                  onChange={handleBankDetailsChange}
                  value={bankDetails.IFSCcode}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Account Holder Name
                </p>
                <input
                  type="text"
                  name="accountHolderName"
                  placeholder="Account Holder Name"
                  onChange={handleBankDetailsChange}
                  value={bankDetails.accountHolderName}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col-reverse">
          <div>
            <button
              type="button"
              className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={()=>setOverlayVisible(true)}
            >
              Update
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BankDeatil;
