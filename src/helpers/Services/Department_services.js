import apis from "../Api";
import { toast } from 'react-toastify';

export async function getDepartmentPagination(currentPage, recordsPerPage) {
  try {
    const response = await apis.get(`/department/getdepartments/${currentPage}/${recordsPerPage}`);
    console.log("/department/departments?page=${currentPage}", response);
    return response; // Assuming your backend returns data in response.data
  } catch (error) {
    console.error("Error fetching department data:", error);
    return { department_data: [], totalPages: 0 }; // Return empty data and 0 totalPages in case of error
  }
}

export async function getAllDepartment(data) {
  try {
    const response = await apis.put(`/department/getAlldepartment`,data);
    return response; // Assuming your backend returns data in response.data
  } catch (error) {
    console.error("Error fetching department data:", error);
  }
}

export async function getDepartments(data) {
  try {
    const response = await apis.put(`/department/getAlldepartment`,data);
    console.log(response);
    return response;
  } catch (error) {
    toast.error(error);
    return error;
  }
}


export async function getAddDepartment(data) {
  try {
    const response = await apis.post(`/department/addDepartment`, data);
    console.log(response);
    return response;
  } catch (error) {
    // toast.error(error.message);
    return error;
  }
}

export async function deleteDepartment(id) {
  try {
    const response = await apis.delete(`/department/deletedepartment/${id}`);
    return response;
  } catch (error) {
    // toast.error(error.message);
    return error;
  }
}

export async function updateDepartment(id, data) {
  try {
    const response = await apis.put(`/department/updatedepartment/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updatestatus(data){
  try{
    return await apis.post(`/department/updatestatus`,data);
  }catch(error)
  {
    return error;
  }
}