import apis from "../Api";

export async function getRoles() {
  return await apis
    .get(`/role/roles`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}
export async function getRoleById(roleid) {
  return await apis
    .get(`/role/role/${roleid}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}

export async function deleteRole(id) {
  try {
    const response = await apis.delete(`/role/deleteRole/${id}`);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function getAddRole(data) {
  try {
    const response = await apis.post(`/role/role`, data);
    console.log(response);
    return response;
  } catch (error) {
    //   toast.error(error.message);
    return error;
  }
}

export async function updateRole(id, data) {
  try {
    const response = await apis.put(`/role/updateRole/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}
