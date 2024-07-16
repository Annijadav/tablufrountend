import apis from "../Api";

//services for holiday types
export async function getAllHolidayType() {
  try {
    const response = await apis.get(`/holiday/holidayTypes`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function postAddHolidayType(data) {
  try {
    const response = await apis.post(`/holiday/addHolidayType`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteHolidayType(id) {
  try {
    const response = await apis.delete(`/holiday/deleteHolidayType/${id}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function updateHolidayType(id, data) {
  try {
    const response = await apis.put(`/holiday/updateHolidayType/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}

//services for holiday Applicabilities
export async function getAllHolidayApplicability() {
  try {
    const response = await apis.get(`/holiday/holidayApplicabilities`);
    return response;
  } catch (error) {
    return error;
  }
}
export async function getAllHolidayApplicableOn(applicability) {
  try {
    const response = await apis.get(`/holiday/holidayApplicableOnList/${applicability}`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function postAddHolidayApplicability(data) {
  try {
    const response = await apis.post(`/holiday/addHolidayApplicability`, data);
    return response;
  } catch (error) {
    return error;
  }
}


//services for holiday
export async function getAllHoliday() {
  try {
    const response = await apis.get(`/holiday/holidays`);
    return response;
  } catch (error) {
    return error;
  }
}

export async function postAddHoliday(data) {
  try {
    const response = await apis.post(`/holiday/addHoliday`, data);
    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteHoliday(id) {
  try {
    const response = await apis.delete(`/holiday/deleteHoliday/${id}`);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error;
  }
}

export async function updateHoliday(id, data) {
  try {
    const response = await apis.put(`/holiday/updateHoliday/${id}`, data);
    return response;
  } catch (error) {
    return error;
  }
}


//dashboard calender data
export async function getCalendarData(userID) {
    try {
      const response = await apis.get(`/holiday/calendarData/${userID}`);
      return response;
    } catch (error) {
      return error;
    }
  }