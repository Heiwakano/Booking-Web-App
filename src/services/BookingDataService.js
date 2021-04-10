import http from "../http-common";

//Return All bookings from database.
const getAll = () => {
    return http.get("/bookings");
  };

//Return booking with room and status by bookingId.
const get = id => {
    return http.get(`/bookings/${id}`);
  };

//Create a booking 
const create = data => {
    return http.post("/bookings", data);
  };

//Update a booking with id
const update = (id, data) => {
  return http.put(`/bookings/${id}`, data);
};

//Delete a booking with id
const remove = id => {
    return http.delete(`/bookings/${id}`);
  };

// Delete all bookings
const removeAll = () => {
    return http.delete(`/bookings`);
  };

// Retrieve bookings with lastName or first or status.
const findBooking = (name,status) => {
  const condition = status!==""&&name!==""?'?Name='+name+'&&Status='+status
  :status===""&&name!==""?'?Name='+name:status!==""&&name===""?'?Status='+status
  :'';
    return http.get(`/bookings`+condition);
};



const findCheapest = data => { 
  return http.post(`/bookings/findCheapest`, data);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findBooking,
  findCheapest
};