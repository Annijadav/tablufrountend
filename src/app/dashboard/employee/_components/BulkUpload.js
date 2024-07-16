import { downloadTemplate, uploademployeebulk } from "@/helpers/Services/Employee_services";
import React, { useState } from "react";
import { toast } from "react-toastify";

const BulkUpload = ({ setShowBulk }) => {
  const [file, setFile] = useState(null);
  const [spinner,setSpinner] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    
    if (!file) {
        return;
    }
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'xlsx') {
        toast.error("Only Excel sheets (xlsx) are allowed.");
    } else {
        setFile(file);
    }
  };

  const handleTemplateDownload = async () => {
    try {
      const res = await downloadTemplate();
      console.log(res);
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download template');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'xlsx') {
        toast.error("Only Excel sheets (xlsx) are allowed.");
    } else {
        setFile(file);
    }
};


  const handleCancel = () => {
    setFile(null);
    setShowBulk(false);
    setSpinner(false);
  };

  const clearFile = async ()=>{
    setFile(null);
    setSpinner(false);
  }
  const handleUpload =async () => {
    setSpinner(true);
    if(!file)
      {
        toast.error("please select xlsx file")
        setSpinner(false);
        return;
      }
    try
    {
      const res = await uploademployeebulk({'file':file});
      console.log(res);
      setSpinner(false);
      setFile(null);
      setShowBulk(false);
    }catch(error)
    {
      toast.error("something wrong");
    }
      
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white w-11/12 md:w-2/4 lg:w-1/3 rounded-lg p-10 rounded">
          <h1 className="text-center text-2xl font-bold mb-4">Bulk Upload</h1>
          
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={() => setShowBulk(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center flex flex-row-reverse	w-full mb-8">
            <button onClick={handleTemplateDownload} className="bg-blue-500 flex  text-white items-center gap-2 px-4 py-2 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-cloud-download"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 17 4 4 4-4" />
              </svg>
              Download
            </button>
            
            <span>
              Download Template For Bulk Upload
            </span>
          </div>
          <label
            htmlFor="uploadFile1"
            className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-40 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-semibold mb-2">Selected File:</p>
                <p className="text-gray-600 mb-4">{file?.name}</p>
              </div>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-11 mb-2 fill-gray-500"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                    data-original="#000000"
                  />
                  <path
                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                    data-original="#000000"
                  />
                </svg>
                <span>Upload file</span>
                <input
                  type="file"
                  id="uploadFile1"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <p
                  className="text-xs font-medium text-gray-400 mt-2"
                  placeholder="upload here"
                >
                  XLSX files are Allowed.
                </p>
              </>
            )}
          </label>
          <div className="w-full flex flex-row-reverse mt-2 gap-2">
            <button
              className="bg-gray-400 flex text-white gap-2 items-center px-4 py-2 rounded hover:bg-gray-600"
              onClick={handleCancel}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span>Cancel</span>
            </button>

            <button
              className="bg-green-400 hover:bg-green-600 flex text-white items-center gap-2 px-4 py-2 rounded"
              onClick={handleUpload}
              disabled={spinner}
            >
              {!spinner ? (<svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-upload"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>):
              (<span className="loading loading-spinner loading-xs"></span>)}
              <span>Upload</span>
            </button>
            {file && (
              <button
                className="bg-red-400 hover:bg-red-600 flex text-white items-center gap-2 px-4 py-2 rounded"
                onClick={clearFile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-trash-2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
