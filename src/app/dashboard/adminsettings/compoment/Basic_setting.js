import { useState } from "react";

const Basic_setting = () => {
  const [file, setFile] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (!file) {
      return;
    }
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "jpg" || extension !== "jpeg" || extension !== "png") {
      toast.error("this file extension not alloweded.");
    } else {
      setFile(file);
    }
  };



  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "jpg" || extension !== "jpeg" || extension !== "png") {
      toast.error("this file extension not alloweded.");
    } else {
      setFile(file);
    }
  };

  const clearFile = async () => {
    setFile(null);
    setSpinner(false);
  };
  const handleUpload = async () => {
    
  };
  const [formValues, setFormValues] = useState({
    websiteName: "",
    description: "",
    logo: null,
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormValues({
      ...formValues,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    // Add form submission logic here
  };
  return (
    <>
      <div>
        <h5>Basic Settings</h5>
        <hr />
        <div className="flex flex-col md:flex-row gap-4">
          <label className="w-full md:w-1/2">
            <span className="text-gray-700">Website Name</span>
            <input
              type="text"
              name="websiteName"
              value={formValues.websiteName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter website name"
              required
            />
          </label>

          <label className="w-full  md:w-1/2">
            <span className="text-gray-700">Website Status</span>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formValues.status === "active"}
                onChange={handleChange}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formValues.status === "inactive"}
                onChange={handleChange}
                className="mr-2"
              />
              Inactive
            </label>
          </label>
        </div>
        <br />
        <div>
          <label className="block">
            <span className="text-gray-700">Description</span>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="3"
              placeholder="Enter website description"
            />
          </label>
        </div>
        <br />
        <div className=" items-center">
          <span className="text-gray-700">Website Logo</span>
          <div className="bg-white rounded-lg mt-1 rounded">
            <label
              htmlFor="uploadFile1"
              className="bg-white text-gray-500 font-semibold text-base rounded h-30 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
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
                  <span>Upload Image</span>
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
                    JPG,PNG and JPEG are Allowed.
                  </p>
                </>
              )}
            </label>
            <div className="w-full flex flex-row-reverse mt-2 gap-2">
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

        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
};
export default Basic_setting;
