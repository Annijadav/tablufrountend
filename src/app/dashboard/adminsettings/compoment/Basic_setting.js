import { getAllActiveIndustry, getAllCompanies, getCompanyById, updateCompany } from "@/helpers/Services/Company_services";
import { ColorPicker, Image, Upload } from "antd";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
const Basic_setting = () => {
  const [file, setFile] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [countries, setcountries] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const getcountry = async () => {
    const respose = await axios.get(
      `https://api.countrystatecity.in/v1/countries`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ==",
        },
      }
    );
    setcountries(respose.data);
  };
  const [industries, setIndustries] = useState(null);
  const fetchAllActiveIndustry = async (isActive) => {
    try {
      const res = await getAllActiveIndustry(isActive);
      if (res.status === 200) {
        setIndustries(res.data);
        
      } else {
        toast.error(res.response.data.message+"from server");
      }
    } catch (error) {
      toast.error("Failed to fetch Industry");
      console.error(error);
    }
  };
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handlePreview = async (file) => {
    setPreviewOpen(true);
    setEditingItem({ ...editingItem, logoImage: file.url || file.preview });
  };
  const handleRemove = () => {
    setEditingItem({ ...editingItem, logoImage: "" });
    setFileList([]);
  };
  
  useEffect(() => {
    getcountry();
    fetchAllActiveIndustry(true);
    getCompanyInformation();
  }, []);


  const handleUpdateCompany = async (id) => {
    if (id) {
      if (!editingItem.name) {
        toast.error("Please enter company name");
        return;
      }
      if (!editingItem.email) {
        toast.error("Please company email Id");
        return;
      }
      if (!editingItem.emailName) {
        toast.error("Please enter company email name");
        return;
      }
      if (!editingItem.phone) {
        toast.error("Please enter company phone number");
        return;
      }
      if (!editingItem.industry) {
        toast.error("Please select industry");
        return;
      }
      if (!editingItem.address) {
        toast.error("Please enter company address");
        return;
      }
      if (!editingItem.country) {
        toast.error("Please select country");
        return;
      }
      if (!editingItem.timezone) {
        toast.error("Please select timezone");
        return;
      }
      if (editingItem.logoImage) {
        // toast.error(editingItem.logoImage);
      }
      try {
        
        setUpdateLoader(true);
        
        const data = {
          name: editingItem.name,
          email: editingItem.email,
          emailName: editingItem.emailName,
          phone: editingItem.phone,
          industry: editingItem.industry,
          address: editingItem.address,
          country: editingItem.country,
          timezone: editingItem.timezone,
          language: editingItem.language,
          currency: editingItem.currency,
          websiteLink: editingItem.websiteLink,
          ratings: editingItem.ratings,
          ownerName: editingItem.ownerName,
          aboutCompany: editingItem.aboutCompany,
          status: editingItem.status,
          productThemeColor: editingItem.productThemeColor,
          logoImage: editingItem.logoImage,
        };

        
        const res = await updateCompany(id, data);
        if (res.status === 201) {
          toast.success(`company updated successfully`);
          toggleOverlay();
        } else {
          toast.error("error from server 0"+res.response.data.message+"error from server");
        }
      } catch (error) {
        console.log(error+"error from server");
        toast.error("Something wrong..");
      } finally {
        setUpdateLoader(false);
      }
    } else {
      toast.error("User ID not found");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const getCompanyInformation = async ()=>{
    try
    {
      const token = localStorage.getItem("authToken" || "");
      const decoded = jwtDecode(token);
      console.log(decoded);
      const res = await getCompanyById({"companyId":decoded.companyId});
      setEditingItem(res.data)
    }catch(error)
    {
      toast.warning("server error..")
    }
  }
  
  if(!editingItem) return(<span>loading</span>)
  return (
    <>
      <div>
        <h5>Website Settings</h5>
        <hr />
        {/* <div className="flex flex-col md:flex-row gap-4">
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
        </div> */}
        <div className="">
          <div
            className=""
            
          >
            
            <div className="container mx-auto">
              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter company name"
                      value={editingItem.name}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={editingItem.phone}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter company email Id"
                      value={editingItem.email}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Name<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emailName"
                      placeholder="Enter company email name"
                      value={editingItem.emailName}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                </div>
              </div>

              <div className="flex px-4 mt-3">
                <span className="mr-8 w-1/4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Theme Colour
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <ColorPicker
                    className="mr-9 mt-2"
                    value={editingItem.productThemeColor}
                    allowClear
                    trigger="hover"
                    onChange={(c) => {
                      setEditingItem({
                        ...editingItem,
                        productThemeColor: c.toHexString(),
                      });
                      
                    }}
                  />
                </span>
                <span className="w-1/4">
                  <label className="block text-sm font-medium text-gray-700">
                    Logo Image<span className="ml-1 text-red-500">*</span>
                  </label>
                  <Upload
                    className="mt-2"
                    action="http://localhost:3000/"
                    listType="picture-circle"
                    fileList={fileList}
                    accept=".png, .jpg, .jpeg"
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    h
                    iconRender={() => <Spin />}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  {editingItem.logoImage && (
                    <Image
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible &&
                          setEditingItem({ ...editingItem, logoImage: "" }),
                      }}
                      src={editingItem.logoImage}
                      alt="Logo Image"
                      style={{ display: "none" }}
                    />
                  )}
                </span>
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingItem.status}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </span>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Industry<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={editingItem?.industry}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                    >
                      <option value="">Select Industry</option>
                      {industries &&
                        industries.map((industry) => (
                          <option key={industry._id} value={industry._id}>
                            {industry.name}
                          </option>
                        ))}
                    </select>
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address<span className="ml-1 text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter company address"
                      value={editingItem.address}
                      onChange={handleInputChange}
                      className="textarea focus:bg-gray-100 placeholder:text-gray-200 text-black textarea-bordered w-full mb-3 mt-1"
                    ></textarea>
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={editingItem.country}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                    >
                      <option value="">Please Select Country</option>
                      {countries &&
                        countries.map((country) => (
                          <option key={country._id} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                    </select>
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Time Zone<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      name="timezone"
                      value={editingItem.timezone}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                    >
                      <option value="">Please Select Timezone</option>
                      <option value="IN India Asia/Kolkata UTC +05:30">
                        IN India Asia/Kolkata UTC +05:30
                      </option>
                    </select>
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Language<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      name="language"
                      value={editingItem.language}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                    >
                      <option value="">Please Select Language</option>
                      <option value="English">English</option>
                    </select>
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Currency<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      name="currency"
                      value={editingItem.currency}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                    >
                      <option value="">Please Select Currency</option>
                      <option value="Rupee">Rupee</option>
                      <option value="USD">USD</option>
                    </select>
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Website Link<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="websiteLink"
                      placeholder="Enter company website link"
                      value={editingItem.websiteLink}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ratings<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="ratings"
                      max={5}
                      min={0}
                      maxLength={1}
                      placeholder="Enter company ratings"
                      value={editingItem.ratings}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                </div>
              </div>

              <div className="px-4">
                <div className="flex mt-3">
                  <span className="mb-2 mr-8 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      Owner Name<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      placeholder="Enter company owner name"
                      value={editingItem.ownerName}
                      onChange={handleInputChange}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                    />
                  </span>
                  <span className="mb-2 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">
                      About Company<span className="ml-1 text-red-500">*</span>
                    </label>
                    <textarea
                      name="aboutCompany"
                      placeholder="Enter about company"
                      value={editingItem.aboutCompany}
                      onChange={handleInputChange}
                      className="textarea focus:bg-gray-100 placeholder:text-gray-200 text-black textarea-bordered w-full mb-3 mt-1"
                    ></textarea>
                  </span>
                </div>
              </div>

              <div className="justify-items-center px-4 mt-4">
                <div className="w-full">
                  <button
                    type="button"
                    className="text-white rounded bg-green-400 hover:bg-green-600 px-4 py-2.5"
                    onClick={() => {
                      setOverlayVisible(true);
                    }}
                  >
                    {updateLoader ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Update"
                    )}
                  </button>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {overlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {updateLoader ? (
            <div className="bg-white p-10 rounded shadow-lg">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="bg-white p-10 rounded shadow-lg">
              <p className="text-center mb-4">
                Are you sure you want to update the '{editingItem.name}'
                Company?
              </p>
              <div className="flex mt-2  justify-end	">
                <button
                  onClick={toggleOverlay}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateCompany(editingItem._id)}
                  className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Basic_setting;
