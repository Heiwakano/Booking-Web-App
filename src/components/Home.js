import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";
import UserService from "../services/user.service";
import { Redirect } from 'react-router-dom';
import { ListGroup, Container, Row, Col, Table } from "react-bootstrap";
import { Button } from "bootstrap";

const Home = (props) => {

  const [content, setContent] = useState("");
  const [bookings, setBookings] = useState([]);

  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  today = yyyy + '/' + mm + '/' + dd;

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
    retrieveBookings();
  }, []);

  const retrieveBookings = () => {
    BookingDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setBookings(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkInBooking = (e) => {
    const idx = e.target.name;
    BookingDataService.update(bookingCheckInToday[idx].id, { statusId: 2 })
      .then(response => {
        console.log("Update Check In at bookingId", bookings[idx].id);
        refreshList();
        <Redirect to="/" />
        // props.history.push("/");
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const checkOutBooking = (e) => {
    const idx = e.target.name;
    props.history.push("/checkout/"+bookingCheckOutToday[idx].id);
    
  }

  const refreshList = () => {
    retrieveBookings();
};

  const bookingCheckInToday = bookings.filter(booking => booking.CheckInDate.replaceAll("-", "/") === today&&booking.Label === "Booked");
  console.log("dataCheckingToDay",bookingCheckInToday);

  const bookingCheckOutToday = bookings.filter(booking => booking.CheckOutDate.replaceAll("-", "/") === today&&booking.Label === "CheckedIn");
  console.log("dataCheckOutToDay",bookingCheckOutToday);

  return (
    <Container className="sheet padding-10mm">
      <h1>Checking In Today</h1>
      <Table striped bordered hover size="sm" responsive="md">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Room</th>
            <th>Check-Out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {bookingCheckInToday.map((booking, idx) => {
            return (
              <tr>
                <td>{booking.id}</td>
                <td>{booking.GuestFirstName} {booking.GuestLastName}</td>
                <td>{booking.RoomNumber}</td>
                <td>{booking.CheckOutDate}</td>
                <td>
                  <button className="btn btn-outline-secondary"
                    onClick={
                      checkInBooking
                    }
                    name={idx}
                  >
                    Check In
                    </button>
                </td>
              </tr>

            )
          })
          }
        </tbody>
      </Table>
      <h1>Checking Out Today</h1>
      <Table striped bordered hover size="sm" responsive="md">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Room</th>
            <th>Check-Out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          {bookingCheckOutToday.map((booking, idx) => {
            return (
              <tr>
                <td>{booking.id}</td>
                <td>{booking.GuestFirstName} {booking.GuestLastName}</td>
                <td>{booking.RoomNumber}</td>
                <td>{booking.CheckOutDate}</td>
                <td>
                  <button className="btn btn-outline-secondary"
                    onClick={
                      checkOutBooking
                    }
                    name={idx}
                  >
                    Check Out
                    </button>
                </td>
              </tr>

            )
          })
          }
        </tbody>
      </Table>


    </Container>
  );
};

export default Home;