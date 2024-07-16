"use client";

import ImageView from "@/components/ImageView";
import { getEmployeeById } from "@/helpers/Services/Employee_services";
import { getProfile } from "@/helpers/Services/user_services";
import { Spinner } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [user, setUser] = useState(null);
  const [role, setrole] = useState(null);
  const [detail, setdetail] = useState(1);
  const [userEdit, enableUserEdit] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const customBorderRadius = {
    borderRadius: '36% 64% 70% 30% / 34% 41% 59% 66%'
  };
  const openProfileImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowProfile(true);
  };

  const closeProfileImageView = () => {
    setShowProfile(false);
    setSelectedImage("");
  };

  const getemployee = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("authToken");
        if (token) {
          const tokendata = jwtDecode(token);
          const res = await getProfile(tokendata.id);
          if (res.status === 200) {
            setUser(res.data.user);
          } else {
            toast.error(res.response.data.message);
          }
        }
      }
    } catch (error) {
      //console.log(error);
      toast.warning("something went wrong..");
    }
  };
  useEffect(() => {
    getemployee();
  }, []);
  if (!user) {
    return (
      <center>
        <Spinner label="Loading" color="secondary" labelColor="secondary" />
      </center>
    );
  }
  return (
    <div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li className="font-semibold	">
            <Link className="text-black	" href={"/dashboard/"}>
              Home
            </Link>
          </li>
          <li>My Account </li>
        </ul>
      </div>

      <div className="min-h-screen rounded bg-whiteflex w-full flex-col items-center p-2 sm:px-6 lg:px-8">
        <div className=" w-full bg-white shadow-lg rounded overflow-hidden">
          <div className="relative h-56 bg-gradient-to-r from-purple-500 to-blue-500">
            <div className="absolute inset-x-0 -bottom-16 flex justify-center">
              {user ? (
                <div  style={customBorderRadius} className="p-1 bg-white">
                  <img
                    onClick={() =>
                      user?.personalDetails?.profileImage &&
                      openProfileImageView(
                        `http://localhost:5000/uploads/profile/${user.personalDetails.profileImage}`
                      )
                    }
                    className=" m-2 rounded-full object-cover shadow cursor-pointer"
                    style={customBorderRadius}
                    src={ 
                      user?.personalDetails?.profileImage
                        ? `${user.personalDetails.profileImage}`
                        : "/assets/images/profile/man.png"
                    }
                    alt="User"
                    width={128}
                    height={128}
                  />
                  {showProfile && (
                    <ImageView
                      imageUrl={selectedImage}
                      onClose={closeProfileImageView}
                    />
                  )}
                </div>
              ) : (
                <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
              )}
            </div>
          </div>
          <div className="p-8 pt-20 mt-14 text-center">
            <h1 className="text-3xl font-bold">{`${user.loginDetails.firstName} ${user.loginDetails.lastName}`}</h1>
            <p className="text-gray-600">{user.loginDetails.role.name}</p>
            <p className="text-gray-600">Date Of Birth : {`${user.personalDetails.dateOfBirth}`}</p>
            <div className="mt-4 flex justify-center space-x-6">
              <div>
                <p className="text-lg font-semibold">
                  {user.loginDetails.email}
                </p>
                <p className="text-gray-500">Email</p>
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {user.loginDetails.phone}
                </p>
                <p className="text-gray-500">Phone</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
            <Link href={`/dashboard/employee/editemployee/${user._id}`}> <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                edit
              </button></Link>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div class="">
        <div class="container mx-auto py-8">
          {user?<div class="grid grid-cols-4 h-screen sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 h-screen sm:col-span-3">
              <div class="bg-white shadow rounded-lg p-6">
                <div class="flex flex-col items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/94.jpg"
                    class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 class="text-xl font-bold">{user?.loginDetails?.firstName+" "+user?.loginDetails?.lastName}</h1>
                  <p class="text-gray-700">{user?.loginDetails?.phone}</p>
                  <div class="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                      href="#"
                      class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Contact
                    </a>
                    <a
                      href="#"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                    >
                      Resume
                    </a>
                  </div>
                </div>
                <hr class="my-6 border-t border-gray-300" />
                <div class="flex flex-col">
                  <span class="text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Skills
                  </span>
                  <ul>
                    <li class="mb-2">JavaScript</li>
                    <li class="mb-2">React</li>
                    <li class="mb-2">Node.js</li>
                    <li class="mb-2">HTML/CSS</li>
                    <li class="mb-2">Tailwind Css</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-span-4 h-screen sm:col-span-9">
              <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-bold mb-4">About Me</h2>
                <p class="text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  finibus est vitae tortor ullamcorper, ut vestibulum velit
                  convallis. Aenean posuere risus non velit egestas suscipit.
                  Nunc finibus vel ante id euismod. Vestibulum ante ipsum primis
                  in faucibus orci luctus et ultrices posuere cubilia Curae;
                  Aliquam erat volutpat. Nulla vulputate pharetra tellus, in
                  luctus risus rhoncus id.
                </p>

                <h3 class="font-semibold text-center mt-3 -mb-2">Find me on</h3>
                <div class="flex justify-center items-center gap-6 my-6">
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds LinkedIn"
                    href=""
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds YouTube"
                    href=""
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Facebook"
                    href=""
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Instagram"
                    href=""
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Twitter"
                    href=""
                    target="_blank"
                  >
                    <svg
                      class="h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                      ></path>
                    </svg>
                  </a>
                </div>

                <h2 class="text-xl font-bold mt-6 mb-4">Experience</h2>
                <div class="mb-6">
                  <div class="flex justify-between flex-wrap gap-2 w-full">
                    <span class="text-gray-700 font-bold">Web Developer</span>
                    <p>
                      <span class="text-gray-700 mr-2">at ABC Company</span>
                      <span class="text-gray-700">2017 - 2019</span>
                    </p>
                  </div>
                  <p class="mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    finibus est vitae tortor ullamcorper, ut vestibulum velit
                    convallis. Aenean posuere risus non velit egestas suscipit.
                  </p>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between flex-wrap gap-2 w-full">
                    <span class="text-gray-700 font-bold">Web Developer</span>
                    <p>
                      <span class="text-gray-700 mr-2">at ABC Company</span>
                      <span class="text-gray-700">2017 - 2019</span>
                    </p>
                  </div>
                  <p class="mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    finibus est vitae tortor ullamcorper, ut vestibulum velit
                    convallis. Aenean posuere risus non velit egestas suscipit.
                  </p>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between flex-wrap gap-2 w-full">
                    <span class="text-gray-700 font-bold">Web Developer</span>
                    <p>
                      <span class="text-gray-700 mr-2">at ABC Company</span>
                      <span class="text-gray-700">2017 - 2019</span>
                    </p>
                  </div>
                  <p class="mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    finibus est vitae tortor ullamcorper, ut vestibulum velit
                    convallis. Aenean posuere risus non velit egestas suscipit.
                  </p>
                </div>
              </div>
            </div>
          </div>:<center><Spinner label="Loading" color="secondary" labelColor="secondary"/></center>}
        </div>
      </div> */}
    </div>
  );
}
export default page;