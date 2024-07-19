import apis from "../Api";
import { toast } from "react-toastify";

export async function getApplyLeave(data) {
  try {
    const response = await apis.post(`/leave/applyLeave`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    //   toast.error(error.message);
    return error;
  }
}

export async function getAllLeaves() {
  return await apis
    .get(`/leave/viewLeaves`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}

export async function getAllLeaveRuleNames() {
  return await apis
    .post(`/leaveRule/getleavenames`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}
export async function getLeaveBalance(userID) {
  return await apis
    .get(`/leave/viewLeaveBalance/${userID}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}

export async function deleteLeave(id) {
  try {
    const response = await apis.delete(`/leave/deleteLeave/${id}`);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function getOneLeave(userId) {
  try {
    const response = await apis.get(`/leave/viewLeave/${userId}`);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function leaveStatusApprove(id, data) {
  try {
    const response = await apis.post(`/leave/updateStatusApprove/${id}`, data);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function leaveStatusReject(data) {
  try {
    const response = await apis.post(`/leave/updateStatusReject`, data);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function getLeaveTypesByLeaveRule(id) {
  try {
    const response = await apis.get(`/leave/viewLeaveTypes/${id}`);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function getSelectedLeaveRule(userId, leaveTypeId) {
  try {
    const response = await apis.get(
      `/leave/viewSelectedLeaveTypeRule/${userId}/${leaveTypeId}`
    );
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}






// leave Rule Services

export async function getAddLeaveRule(data) {
  try {
    const response = await apis.post(`/leaveRule/createLeaveRule`, data);
    console.log(response);
    return response;
  } catch (error) {
    //   toast.error(error.message);
    return error;
  }
}

export async function getLeaveRules() {
  return await apis
    .get(`/leaveRule/leaveRules`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}

export async function deleteLeaveRule(id) {
  try {
    const response = await apis.delete(`/leaveRule/deleteLeaveRule/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function postAddLeaveType(id, data) {
  try {
    const response = await apis.post(`/leaveRule/addLeaveType/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function getLeaveTypes(id) {
  try {
    const response = await apis.get(`/leaveRule/leaveTypes/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateBasicLeaveRule(leaveRuleId, leaveDetailId, data) {
  try {
    const response = await apis.put(
      `/leaveRule/leaveTypes/basicDetail/${leaveRuleId}/${leaveDetailId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateLeaveDetailRule(leaveRuleId, leaveDetailId, data) {
  try {
    const response = await apis.put(
      `/leaveRule/leaveTypes/leaveDetail/${leaveRuleId}/${leaveDetailId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateLeaveRestrictionRule(
  leaveRuleId,
  leaveDetailId,
  data
) {
  try {
    const response = await apis.put(
      `/leaveRule/leaveTypes/leaveRestrictionDetail/${leaveRuleId}/${leaveDetailId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateAdvanceSettingsRule(
  leaveRuleId,
  leaveDetailId,
  data
) {
  try {
    const response = await apis.put(
      `/leaveRule/leaveTypes/advanceSettings/${leaveRuleId}/${leaveDetailId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

//update leave rule name
export async function updateLeaveRule(leaveRuleId, data) {
  try {
    const response = await apis.put(
      `/leaveRule/updateLeaveRule/${leaveRuleId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateLeaveRuleStatus(leaveRuleId, leaveDetailId, data) {
  try {
    const response = await apis.put(
      `/leaveRule/leaveTypes/updateStatus/${leaveRuleId}/${leaveDetailId}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function getEmployeeListAsPerLeaveRule(id) {
  try {
    const response = await apis.get(`/leaveRule/${id}/employees`);
    return response;
  } catch (error) {
    return error;
  }
}
