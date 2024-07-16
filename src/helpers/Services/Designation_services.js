import apis from "../Api";
import { toast } from 'react-toastify';

export async function getAllDesignation() {
  try {
    const response = await apis.get(`/designation/getDesignations`);
    console.log(response);
    return response;
  } catch (error) {
    toast.error(error);
    return error;
  }
}

export async function getAddDesignation(data) {
  try {
    const response = await apis.post(`/designation/addDesignation`, data);
    console.log(response);
    return response;
  } catch (error) {
    // toast.error(error.message);
    return error;
  }
}

export async function deleteDesignation(id) {
  try {
    const response = await apis.delete(`/designation/deletedDesignation/${id}`);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function updateDesignation(id, data) {
  try {
    const response = await apis.put(`/designation/updateDesignation/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getDesignationTree ()
{
  try
  {
    return await apis.get('/designation/designationtree');
  }catch(error)
  {
    return error;
  }
}
export async function updateDesignationStatus(data)
{
  return await apis.put('/designation/updatestatus',data);  
}