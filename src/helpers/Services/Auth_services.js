import apis from '../Api'

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