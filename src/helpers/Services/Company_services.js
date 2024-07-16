import apis from "../Api";

//Industry Services
export async function getAllIndustry() {
  try {
    const response = await apis.get(`/company/industries`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAllActiveIndustry(isActive) {
  try {
    const response = await apis.get(`/company/industries/${isActive}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function postAddIndustry(data) {
  try {
    const response = await apis.post(`/company/addIndustry`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteIndustry(id) {
  try {
    const response = await apis.delete(`/company/deleteIndustry/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateIndustry(id, data) {
  try {
    const response = await apis.put(`/company/updateIndustry/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}

//Company Services
export async function postAddCompany(data) {
  try {
    const response = await apis.post(`/company/addCompany`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getAllCompanies() {
  try {
    const response = await apis.get(`/company/companies`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteCompany(id) {
  try {
    const response = await apis.delete(`/company/deleteCompany/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateCompany(id, data) {
  try {
    const response = await apis.put(`/company/updateCompany/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getCompanyById(companyId)
{
  try {
    const response = await apis.post(`/company/getCompany`, companyId);
    return response;
  } catch (error) {
    return error;
  }
}
