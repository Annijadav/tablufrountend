"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

function page() {
  // var config = {
  //     method: 'get',
  //     url: '',
  //     headers: {
  //       'X-CSCAPI-KEY': 'dTB6VFlGMUZ4SzlDNUd1aGtEcVI4dGlITXRjSVRIaVdtRWpKcndTMQ=='
  //     }
  //   };
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
  const [states, setstates] = useState(null);
  const [state,setstate] = useState(null);
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
  
  useEffect(() => {
    getcountry();
  }, []);
  if (!countries) {
    return <p>loading</p>;
  }
  return (
    <div>
      <select name="country" onChange={(e) => getStates(e.target.value)}>
        <option>please select</option>
        {countries?.map((data) => (
          <option value={data?.iso2}>{data?.name}</option>
        ))}
      </select>


            <select name="state" onChange={(e) => getCity(e.target.value)}>
            <option>please select</option>
        {states?.map((data) => (
          <option value={data?.iso2}>{data?.name}</option>
        ))}
      </select>

            <select name="city" >
            <option>please select</option>
        {city?.map((data) => (
          <option value={data?.iso2}>{data?.name}</option>
        ))}
      </select>
        
    </div>
  );
}

export default page;
