"use server";
import { cookies } from "next/headers";
import { send } from 'next/server';
const btnLogout = async () => {
  try {
    cookies().delete("authToken");
    //console.log("called btn logout");
    
    //send({ status: 303, location: '/login' });
  } catch (error) {
    console.log(error);
  }
};

export { btnLogout };
