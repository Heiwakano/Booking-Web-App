import http from "../http-common";

//Return All statuses from database.
const getAll = () => {
    return http.get("/statuses");
  };

//Return status by roomId.
const get = id => {
    return http.get(`/statuses/${id}`);
  };

//Create a booking 
const create = data => {
  return http.post("/statuses", data);
};

//Update a status with id
const update = (id, data) => {
    return http.put(`/statuses/${id}`, data);
  };

//Delete a status with id
const remove = id => {
    return http.delete(`/statuses/${id}`);
  };

// Delete all bookings
const removeAll = () => {
    return http.delete(`/statuses`);
  };

// Retrieve statuses with roomNumber
const findByLabel = status => {
    return http.get(`/statuses?Label=${status}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByLabel
  };