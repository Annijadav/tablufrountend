import ImageView from "@/components/ImageView";
import {
  update_AddressDetails,
  update_personaldetails,
} from "@/helpers/Services/Employee_services";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validatePersonalDetails } from "../validations/PersonalDetailValidator";

function PersonalDetail({ data, userid, address }) {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openProfileImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowProfile(true);
  };

  const closeProfileImageView = () => {
    setShowProfile(false);
    setSelectedImage("");
  };

  useEffect(() => {
    getcountry(false);
    getcountry(true);
    
    if(address?.countryId){
    getStates(address.countryId);
    setstate(address.countryId);
    }
    if(address?.permanentCountryId){
    getpStates(address.permanentCountryId);
    setpstate(address.permanentCountryId)
    }
    if(address?.stateId && address?.countryId){
    getCity(address.stateId,address.countryId);
    }
    if(address?.permanentStateId && address?.permanentCountryId)
      {
    getpCity(address.permanentStateId,address.permanentCountryId);
    }
  }, []);
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const nationalities = ["India", "United States", "United Kingdom", "Canada"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const formatDate = (dateString) => {
    if (!dateString) return ""; // handle null or undefined date

    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  };

  // ---------------------------- set state coutry city ---------------------------------
  const [countries, setcountries] = useState(null);
  const [pcountries, setpcountries] = useState(null);
  const getcountry = async (permenent) => {
    const respose = await axios.get(
      `https://api.countrystatecity.in/v1/countries`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ==",
        },
      }
    );
    if (permenent) {
      setpcountries(respose.data);
    } else {
      setcountries(respose.data);
    }
  };
  const [states, setstates] = useState(null);
  const [state, setstate] = useState(null);

  const getStates = async (id) => {
    const respose = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${id}/states`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ==",
        },
      }
    );
    setstates(respose.data);
    setstate(id);
  };
  const [pstates, setpstates] = useState(null);
  const [pstate, setpstate] = useState(null);
  const [pstatesId, setpstatesId] = useState(null);
  const [pstateId, setpstateId] = useState(null);
  const getpStates = async (id) => {
    const respose = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${id}/states`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ==",
        },
      }
    );
    setpstates(respose.data);
    setpstate(id);
  };
  const [city, setcity] = useState(null);
  const [cityId, setcityId] = useState(null);
  const getCity = async (id,state) => {
    const respose = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${state}/states/${id}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ==",
        },
      }
    );
    setcity(respose.data);
  };
  const [pcity, setpcity] = useState(null);
  const [pcityId, setpcityId] = useState(null);
  const getpCity = async (id,pstate) => {
    const respose = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${pstate}/states/${id}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ==",
        },
      }
    );
    setpcity(respose.data);
  };

  // -------------------------------------------------------------------------------------------
  const [personalDetails, setPersonalDetails] = useState({
    cityType: data?.cityType,
    fatherName: data?.fatherName,
    motherName: data?.motherName,
    profileImage: data?.profileImage,
    gender: data?.gender,
    dateOfBirth: formatDate(data?.dateOfBirth),
    maritalStatus: data?.maritalStatus,
    dateOfMarriage: formatDate(data?.dateOfMarriage),
    nationality: data?.nationality,
    PFUAN: data?.PFUAN,
    joiningDate: formatDate(data?.joiningDate),
    bloodGroup: data?.bloodGroup,
    noticeDays: data?.noticeDays,
    passportNo: data?.passportNo,
    aadharCardNo: data?.aadharCardNo,
    panNo: data?.panNo,
    PFNo: data?.PFNo,
    dateOfGratuity: formatDate(data?.dateOfGratuity),
    ESINumber: data?.ESINumber,
    payRollType: data?.payRollType,
    contractEndDate: formatDate(data?.contractEndDate),
  });
  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    setPersonalDetails({
      ...personalDetails,
      ["profileImage"]: e.target.files?.[0],
    });
  };
  const personalDetails_submit = async () => {
    if (userid) {
      try {
        // console.log(personalDetails);
        const { error } = validatePersonalDetails(personalDetails);
        console.log(error);
        if (error) {
          
          const errorMessage = error.details[0].message;
          toast.error(errorMessage);
          return;
        }
        const res = await update_personaldetails(userid, personalDetails);
        console.log(res);
        if (res.status === 201) {
          const res1 = await update_AddressDetails(userid, addressDetails);

      if (res1.status === 201) {
        toast.success("Data Updated..");
      } else {
        toast.success("personal Data Updated..");
        toast.error(res1.data);
      }
          
        } else {
          toast.error(res.response.data.message);
          return;
        }

        

      } catch (error) {
        console.log(error);
        toast.error("something wrong..");
      }
    } else {
      toast.error("userid not found");
    }
  };
  const [addressDetails, setAddressDetails] = useState({
    currentAddress1: address?.currentAddress1,
    currentAddress2: address?.currentAddress2,
    country: address?.country,
    countryId: address?.countryId,
    state: address?.state,
    stateId: address?.stateId,
    city: address?.city,
    cityId: address?.cityId,
    zip: address?.zip,
    isSameAsCurrent: address?.isSameAsCurrent,
    permanentAddress1: address?.permanentAddress1,
    permanentAddress2: address?.permanentAddress2,
    permanentCountry: address?.permanentCountry,
    permanentCountryId: address?.permanentCountryId,
    permanentState: address?.permanentState,
    permanentStateId: address?.permanentStateId,
    permanentCity: address?.permanentCity,
    permanentCityId: address?.permanentCityId,
    permanentZip: address?.permanentZip,
  });
  const handleAddressChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === "checkbox" ? checked : value;

    if (name === "country") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ['countryId']:selectedId,
      })
      getStates(selectedId);
    }
    if (name === "permanentCountry") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ['permanentCountryId']:selectedId,
      })
      getpStates(selectedId);
    }
    if (name === "state") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ['stateId']:selectedId,
      })
      getCity(selectedId,state);
    }
    if (name === "permanentState") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ['permanentStateId']:selectedId,
      })
      getpCity(selectedId,pstate);
    }
    if (name === "isSameAsCurrent") {
      if (newValue) {
        

        setAddressDetails((prevDetails) => ({
          ...prevDetails,
          permanentAddress1: prevDetails.currentAddress1,
          permanentAddress2: prevDetails.currentAddress2,
          permanentCountry: prevDetails.country,
          permanentCountryId: prevDetails.countryId,
          permanentState: prevDetails.state,
          permanentStateId: prevDetails.stateId,
          permanentCity: prevDetails.city,
          permanentCityId: prevDetails.cityId,
          permanentZip: prevDetails.zip,
          [name]: newValue,
        }));
      } else {
        setAddressDetails((prevDetails) => ({
          ...prevDetails,
          [name]: newValue,
        }));
      }
    } else {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        [name]: newValue,
      }));
    }
  };

  const AddressDetails_submit = async () => {
    personalDetails_submit();
    setOverlayVisible(false);
    // try {
    //   const res = await update_AddressDetails(userid, addressDetails);

    //   if (res.status === 201) {
    //     toast.success(res.data);
    //   } else {
    //     toast.error(res.data);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("something wrong..");
    // }
  };
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [btnDisable, setBtnDesable] = useState(true);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  return (
    <>
      <div>
        
        <form method="post" encType="multipart/form-data">
          <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8">
            <br />
            <h4>Personal Details</h4>
            <hr />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  City Type <span className="text-red-600">*</span>
                </p>
                <select
                  name="cityType"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.cityType}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value={""}>Please Select</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Father's Name<span className="text-red-600">*</span>
                </p>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's Name"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.fatherName}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Mother's Name
                </p>
                <input
                  type="text"
                  name="motherName"
                  placeholder="Mother's Name"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.motherName}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Profile Image
                </p>
                <div className="flex">
                  {data?.profileImage ? (
                    <div>
                      <img
                        onClick={() =>
                          openProfileImageView(
                            `${data?.profileImage}`
                          )
                        }
                        className="h-12 w-12 mr-2 rounded-full object-cover shadow"
                        src={
                          data?.profileImage
                            ? `${data?.profileImage}`
                            : "/assets/images/profile/user.png"
                        }
                        alt="User"
                      />
                      {showProfile && (
                        <ImageView
                          imageUrl={selectedImage}
                          onClose={closeProfileImageView}
                        />
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <input
                    type="file"
                    name="profileImage"
                    placeholder="Profile Image"
                    onChange={handleFileChange}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full"
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Gender<span className="text-red-600">*</span>
                </p>
                <select
                  name="gender"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.gender}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value="">Please Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Date of Birth<span className="text-red-600">*</span>
                </p>
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.dateOfBirth}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Marital Status
                </p>
                <select
                  name="maritalStatus"
                  placeholder="Marital Status"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.maritalStatus}
                  className="input select focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value={""}>please select</option>
                  {maritalStatuses.map((value) => (
                    <option value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Date of Marriage
                </p>
                <input
                  type="date"
                  name="dateOfMarriage"
                  placeholder="Date of Marriage"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.dateOfMarriage}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Nationality
                </p>
                <select
                  name="nationality"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.nationality}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value={""}>please select</option>
                  {nationalities.map((value) => (
                    <option value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  PFUAN
                </p>
                <input
                  type="text"
                  name="PFUAN"
                  placeholder="PFUAN"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.PFUAN}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Joining Date<span className="text-red-600">*</span>
                </p>
                <input
                  type="date"
                  name="joiningDate"
                  placeholder="Joining Date"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.joiningDate}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Blood Group
                </p>
                <select
                  name="bloodGroup"
                  placeholder="Blood Group"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.bloodGroup}
                  className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                >
                  <option value={""}>please select</option>
                  {bloodGroups.map((value) => (
                    <option value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Notice Days
                </p>
                <input
                  type="text"
                  name="noticeDays"
                  placeholder="Notice Days"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.noticeDays}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Passport Number
                </p>
                <input
                  type="text"
                  name="passportNo"
                  placeholder="Passport Number"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.passportNo}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Aadhar Card Number
                </p>
                <input
                  type="text"
                  name="aadharCardNo"
                  placeholder="Aadhar Card Number"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.aadharCardNo}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  PAN Number
                </p>
                <input
                  type="text"
                  name="panNo"
                  placeholder="PAN Number"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.panNo}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  PF Number
                </p>
                <input
                  type="text"
                  name="PFNo"
                  placeholder="PF Number"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.PFNo}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Date of Gratuity
                </p>
                <input
                  type="date"
                  name="dateOfGratuity"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.dateOfGratuity}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  ESI Number
                </p>
                <input
                  type="text"
                  name="ESINumber"
                  placeholder="ESI Number"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.ESINumber}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Payroll Type
                </p>
                <input
                  type="text"
                  name="payRollType"
                  placeholder="Payroll Type"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.payRollType}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
              <div className="w-full">
                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                  Contract End Date
                </p>
                <input
                  type="date"
                  name="contractEndDate"
                  onChange={handlePersonalDetailsChange}
                  value={personalDetails.contractEndDate}
                  className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <br />
              <h4>Address Details</h4>
              <hr />
              <br />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Current Address 1
                  </p>
                  <input
                    type="text"
                    name="currentAddress1"
                    placeholder="Current Address 1"
                    onChange={handleAddressChange}
                    value={addressDetails.currentAddress1}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  />
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Current Address 2
                  </p>
                  <input
                    type="text"
                    name="currentAddress2"
                    placeholder="Current Address 2"
                    onChange={handleAddressChange}
                    value={addressDetails.currentAddress2}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  />
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Country
                  </p>
                  <select
                    name="country"
                    onChange={handleAddressChange}
                    value={addressDetails.country}
                    className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  >
                    <option>Select country</option>
                    {countries?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    State
                  </p>
                  <select
                    name="state"
                    onChange={handleAddressChange}
                    value={addressDetails.state}
                    className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  >
                    <option>Select country</option>
                    {states?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    City
                  </p>
                  <select
                    name="city"
                    placeholder="City"
                    onChange={handleAddressChange}
                    value={addressDetails.city}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  >
                    <option>Select country</option>
                    {city?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    ZIP Code
                  </p>
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    onChange={handleAddressChange}
                    value={addressDetails.zip}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  />
                </div>
                <div className="w-full">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    <input
                      type="checkbox"
                      name="isSameAsCurrent"
                      onChange={handleAddressChange}
                      className="ml-3 mr-3"
                      checked={addressDetails.isSameAsCurrent}
                    />
                    Is Same As Current Address
                  </label>
                </div>
                <div className="w-full"></div>
                <div className="w-full"></div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Permanent Address 1
                  </p>
                  <input
                    type="text"
                    name="permanentAddress1"
                    disabled={addressDetails?.isSameAsCurrent}
                    placeholder="Permanent Address 1"
                    onChange={handleAddressChange}
                    value={
                      addressDetails.isSameAsCurrent
                        ? addressDetails.currentAddress1
                        : addressDetails.permanentAddress1
                    }
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  />
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Permanent Address 2
                  </p>
                  <input
                    type="text"
                    name="permanentAddress2"
                    disabled={addressDetails?.isSameAsCurrent}
                    placeholder="Permanent Address 2"
                    onChange={handleAddressChange}
                    value={
                      addressDetails.isSameAsCurrent
                        ? addressDetails.currentAddress2
                        : addressDetails.permanentAddress2
                    }
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  />
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Permanent Country
                  </p>
                  <select
                    name="permanentCountry"
                    onChange={handleAddressChange}
                    disabled={addressDetails?.isSameAsCurrent}
                    value={
                      addressDetails.isSameAsCurrent
                        ? addressDetails.country
                        : addressDetails.permanentCountry
                    }
                    className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  >
                    <option>Select country</option>
                    {pcountries?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Permanent State
                  </p>
                  <select
                    name="permanentState"
                    onChange={handleAddressChange}
                    value={
                      addressDetails.isSameAsCurrent
                        ? addressDetails.state
                        : addressDetails.permanentState
                    }
                    disabled={addressDetails?.isSameAsCurrent}
                    className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  >
                    <option>Select country</option>
                    { 
                    !addressDetails.isSameAsCurrent?        
                                 pstates?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))
                    :
                    states?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))
                    }
                  </select>
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Permanent City
                  </p>
                  <select
                    name="permanentCity"
                    placeholder="Permanent City"
                    onChange={handleAddressChange}
                    value={
                      addressDetails.isSameAsCurrent
                        ? addressDetails.city
                        : addressDetails.permanentCity
                    }
                    disabled={addressDetails?.isSameAsCurrent}
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                  >
                    <option>Select country</option>
                    {!addressDetails.isSameAsCurrent ? pcity?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    )) :
                    city?.map((data) => (
                      <option data-id={data?.iso2} value={data?.name}>
                        {data?.name}
                      </option>
                    ))
                    }
                  </select>
                </div>
                <div className="w-full">
                  <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                    Permanent ZIP Code
                  </p>
                  <input
                    type="text"
                    name="permanentZip"
                    placeholder="Permanent ZIP Code"
                    onChange={handleAddressChange}
                    value={
                      addressDetails.isSameAsCurrent
                        ? addressDetails.zip
                        : addressDetails.permanentZip
                    }
                    className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    disabled={addressDetails?.isSameAsCurrent}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col-reverse">
              <div>
                {/* <button
                      type="button"
                      className="text-white mr-8 mt-10 rounded bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => setformnav(formnav - 1)}
                    >
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2 ml-3"
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
                          d="M13 5H1m0 0l4-4M1 5l4 4"
                        />
                      </svg>
                      Back
                    </button> */}

                <button
                  type="button"
                  className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={toggleOverlay}
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
          {overlayVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
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
                    onClick={AddressDetails_submit}
                    className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default PersonalDetail;
