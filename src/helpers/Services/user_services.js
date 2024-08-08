import apis from '../Api'

export const getUsers = async () => {
    try {
      const response = await apis.get("/users"); // Assuming you have an endpoint to fetch users
      return response;
    } catch (error) {
      toast.error(error.message);
      return error;
    }
  };

  export const isauth=async()=>{
    try{
      return await apis.post("/isauth");
    }catch(error)
    {
      return error;
    }
  }
  export const getFullname = async () => {
    try {
      const response = await apis.get("/fullNames"); // Assuming you have an endpoint to fetch users
      return response;
    } catch (error) {
      toast.error(error.message);
      return error;
    }
  };

  export const getProfile=async(uid)=>{
    return apis.post(`/profile/${uid}`).then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    })
  }
  export const terminateUser=async(uid,terminate)=>{
    return apis.put(`/terminate/${uid}`,terminate).then((response)=>{
      return response
    }).catch((error)=>{
      return error;
    })
  }
  export const getMenuItems = async()=>{
    return apis.get('/menu/getmenuitems').then((response)=>{
      return response
    }).catch((error)=>{
      return error
    })
  }