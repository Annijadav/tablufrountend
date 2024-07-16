import apis from "../Api";
export async function getLeaves(data){
    try{
        return await apis.post('/dashboard/onleaves',data);
    }catch(error)
    {
        return error;
    }
}
export async function getBirthday(data)
{
    try{
        return await apis.post('dashboard/birthdays',data);
    }catch(error)
    {
        return error;
    }
}
export async function getStats(data)
{
    try{
    return await apis.post('dashboard/stats',data)
    }catch(error)
    {
        return error;
    }
}
export async function getHeadcountDepartment(data)
{
    try{
    return await apis.post('dashboard/departmentheadcount',data)
    }catch(error)
    {
        return error;
    }
}
export async function getGendercount(data)
{
    try{
    return await apis.post('dashboard/genderRation',data)
    }catch(error)
    {
        return error;
    }
}export async function getEmployeesTypes(data)
{
    try{
    return await apis.post('dashboard/getEmployeesTypes',data)
    }catch(error)
    {
        return error;
    }
}