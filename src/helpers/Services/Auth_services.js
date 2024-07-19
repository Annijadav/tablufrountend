import apis from "../Api";
import { jwtDecode } from "jwt-decode";

export async function getLogin(data) {
  try {
    const response = await apis.post(`/login`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getSendOTP(data) {
  try {
    const response = await apis.post(`/sendOTP`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getVerifyOTP(data) {
  try {
    const response = await apis.post(`/verifyOTP`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getResetPassword(data) {
  try {
    const response = await apis.post(`/resetPassword`, data);
    return response;
  } catch (error) {
    return error;
  }
}
export async function getSession() {
  try {
    const response = await apis.get(`/get-session`);
    console.log(response);
    return response;
  } catch (error) {
    //   toast.error(error);
    return error;
  }
}

export async function getTokenData() {
  try {
    const token = localStorage.getItem("authToken" || "");
    if (token) {
      const decoded = jwtDecode(token);
      // console.log("decoded", decoded);
      return decoded;
    } else {
      console.log("token not found");
    }
  } catch (error) {
    return error;
  }
}
