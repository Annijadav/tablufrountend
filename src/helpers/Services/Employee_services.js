import { error } from '@/app/dashboard/employee/newemployee/ValidateSchema';
import apis from '../Api'
import { Exo } from 'next/font/google';

export async function get_Employees()
{
    
    
    return await apis.get(`/employee/employees`)
    .then((res)=>{
        //console.log(res);
        
        return res;
    }) .catch((error) => {
        return error;
      });
}
export async function get_EmployeesByPage(empPerPage,page,data)
{
    
    return await apis.post(`/employee/employeepage/${empPerPage}/${page}`,data)
    .then((res)=>{    
        return res;
    }) .catch((error) => {
        return error;
      });
}
export async function getEmployeeById(empid)
{
    return await apis.post(`/employee/findemployee`,empid)
    .then((res)=>{
        //console.log(res);
        
        return res;
    }) .catch((error) => {
        return error;
      });
}

export async function addemployee(data)
{
    return await apis.post('/adduser',data)
    .then((response)=>{
        return response;
    }).catch((error)=>{
        return error;
    })
}

export async function update_personaldetails(userid,data)
{
    return await apis.put(`/employee/updatePersonalDetails/${userid}`,data,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
    
}
export async function update_AddressDetails(userid,data)
{
    return await apis.put(`/employee/updateAddressDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
    
}
export async function update_workDetails(userid,data)
{
    return await apis.put(`/employee/updateWorkDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
    
}
export async function update_ExperinceDetails(userid,data)
{
    return await apis.put(`/employee/addWorkExperinceDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
    
}
export async function update_BankDetails(userid,data)
{
    return await apis.put(`/employee/updateBankDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
    
}
export async function update_Education(userid,data)
{
    return await apis.put(`/employee/addQualificationDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
        
}
export async function update_EmergencyDetail(userid,data)
{
    return await apis.put(`/employee/addEmergencyDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
    
}
export async function update_BasicDetails(userid,data)
{
    return await apis.put(`/employee/updateLoginDetails/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}
export async function update_ExpById(userid,expid,data)
{
    return await apis.put(`/employee/updateWorkExperinceDetails/${userid}/experince/${expid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}
export async function delete_ExpById(userid,rid)
{
    return await apis.put(`/employee/deleteExperince/${userid}/experince/${rid}`)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}

export async function update_eduById(userid,rid,data)
{
    return await apis.put(`/employee/updateQualificationDetails/${userid}/degree/${rid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}
export async function delete_eduById(userid,rid)
{
    return await apis.put(`/employee/deleteEducation/${userid}/education/${rid}`)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}
export async function update_employeeStatus(userid,data)
{
    return await apis.put(`/employee/updateEmployeeStatus/${userid}`,data)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}

export async function searchEmp(search)
{
    return await apis.get(`/employee/search`,search)
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}

export async function uploademployeebulk(data)
{
    return await apis.put(`/employee/uploademployeebulk`,data,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}

export async function downloadTemplate(data)
{
    return await apis.post(`/employee/downloadtemplate`,data,{
        responseType: 'arraybuffer',
      })
    .then((response)=>{
        return response;
    })
    .catch((error)=>{
        return error;
    })
}