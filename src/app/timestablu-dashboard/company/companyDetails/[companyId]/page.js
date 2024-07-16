"use client";
import {
  getAllCompanies,
  deleteCompany,
  getAllActiveIndustry,
  updateCompany,
  getCompanyById,
} from "@/helpers/Services/Company_services";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Image, Select, ColorPicker, Upload, Spin, Breadcrumb } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function page({ params }) {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [industries, setIndustries] = useState(null);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisibleDelete, setOverlayVisibleDelete] = useState(false);
  const router = useRouter();

  const getcompany = async () => {
    try {
      console.log("here0",params.companyId );
      const response = await getCompanyById({ companyId: params.companyId });
      if (response.status === 200) {
        console.log(response.data);
        setCompanyDetails(response.data);
        // setloader(false);
      } else {
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("somthing wrong...");
    }
  };

  // const getCompanyList = async () => {
  //   try {
  //     const res = await getAllCompanies();
  //     console.log("Response:", res);
  //     if (res.status === 200) {
  //       setCompany_data(res.data);
  //     } else {
  //       console.log(res.response.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Internal error");
  //   }
  // };

  useEffect(() => {
    getcompany();
    console.log("param",params.companyId)
  }, []);

  const handleDelete = async (companyId) => {
    try {
      setDeleteLoader(true);
      const res = await deleteCompany(companyId);
      if (res.status === 200) {
        getCompanyList();
        console.log("resres", res);
        toast.success(res.data.message);
        setEditingItem(null);
        toggleOverlayDelete();
      } else {
        console.log("dd", res.response.data.message);
        toast.error("Failed to delete record");
      }
    } catch (error) {
      console.error("Internal error");
      toast.error("Internal error ");
    } finally {
      setDeleteLoader(false);
    }
  };

  const handleEdit = async (company) => {
    console.log("company", company);
    await fetchAllActiveIndustry(true);
    await getcountry();
    setEditingItem(company);
  };

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
        toast.error(editingItem.logoImage);
      }
      try {
        console.log("id", id);
        setUpdateLoader(true);
        // let decode = "";
        // const token = localStorage.getItem("authToken");
        // console.log("token", token);
        // if (token) {
        //   decode = jwtDecode(token);
        //   console.log("decoded", decode);
        // } else {
        //   console.log("Token not found");
        // }
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

        console.log("datadatadata", data);
        const res = await updateCompany(id, data);
        if (res.status === 201) {
          console.log("res", res);
          getCompanyList();
          toast.success(`company updated successfully`);
          setEditingItem(null);
          toggleOverlay();
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
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

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlayDelete = () => {
    setOverlayVisibleDelete(!overlayVisibleDelete);
  };

  const fetchAllActiveIndustry = async (isActive) => {
    try {
      const res = await getAllActiveIndustry(isActive);
      if (res.status === 200) {
        setIndustries(res.data);
        console.log("industry", res.data);
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch Industry");
      console.error(error);
    }
  };

  const [countries, setcountries] = useState(null);
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (editingItem?.logoImage) {
      setFileList([
        {
          uid: "-1",
          name: "logoImage.png",
          status: "done",
          url: editingItem.logoImage,
        },
      ]);
    }
  }, [editingItem?.logoImage ? editingItem.logoImage : ""]);

  const handlePreview = async (file) => {
    setPreviewOpen(true);
    setEditingItem({ ...editingItem, logoImage: file.url || file.preview });
  };

  const handleChange = async ({ fileList: newFileList }) => {
    console.log("in my heart", fileList);
    if (fileList.status == "removed") {
      setEditingItem({ ...editingItem, logoImage: "" });
    }
    setFileList(newFileList);

    const latestFile = newFileList[newFileList.length - 1];
    if (latestFile) {
      if (!latestFile.url && !latestFile.preview) {
        latestFile.preview = await getBase64(latestFile.originFileObj);
      }
      setEditingItem({ ...editingItem, logoImage: latestFile.preview });
    }
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
  const handleRemove = () => {
    setEditingItem({ ...editingItem, logoImage: "" });
    setFileList([]);
  };
  return (
    <div className="bg-gray-200">
      <div>
      {companyDetails && (
        <div className="min-h-screen rounded border p-4">
          <div className="flex flex-col w-full mb-4">
            <p className="text-2xl font-bold mb-2">Company Details</p>
            {JSON.stringify(companyDetails)}
            <Breadcrumb className="mb-3 text-1xl font-bold">
              <Breadcrumb.Item>
                <a href="/timestablu-dashboard/company  ">
                  <i class="ti ti-solid ti-arrow-left"></i>
                  Companies
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="text-blue-500 text-1xl font-bold">
                Details {companyDetails.name}
              </Breadcrumb.Item>
            </Breadcrumb>
            <hr />
          </div>
          {/* Header */}
          <header className="w-full p-4 bg-white rounded border py-4 px-4 p-4">
            <div className="contact-wrap">
              <div className="flex justify-between items-center">
                <div className="contact-profile flex items-center">
                  <div className="avatar company-avatar mr-4">
                  <Image
                            className="rounded-full"
                            src={companyDetails.logoImage}
                            alt="Company Logo"
                            style={{ width: 75, height: 75 }}
                            fallback="data:image/png;base64,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"
                          />
                  </div>
                  <div className="name-user">
                    <h4 className="text-xl font-semibold">{companyDetails.name}</h4>
                    <p className="text-gray-600">
                      <i className="las la-map-marker"></i> 22, Ave Street, New
                      York, USA
                    </p>
                    <div className="badge-rate flex items-center">
                      <p className="text-yellow-500">
                        <i className="fa-solid fa-star"></i> 5.0
                      </p>
                    </div>
                  </div>
                </div>
                <div className="contacts-action flex items-center space-x-2">
                  <a href="#" className="btn-icon text-yellow-500">
                    <i className="fa-solid fa-star"></i>
                  </a>
                  <a
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#add_deals"
                    className="btn btn-pink flex items-center space-x-1"
                  >
                    <i className="feather-plus-circle"></i>
                    <span>Add Deal</span>
                  </a>
                  <a
                    href="#"
                    className="btn btn-primary flex items-center space-x-1"
                    data-bs-toggle="modal"
                    data-bs-target="#add_compose"
                  >
                    <i className="feather-mail"></i>
                    <span>Send Email</span>
                  </a>
                  <a href="chat.html" className="btn-icon">
                    <i className="feather-message-circle"></i>
                  </a>
                  <a
                    href="#"
                    className="btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_company"
                  >
                    <i className="feather-edit"></i>
                  </a>
                  <div className="dropdown relative">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="feather-more-vertical"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right absolute hidden bg-white shadow-lg rounded">
                      <a
                        className="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        href="javascript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_contact"
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex w-full h-full  rounded border p-4 mt-4">
            {/* 20% width section */}
            <div className="w-1/5 bg-gray-200 p-4  rounded border mr-4">
              <div className="card border h-full flex justify-center items-center ml-4">
                <p>20% Width Section</p>
                
              </div>
            </div>

            {/* 80% width section */}
            <div className="w-4/5 bg-white p-4 rounded border p-4">
              <div className="card border h-full flex justify-center items-center rounded border">
                <p>80% Width Section</p>
                {/* Updated modal */}
                {editingItem && (
                  <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div
                      className="bg-white mt-3 p-10  rounded w-3/4 relative overflow-y-auto max-h-screen "
                      style={{ overflowY: "auto", scrollbarWidth: "none" }}
                    >
                      <div className="flex justify-between items-center">
                        <p></p>
                        <button
                          className="-mt-4 -mr-4"
                          onClick={() => {
                            setEditingItem(null), setFileList([]);
                          }}
                        >
                          <svg
                            className="swap-on mt--10 fill-current hover hover:bg-blue-300 rounded-full"
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 512 512"
                          >
                            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                          </svg>
                        </button>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">
                        Company Details
                      </h4>
                      {JSON.stringify(editingItem)}
                      <div className="container mx-auto">
                        <div className="px-4">
                          <div className="flex mt-3">
                            <span className="mb-2 mr-8 w-1/2">
                              <label className="block text-sm font-medium text-gray-700">
                                Company Name
                                <span className="ml-1 text-red-500">*</span>
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
                                Phone Number
                                <span className="ml-1 text-red-500">*</span>
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
                                Email Name
                                <span className="ml-1 text-red-500">*</span>
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
                                console.log("c.toHexString()", c.toHexString());
                              }}
                            />
                          </span>
                          <span className="w-1/4">
                            <label className="block text-sm font-medium text-gray-700">
                              Logo Image
                              <span className="ml-1 text-red-500">*</span>
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
                                  onVisibleChange: (visible) =>
                                    setPreviewOpen(visible),
                                  afterOpenChange: (visible) =>
                                    !visible &&
                                    setEditingItem({
                                      ...editingItem,
                                      logoImage: "",
                                    }),
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
                                Industry
                                <span className="ml-1 text-red-500">*</span>
                              </label>
                              <select
                                name="industry"
                                value={editingItem.industry._id}
                                onChange={handleInputChange}
                                className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                              >
                                <option value="">Select Industry</option>
                                {industries &&
                                  industries.map((industry) => (
                                    <option
                                      key={industry._id}
                                      value={industry._id}
                                    >
                                      {industry.name}
                                    </option>
                                  ))}
                              </select>
                            </span>
                            <span className="mb-2 w-1/2">
                              <label className="block text-sm font-medium text-gray-700">
                                Address
                                <span className="ml-1 text-red-500">*</span>
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
                                Country
                                <span className="ml-1 text-red-500">*</span>
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
                                    <option
                                      key={country._id}
                                      value={country.name}
                                    >
                                      {country.name}
                                    </option>
                                  ))}
                              </select>
                            </span>
                            <span className="mb-2 w-1/2">
                              <label className="block text-sm font-medium text-gray-700">
                                Time Zone
                                <span className="ml-1 text-red-500">*</span>
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
                                Language
                                <span className="ml-1 text-red-500">*</span>
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
                                Currency
                                <span className="ml-1 text-red-500">*</span>
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
                                Website Link
                                <span className="ml-1 text-red-500">*</span>
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
                                Ratings
                                <span className="ml-1 text-red-500">*</span>
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
                                Owner Name
                                <span className="ml-1 text-red-500">*</span>
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
                                About Company
                                <span className="ml-1 text-red-500">*</span>
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
                            <button
                              onClick={() => setOverlayVisibleDelete(true)}
                              className="ml-3 text-white rounded bg-red-400 hover:bg-red-600 px-4 py-2.5"
                            >
                              {deleteLoader ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>)}
      </div>

      {/* Updated modal */}
      {editingItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white mt-3 p-10  rounded w-3/4 relative overflow-y-auto max-h-screen "
            style={{ overflowY: "auto", scrollbarWidth: "none" }}
          >
            <div className="flex justify-between items-center">
              <p></p>
              <button
                className="-mt-4 -mr-4"
                onClick={() => {
                  setEditingItem(null), setFileList([]);
                }}
              >
                <svg
                  className="swap-on mt--10 fill-current hover hover:bg-blue-300 rounded-full"
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </button>
            </div>
            <h4 className="text-lg font-semibold mb-2">Company Details</h4>
            {/* {JSON.stringify(editingItem)} */}
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

              {/* <div className="flex px-4 mt-3">
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
                      console.log("c.toHexString()", c.toHexString());
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
                      value={editingItem.industry._id}
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
                  <button
                    onClick={() => setOverlayVisibleDelete(true)}
                    className="ml-3 text-white rounded bg-red-400 hover:bg-red-600 px-4 py-2.5"
                  >
                    {deleteLoader ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Updated Confirmation */}
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

      {/* delete Confirmation */}
      {overlayVisibleDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {deleteLoader ? (
            <div className="bg-white p-10 rounded shadow-lg">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="bg-white p-10 rounded shadow-lg">
              <p className="text-center mb-4">
                Are you sure you want to Delete '{editingItem.name}' Company?
              </p>
              <div className="flex mt-2  justify-end">
                <button
                  onClick={toggleOverlayDelete}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(editingItem._id)}
                  className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default page;
