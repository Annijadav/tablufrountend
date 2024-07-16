"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getAllActiveIndustry,
  postAddCompany,
} from "@/helpers/Services/Company_services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Select, ColorPicker } from "antd";

function Page() {
  const router = useRouter();
  const [company, setCompany] = useState({
    name: "",
    email: "",
    emailName: "",
    phone: "",
    industry: "",
    address: "",
    country: "",
    timezone: "",
    productThemeColor: "",
    language: "",
    currency: "",
    websiteLink: "",
    ratings: 0,
    ownerName: "",
    aboutCompany: "",
  });
  const [decode, setDecode] = useState("");
  const { Option } = Select;

  useEffect(() => {
    // Fetch users when component mounts
    getcountry();
    fetchAllActiveIndustry(true);
    const token = localStorage.getItem("authToken");
    console.log("token", token);
    if (token) {
      setDecode(jwtDecode(token));
      console.log("decoded", decode);
    } else {
      console.log("Token not found");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({
      ...company,
      [name]: value,
    });
  };

  // console.log("decoded", decode);
  const handleCompany = async () => {
    if (!company.name) {
      toast.error("Please enter company name");
      return;
    }
    if (!company.email) {
      toast.error("Please company email Id");
      return;
    }
    if (!company.emailName) {
      toast.error("Please enter company email name");
      return;
    }
    if (!company.phone) {
      toast.error("Please enter company phone number");
      return;
    }
    if (!company.industry) {
      toast.error("Please select industry");
      return;
    }
    if (!company.address) {
      toast.error("Please enter company address");
      return;
    }
    if (!company.country) {
      toast.error("Please select country");
      return;
    }
    if (!company.timezone) {
      toast.error("Please select timezone");
      return;
    }
    if (!company.productThemeColor) {
      toast.error("Please select theme colour");
      return;
    }
    try {
      const data = {
        name: company.name,
        email: company.email,
        emailName: company.emailName,
        phone: company.phone,
        industry: company.industry,
        address: company.address,
        country: company.country,
        timezone: company.timezone,
        language: company.language,
        currency: company.currency,
        productThemeColor: company.productThemeColor,
        websiteLink: company.websiteLink,
        ratings: company.ratings,
        ownerName: company.ownerName,
        aboutCompany: company.aboutCompany,
      };
      const res = await postAddCompany(data);
      console.log(res);
      if (res.status === 201) {
        toast.success(`${company.name} company added successfully`);
        router.push("/timestablu-dashboard/company");
      } else {
        toast.error(res.response.data.message);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );
  const selectAfter = (
    <Select defaultValue=".com">
      <Option value=".com">.com</Option>
      <Option value=".org">.org</Option>
    </Select>
  );

  const [industries, setIndustries] = useState(null);
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
      toast.error("Failed to fetch users");
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

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h5 className="card-title fw-semibold">Add Company</h5>
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2">
                Theme colour
              </label>
              <ColorPicker
                className="mr-9"
                value={company.productThemeColor}
                allowClear
                trigger="hover"
                onChange={(c) => {
                  setCompany({
                    ...company,
                    productThemeColor: c.toHexString(),
                  }),
                    console.log("c.toHexString()", c.toHexString());
                }}
              />
            </div>
          </div>

          {/* {JSON.stringify(company)} */}
          <div className="container mx-auto">
            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Comapany Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter company Name"
                    value={company.name}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
                <span className="mb-2 ml-8 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter company phone number"
                    value={company.phone}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
              </div>
            </div>

            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter company email Id"
                    value={company.email}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
                <span className="mb-2 ml-8 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Name
                  </label>
                  <input
                    type="text"
                    name="emailName"
                    placeholder="Enter email name"
                    value={company.emailName}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
              </div>
            </div>

            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={company.industry}
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
                <span className="mb-2 ml-8 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="Enter company address"
                    // value={editingItem.description}
                    onChange={handleInputChange}
                    className="textarea focus:bg-gray-100 placeholder:text-gray-200 text-black textarea-bordered w-full mb-3 mt-1"
                  ></textarea>
                </span>
              </div>
            </div>

            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={company.country}
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
                <span className="mb-2 ml-8 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Zone
                  </label>
                  <select
                    name="timezone"
                    value={company.timezone}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                  >
                    <option value="">Please Select Timezone</option>
                    <option value="IN	India	Asia/Kolkata	UTC +05:30">
                      IN India Asia/Kolkata UTC +05:30
                    </option>
                  </select>
                </span>
              </div>
            </div>

            <div className="px-4">
              <div className="flex mt-3">
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    name="language"
                    value={company.language}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                  >
                    <option value="">Please Select language</option>
                    <option value="English">English</option>
                  </select>
                </span>
                <span className="mb-2 ml-8 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={company.currency}
                    onChange={handleInputChange}
                    placeholder="Please Select currency"
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mt-1"
                  >
                    <option value="">Please Select currency</option>
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
                  </label>
                  {/* <Space direction="vertical" className="w-full mb-3 mt-1">
                    <Input
                      className="focus:bg-gray-100 placeholder:text-gray-200 text-black border rounded w-full"
                      addonBefore={selectBefore}
                      addonAfter={selectAfter}
                      onChange={(e) => {console.log("jjjj",e.target)}}
                      // defaultValue="mysite"
                    />
                  </Space> */}
                  <input
                    type="url"
                    name="websiteLink"
                    placeholder="Enter company website link"
                    value={company.websiteLink}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ratings
                  </label>
                  <input
                    type="number"
                    name="ratings"
                    max={5}
                    min={0}
                    maxLength={1}
                    placeholder="Enter company ratings"
                    value={company.ratings}
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
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Enter company owner name"
                    value={company.ownerName}
                    onChange={handleInputChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full mb-3 mt-1"
                  />
                </span>
                <span className="mb-2 w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    About Company
                  </label>
                  <textarea
                    name="aboutCompany"
                    placeholder="Enter about company"
                    value={company.aboutCompany}
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
                  className="text-white rounded bg-blue-600 hover:bg-blue-800  px-5 py-2.5"
                  onClick={handleCompany}
                >
                  Save
                </button>
                <button
                  onClick={() => router.push("/timestablu-dashboard/company")}
                  className="ml-3 text-white rounded bg-gray-300 hover:bg-gray-500  px-5 py-2.5"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
