import http from "../http-common";

//Return All rooms from database.
const getAll = () => {
    return http.get("/rooms");
  };

//Return room by roomId.
const get = id => {
    return http.get(`/rooms/${id}`);
  };

//Create a booking 
const create = data => {
  return http.post("/rooms", data);
};

//Update a room with id
const update = (id, data) => {
    return http.put(`/rooms/${id}`, data);
  };

//Delete a room with id
const remove = id => {
    return http.delete(`/rooms/${id}`);
  };

// Delete all rooms
const removeAllRooms = () => {
    return http.delete(`/rooms`);
  };

// Delete all bookings
const removeAll = () => {
    return http.delete(`/rooms`);
  };

// Retrieve rooms with roomNumber
const findByRoomNumber = roomNumber => {
    return http.get(`/rooms?RoomNumber=${roomNumber}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByRoomNumber
  };