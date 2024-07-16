"use client";
import { getRoles } from "@/helpers/Services/Role_services";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JoiSchema from "./ValidateSchema";
import {
  addemployee,
  update_AddressDetails,
  update_BankDetails,
  update_Education,
  update_EmergencyDetail,
  update_ExperinceDetails,
  update_personaldetails,
  update_workDetails,
} from "@/helpers/Services/Employee_services";
import { getAllDepartment } from "@/helpers/Services/Department_services";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { getAllDesignation } from "@/helpers/Services/Designation_services";
import { getAllLeaveRuleNames } from "@/helpers/Services/Leave_services";
import ShowFullScreenLoading from "@/components/ShowFullScreenLoading";

function page() {
  const router = useRouter();
  const [formnav, setformnav] = useState(0);
  const [roles_data, setroles_data] = useState([]);
  const [userid, setuserid] = useState("");
  const nationalities = ["India", "United States", "United Kingdom", "Canada"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const [leaveRule,setLeaveRule] = useState(null);
  const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js
  const [department, setDepartment] = useState([]);
  const [loading,setLoading]= useState(false);
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
  const [designation, setDesignation] = useState(null);
  const getDesignations = async () => {
    try {
      const response = await getAllDesignation();

      if (response.status === 200) {
        //console.log(response);
        await setDesignation(response.data);
        console.log(department);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
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
  const getCity = async (id) => {
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
  const getpCity = async (id) => {
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

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const getLeaveRuleList = async () => {
    try {
      const response = await getAllLeaveRuleNames();

      if (response.status === 200) {
        //console.log(response);
        await setLeaveRule(response.data);
        console.log(response.data);
        
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getRolelist = async () => {
    try {
      const res = await getRoles();
      if (res.status === 200) {
        setroles_data(res.data);

        //console.log(res.data);
      } else {
        toast.error("connection failed...");
      }
    } catch (error) {
      console.log(error);
      toast.error("internal error");
    }
  };
  const getAllDepartmentList = async () => {
    try {
      const response = await getAllDepartment();

      if (response.status === 200) {
        //console.log(response);
        await setDepartment(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRolelist();
    getAllDepartmentList();
    getDesignations();
    getcountry(false);
    getcountry(true);
    getLeaveRuleList();
  }, []);
  // --------------------------------------------basic details-------------------------------------
  const [basicDetails, setBasicDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const handlechange = (e) => {
    setBasicDetails({
      ...basicDetails,
      [e.target.name]: e.target.value,
    });
  };
  const basicDetails_submit = async () => {
    const { error, value } = JoiSchema.validate(basicDetails, {
      abortEarly: false,
    });
    if (error) {
      const firstErrorMessage = error.details[0].message;
      toast.error(firstErrorMessage);
    } else {
      //console.log('Form data is valid:', value);
      try {setLoading(true);
        const res = await addemployee(value);
        setLoading(false);
        if (res?.status === 200) {
          await setuserid(res.data.userid);
          ss
          setBasicDetails({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: "",
            password: "",
          });
          setformnav(1);

          toast.success("user added successfuly");
        } else {
          toast.error(res.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // --------------------------------------------basic details end-------------------------------------
  // --------------------------------------------personal details end-------------------------------------

  const [personalDetails, setPersonalDetails] = useState({
    cityType: "",
    fatherName: "",
    motherName: "",
    profileImage: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    dateOfMarriage: "",
    nationality: "",
    PFUAN: "",
    joiningDate: "",
    bloodGroup: "",
    noticeDays: "",
    passportNo: "",
    aadharCardNo: "",
    panNo: "",
    PFNo: "",
    dateOfGratuity: "",
    ESINumber: "",
    payRollType: "",
    contractEndDate: "",
  });
  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };
  const personalDetails_submit = async () => {
    if (userid) {
      try {
        setLoading(true);
        const res = await update_personaldetails(userid, personalDetails);
        setLoading(false);
        if (res.status === 201) {
          toast.success(res.data);
          //setformnav(2);
          scrollToTop();
        } else {
          toast.error(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("something wrong..");
      }
    } else {
      toast.error("userid not found");
    }
  };
  // --------------------------------------------personal details end-------------------------------------
  const [addressDetails, setAddressDetails] = useState({
    currentAddress1: "",
    currentAddress2: "",
    country: "",
    countryId: "",
    state: "",
    stateId: "",
    city: "",
    cityId: "",
    zip: "",
    isSameAsCurrent: false,
    permanentAddress1: "",
    permanentAddress2: "",
    permanentCountry: "",
    permanentCountryId: "",
    permanentState: "",
    permanentStateId: "",
    permanentCity: "",
    permanentCityId: "",
    permanentZip: "",
  });
  const handleAddressChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === "checkbox" ? checked : value;

    if (name === "country") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ["countryId"]: selectedId,
      });
      getStates(selectedId);
    }
    if (name === "permanentCountry") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ["permanentCountryId"]: selectedId,
      });
      getpStates(selectedId);
    }
    if (name === "state") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ["stateId"]: selectedId,
      });
      getCity(selectedId, state);
    }
    if (name === "permanentState") {
      const selectedId = e.target.selectedOptions[0].getAttribute("data-id");
      setAddressDetails({
        ...addressDetails,
        ["permanentStateId"]: selectedId,
      });
      getpCity(selectedId, pstate);
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
    console.log(addressDetails);
    try {
      setLoading(true);
      const res = await update_AddressDetails(userid, addressDetails);
      setLoading(false);
      if (res.status === 201) {
        toast.success(res.data);
        setformnav(2);
        scrollToTop();
      } else {
        toast.error(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("something wrong..");
    }
  };
  // -----------------------------------------------work details-------------------------------------------
  const [workDetails, setWorkDetails] = useState({
    officeLandlineNumber: "",
    employeeCode: "",
    leaveRule: "",
    reportingManager: "",
    shift: "",
    department: "",
    designation: "",
    grade: "",
    employeeType: "",
    company: "",
    location: "",
    biomerticId: "",
    hiringSource: "",
    probationStatus: "",
    sourceOfVerification: "",
  });

  const [workExperiences, setWorkExperiences] = useState([
    {
      previousCompanyName: "",
      jobTitle: "",
      fromDate: "",
      toDate: "",
    },
  ]);

  const handleWorkExperienceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedWorkExperiences = [...workExperiences];
    updatedWorkExperiences[index][name] = value;
    setWorkExperiences(updatedWorkExperiences);
  };

  const handleAddMore = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        previousCompanyName: "",
        jobTitle: "",
        fromDate: "",
        toDate: "",
      },
    ]);
  };
  const handleRemove = (index) => {
    const updatedWorkExperiences = [...workExperiences];
    updatedWorkExperiences.splice(index, 1);
    setWorkExperiences(updatedWorkExperiences);
  };
  const handleWorkDetailsChange = (e) => {
    const { name, value } = e.target;
    setWorkDetails((prevWorkDetails) => ({
      ...prevWorkDetails,
      [name]: value,
    }));
  };
  const workDetails_submit = async () => {
    let er = false;
    try {
      setLoading(true);
      const res = await update_workDetails(userid, workDetails);
      setLoading(false);
      if (res.status === 201) {
        console.log(res);
      } else {
        toast.error(res.response.data.message);
        er = true;
      }

      if (workExperiences.length > 0) {
        for (let i = 0; i < workExperiences.length; i++) {
          const response = await update_ExperinceDetails(
            userid,
            workExperiences[i]
          );
          if (response.status === 201) {
            //console.log("Record added successfully:",i+1);
          } else {
            toast.error(response.response.data.message);
            er = true;
            break;
          }
        }
      }
      if (!er) {
        toast.success("saved");
        setformnav(3);
      }
    } catch (error) {
      console.log(error);
      toast.error("something wrong");
    }
  };
  // -----------------------------------------------work details end-------------------------------------------
  // -----------------------------------------------bank details-------------------------------------------
  const [bankDetails, setBankDetails] = useState({
    paymentType: "",
    bankName: "",
    accountNo: "",
    IFSCcode: "",
    accountHolderName: "",
  });

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevBankDetails) => ({
      ...prevBankDetails,
      [name]: value,
    }));
  };

  const bankDetails_submit = async () => {
    try {
      setLoading(true);
      const response = await update_BankDetails(userid, bankDetails);
      setLoading(false);
      if (response.status === 201) {
        toast.success(response.data.message);
        setformnav(4);
      } else {
        toast.error(response.response.data.message);
        console.log(response.response);
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing wrong..");
    }
  };
  // -----------------------------------------------bank details end-------------------------------------------
  const [EducationDetail, setEducationDetail] = useState([
    {
      diplomaDegreeName: "",
      instituteName: "",
      passingYear: "",
      percentage: "",
    },
  ]);

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEducationDetails = [...EducationDetail];
    updatedEducationDetails[index][name] = value;
    setEducationDetail(updatedEducationDetails);
  };

  const handleAddMore_EducationChange = () => {
    setEducationDetail([
      ...EducationDetail,
      {
        diplomaDegreeName: "",
        instituteName: "",
        passingYear: "",
        percentage: "",
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducationDetails = [...EducationDetail];
    updatedEducationDetails.splice(index, 1);
    setEducationDetail(updatedEducationDetails);
  };
  const [contact, setContact] = useState({
    name: "",
    address: "",
    mobileNo: "",
    relationShip: "",
    email: "",
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const submit_Other_details = async () => {
    try {
      if (EducationDetail.length > 0) {
        setLoading(true);
        for (let i = 0; i < EducationDetail.length; i++) {
          console.log(EducationDetail[i]);
          const response = await update_Education(userid, EducationDetail[i]);
          if (response.status === 201) {
            console.log("Record added successfully:", i + 1);
          } else {
            toast.error(response.response.data.message);
            setLoading(false);
            break;
          }
        }
      }
      setLoading(true);
      const response1 = await update_EmergencyDetail(userid, contact);
      setLoading(false);
      if (response1.status === 201) {
        toast.success(response1.data.message);
        router.push(`/dashboard/employee/viewemployee/${userid}`);
      } else {
        toast.error(response1.data.message);
        console.log(response1);
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing wrong...");
    }
  };
  return (
    <>
    {loading&&<ShowFullScreenLoading/>}
      <div className="text-sm breadcrumbs">
        <ul>
          <li className="font-semibold	">
            <Link className="text-black	" href={"/dashboard/"}>
              Home
            </Link>
          </li>
          <li>
            <Link className="text-black	" href={"/dashboard/employee"}>
              Employee
            </Link>
          </li>

          <li>Add Employee</li>
        </ul>
      </div>

      <div className="card">
        <div className="card-body bg-grey-200" id="top-anchor">
          <ul className="steps">
            <li className="step step-primary">Basic Details</li>
            <li className={`step ${formnav >= 1 ? "step-primary" : ""}`}>
              Personal Details
            </li>
            <li className={`step ${formnav >= 2 ? "step-primary" : ""}`}>
              work Details
            </li>
            <li className={`step ${formnav >= 3 ? "step-primary" : ""}`}>
              Bank Details
            </li>
            <li className={`step ${formnav >= 4 ? "step-primary" : ""}`}>
              other
            </li>
          </ul>
          {/* ----------------------------basic details-------------------------------------- */}
          {formnav === 0 && (
            <div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <hr />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      First Name <span className="text-red-400">*</span>
                    </p>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="john"
                      onChange={handlechange}
                      value={basicDetails.firstName}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Last Name<span className="text-red-400">*</span>
                    </p>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="john"
                      onChange={handlechange}
                      value={basicDetails.lastName}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Email<span className="text-red-400">*</span>
                    </p>
                    <input
                      type="email"
                      name="email"
                      placeholder="john"
                      onChange={handlechange}
                      value={basicDetails.email}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Phone Number<span className="text-red-400">*</span>
                    </p>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="john"
                      onChange={handlechange}
                      value={basicDetails.phone}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Role<span className="text-red-400">*</span>
                    </p>
                    <select
                      name="role"
                      onChange={handlechange}
                      className=" select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    >
                      <option>Please Select</option>
                      {roles_data ? (
                        roles_data.map((item, key) => (
                          <option key={key} value={item._id}>
                            {item.name}
                          </option>
                        ))
                      ) : (
                        <option>failed</option>
                      )}
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Initial Password<span className="text-red-400">*</span>
                    </p>
                    <input
                      type="Password"
                      name="password"
                      onChange={handlechange}
                      value={basicDetails.password}
                      placeholder="john"
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row-reverse">
                <button
                  type="button"
                  className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={basicDetails_submit}
                >
                  Create Account
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
          )}
          {/* ----------------------------basic details End-------------------------------------- */}
          {/* ----------------------------personalDetails details-------------------------------------- */}
          {formnav === 1 && (
            <div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h4>Personal Details</h4>
                <hr />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      City Type
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
                      Father's Name
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
                    <input
                      type="file"
                      name="profileImage"
                      placeholder="Profile Image"
                      onChange={handlePersonalDetailsChange}
                      value={personalDetails.profileImage}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Gender
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
                      Date of Birth
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
                      Joining Date
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
                        <option>please select</option>
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
                        <option>please select</option>
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
                        <option>please select</option>
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
                        <option>please select</option>
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
                        {!addressDetails.isSameAsCurrent
                          ? pstates?.map((data) => (
                              <option data-id={data?.iso2} value={data?.name}>
                                {data?.name}
                              </option>
                            ))
                          : states?.map((data) => (
                              <option data-id={data?.iso2} value={data?.name}>
                                {data?.name}
                              </option>
                            ))}
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
                        {!addressDetails.isSameAsCurrent
                          ? pcity?.map((data) => (
                              <option data-id={data?.iso2} value={data?.name}>
                                {data?.name}
                              </option>
                            ))
                          : city?.map((data) => (
                              <option data-id={data?.iso2} value={data?.name}>
                                {data?.name}
                              </option>
                            ))}
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
                      onClick={AddressDetails_submit}
                    >
                      Save & Next
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
            </div>
          )}
          {/* ----------------------------personalDetails details End-------------------------------------- */}
          {/* ----------------------------Work details-------------------------------------- */}
          {formnav === 2 && (
            <div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h4>Work Details</h4>
                <hr />

                <br />

                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Office Landline Number
                    </p>
                    <input
                      type="tel"
                      name="officeLandlineNumber"
                      placeholder="Office Landline Number"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.officeLandlineNumber}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Employee Code
                    </p>
                    <input
                      type="text"
                      name="employeeCode"
                      placeholder="Employee Code"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.employeeCode}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Leave Rule
                    </p>
                    <select
                      name="leaveRule"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.leaveRule}
                      className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    >
                      <option>please select</option>
                      {leaveRule?.map((rule) => (
                        <option value={rule?._id}>{rule.leaveRuleName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Reporting Manager
                    </p>
                    <input
                      type="text"
                      name="reportingManager"
                      placeholder="Reporting Manager"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.reportingManager}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Shift
                    </p>
                    <input
                      type="text"
                      name="shift"
                      placeholder="Shift"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.shift}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Department
                    </p>
                    {/* Assuming departmentOptions is an array of department options */}
                    <select
                      name="department"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.department}
                      className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    >
                      <option value={""}>Please Select</option>
                      {department.map((department) => (
                        <option key={department._id} value={department._id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Designation
                    </p>
                    <select
                      name="designation"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.designation}
                      className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    >
                      <option value={""}>Please Select</option>
                      {designation?.map((designation) => (
                        <option key={designation._id} value={designation._id}>
                          {designation.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Grade
                    </p>
                    <input
                      type="text"
                      name="grade"
                      placeholder="Grade"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.grade}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Employee Type
                    </p>
                    <select
                      name="employeeType"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.employeeType}
                      className="select input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    >
                      <option value="">Please Select</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Contract">Contract</option>
                      <option value="Third Party">Third Party</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Company
                    </p>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.company}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Location
                    </p>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.location}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Biomertic ID
                    </p>
                    <input
                      type="text"
                      name="biomerticId"
                      placeholder="Biomertic ID"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.biomerticId}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Hiring Source
                    </p>
                    <input
                      type="text"
                      name="hiringSource"
                      placeholder="Hiring Source"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.hiringSource}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Probation Status
                    </p>
                    <input
                      type="text"
                      name="probationStatus"
                      placeholder="Probation Status"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.probationStatus}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Source of Verification
                    </p>
                    <input
                      type="text"
                      name="sourceOfVerification"
                      placeholder="Source of Verification"
                      onChange={handleWorkDetailsChange}
                      value={workDetails.sourceOfVerification}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                </div>
                {/* ----------------------------Work Experince details-------------------------------------- */}
                <div className="">
                  <br />
                  <hr />
                  <h4>Work Experience Details</h4>

                  <br />
                  {workExperiences.map((experience, index) => (
                    <div>
                      <div className="mt-2 flex w-full justify-between">
                        <p>record</p>
                        <div className="">
                          <button
                            onClick={() => handleRemove(index)}
                            className="block hover:bg-red-400 text-red-700 font-semibold hover:text-white py-2 px-4 border-1 border-red-400 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center"
                      >
                        <div className="w-full">
                          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                            Previous Company Name
                          </p>
                          <input
                            type="text"
                            name="previousCompanyName"
                            placeholder="Previous Company Name"
                            onChange={(e) =>
                              handleWorkExperienceChange(e, index)
                            }
                            value={experience.previousCompanyName}
                            className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                          />
                        </div>
                        <div className="w-full">
                          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                            Job Title
                          </p>
                          <input
                            type="text"
                            name="jobTitle"
                            placeholder="Job Title"
                            onChange={(e) =>
                              handleWorkExperienceChange(e, index)
                            }
                            value={experience.jobTitle}
                            className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                          />
                        </div>
                        <div className="w-full">
                          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                            From Date
                          </p>
                          <input
                            type="date"
                            name="fromDate"
                            onChange={(e) =>
                              handleWorkExperienceChange(e, index)
                            }
                            value={experience.fromDate}
                            className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                          />
                        </div>
                        <div className="w-full">
                          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                            To Date
                          </p>
                          <input
                            type="date"
                            name="toDate"
                            onChange={(e) =>
                              handleWorkExperienceChange(e, index)
                            }
                            value={experience.toDate}
                            className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                          />
                        </div>
                        <div></div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddMore}
                    className="block mt-3 hover:bg-green-400 text-green-700 font-semibold hover:text-white py-2 px-4 border-1 border-green-400 rounded"
                  >
                    Add More
                  </button>
                </div>
              </div>
              <div className="flex w-full flex-col-reverse">
                <div>
                  <button
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
                  </button>

                  <button
                    type="button"
                    className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={workDetails_submit}
                  >
                    Save & Next
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
          )}
          {/* ----------------------------work details End-------------------------------------- */}
          {/* ----------------------------bank details-------------------------------------- */}
          {formnav === 3 && (
            <div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="">
                  <br />
                  <h4>Bank Details</h4>
                  <hr />

                  <br />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                    <div className="w-full">
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
                    </div>
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
                  </button>

                  <button
                    type="button"
                    className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={bankDetails_submit}
                  >
                    Save & Next
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
          )}
          {/* ----------------------------bank details end-------------------------------------- */}
          {/* ----------------------------other details-------------------------------------- */}
          {formnav === 4 && (
            <div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="">
                  <br />

                  <br />
                  <div>
                    <hr />
                    <h4>Education Details</h4>
                    <br />

                    {EducationDetail.map((edurecord, index) => (
                      <div key={index}>
                        <div className="mt-2 flex w-full justify-between">
                          <p>Record {index + 1}</p>
                          <div className="">
                            <button
                              onClick={() => handleRemoveEducation(index)}
                              className="block hover:bg-red-400 text-red-700 font-semibold hover:text-white py-2 px-4 border-1 border-red-400 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                          <div className="w-full">
                            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                              Diploma/Degree Name
                            </p>
                            <input
                              type="text"
                              name="diplomaDegreeName"
                              placeholder="Diploma/Degree Name"
                              value={edurecord.diplomaDegreeName}
                              onChange={(e) => handleEducationChange(e, index)}
                              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                            />
                          </div>
                          <div className="w-full">
                            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                              Institute Name
                            </p>
                            <input
                              type="text"
                              name="instituteName"
                              placeholder="Institute Name"
                              value={edurecord.instituteName}
                              onChange={(e) => handleEducationChange(e, index)}
                              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                            />
                          </div>
                          <div className="w-full">
                            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                              Passing Year
                            </p>
                            <input
                              type="text"
                              name="passingYear"
                              placeholder="Passing Year"
                              value={edurecord.passingYear}
                              onChange={(e) => handleEducationChange(e, index)}
                              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                            />
                          </div>
                          <div className="w-full">
                            <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                              Percentage
                            </p>
                            <input
                              type="text"
                              name="percentage"
                              placeholder="Percentage"
                              value={edurecord.percentage}
                              onChange={(e) => handleEducationChange(e, index)}
                              className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleAddMore_EducationChange}
                      className="block mt-3 hover:bg-green-400 text-green-700 font-semibold hover:text-white py-2 px-4 border-1 border-green-400 rounded"
                    >
                      Add More
                    </button>
                  </div>
                </div>
                <hr />
                <h4>emergency Contacts Details</h4>

                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Name
                    </p>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      onChange={handleContactChange}
                      value={contact.name}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Address
                    </p>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      onChange={handleContactChange}
                      value={contact.address}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Mobile Number
                    </p>
                    <input
                      type="text"
                      name="mobileNo"
                      placeholder="Mobile Number"
                      onChange={handleContactChange}
                      value={contact.mobileNo}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Relationship
                    </p>
                    <input
                      type="text"
                      name="relationShip"
                      placeholder="Relationship"
                      onChange={handleContactChange}
                      value={contact.relationShip}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                  <div className="w-full">
                    <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
                      Email
                    </p>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleContactChange}
                      value={contact.email}
                      className="input focus:bg-gray-100 placeholder:text-gray-200 text-black input-bordered input-md w-full max-w-xs"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col-reverse">
                  <div>
                    <button
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
                    </button>

                    <button
                      type="button"
                      className="text-white mr-8 mt-10 rounded bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={submit_Other_details}
                    >
                      Save & Next
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
            </div>
          )}
          {/* ----------------------------other details end-------------------------------------- */}
        </div>
      </div>
    </>
  );
}
export default page;
