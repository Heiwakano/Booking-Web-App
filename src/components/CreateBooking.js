import React, { useState } from "react";
import BookingDataService from "../services/BookingDataService";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { Col, Form } from "react-bootstrap";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const AddBooking = (props) => {

  const {
    register,
    handleSubmit,
    // setValue,
    getValues,
    errors,
    formState: { touched }
  } = useForm({
    defaultValues: {
      NumberOfAdults: 1,
      NumberOfChildren: 0,
      GuestLastName: "",
      GuestFirstName: "",
    }
  });

  const initialRoomState = {
    id: undefined,
    RoomNumber: undefined,
    AdultsCapacity: undefined,
    ChildrenCapacity: undefined,
    Price: undefined,
  };

  const [room, setRoom] = useState(initialRoomState);
  const [submitted, setSubmitted] = useState(false);
  const [getAvaiClicked, setgetAvaiClicked] = useState(false);

  const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiButton: {
        // Name of the rule
        root: {
          // Some CSS
          margin: '0 3% 3% 0',
          //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          //   borderRadius: 3,
          //   border: 0,
          //   color: 'white',
          //   height: 48,
          //   padding: '0 30px',
          //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
      },
    },
  });

  //sweetalert
  const MySwal = withReactContent(Swal);

  const findCheapest = () => {
    const data = {
      CheckInDate: getValues("CheckInDate"),
      CheckOutDate: getValues("CheckOutDate"),
      NumberOfAdults: getValues("NumberOfAdults"),
      NumberOfChildren: getValues("NumberOfChildren")
    }
    BookingDataService.findCheapest(data)
      .then(response => {
        const cheapestRoom = response.data[0];
        setRoom({
          id: cheapestRoom.id,
          RoomNumber: cheapestRoom.RoomNumber,
          AdultsCapacity: cheapestRoom.AdultsCapacity,
          ChildrenCapacity: cheapestRoom.ChildrenCapacity,
          Price: cheapestRoom.Price,
        });
        console.log("The Cheapest room", cheapestRoom);
        setgetAvaiClicked(true);
      })
      .catch(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          // footer: '<a href>Why do I have this issue?</a>'
        });
        console.log(e);
      });

  };


  const saveBooking = () => {

    // setValidated(true);
    // event.preventDefault();
    // event.stopPropagation();

    var bookingData = {
      GuestLastName: getValues("GuestLastName"),
      GuestFirstName: getValues("GuestFirstName"),
      CheckInDate: getValues("CheckInDate"),
      CheckOutDate: getValues("CheckOutDate"),
      NumberOfAdults: getValues("NumberOfAdults"),
      NumberOfChildren: getValues("NumberOfChildren"),
      roomId: room.id,
      statusId: 1,// id:1 = Booked
    }

    BookingDataService.create(bookingData)
      .then(response => {
        Swal.fire(
          'Saved!',
          'Your booking has been created.',
          'success'
        ).then(() => setSubmitted(true));
        console.log("saved booking in data base");
        console.log(response.data);
      })
      .catch(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          // footer: '<a href>Why do I have this issue?</a>'
        });
        console.log(e);
      });

  };

  const cancelBooking = (e) => {
    console.log(e.target.value);
    props.history.push("/bookings");
  }

  return (
    <div className="sheet padding-10mm">
      {submitted ? (
        <Redirect to="/bookings" />
      ) : (
        <Form noValidate onSubmit={handleSubmit(findCheapest)}>
          <Form.Row className="header-create">
            <h1>New Booking</h1>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>Last Name</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="text"
                placeholder="Last name"
                name="GuestLastName"
                ref={
                  register({
                    required: true,
                    pattern: {
                      value: /^(?:[A-Za-z]+)$/
                    },
                  })
                }
              />
              {errors.GuestLastName?.type === "required" && (
                <p>Need last name.</p>
              )}
              {errors.GuestLastName?.type === "pattern" && (
                <p>Need text type[A-Z,a-z].</p>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>First Name</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                placeholder="First name"
                as="input"
                type="text"
                name="GuestFirstName"
                ref={
                  register({
                    required: true,
                    pattern: {
                      value: /^(?:[A-Za-z]+)$/
                    },
                  })
                }
              />
              {errors.GuestFirstName?.type === "required" && (
                <p>Need first name.</p>
              )}
              {errors.GuestFirstName?.type === "pattern" && (
                <p>Need text type[A-Z,a-z].</p>
              )}

            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>Check-In Date</Form.Label>
            </Col>
            <Form.Group as={Col} className="inputData" md="6">
              <Form.Control
                as="input"
                type="date"
                name="CheckInDate"
                ref={register({
                  required: true
                })
                }
              />
              {errors.CheckInDate?.type === "required" && (
                <p>Need Check In.!</p>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>Check-Out Date</Form.Label>
            </Col>
            <Col className="inputData" md="6">
              <Form.Control
                as="input"
                type="date"
                name="CheckOutDate"

                ref={register({
                  required: true,
                  validate: {
                    moreThanCheckIn: (value) => {
                      const { CheckInDate } = getValues();
                      return value > CheckInDate;
                    },
                  }
                })}
              />
              {errors.CheckOutDate?.type === "moreThanCheckIn" && (
                <p>Check Out must more than Check In.</p>
              )}
              {errors.CheckOutDate?.type === "required" && (
                <p>Need Check Out.!</p>
              )}
            </Col>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>Children</Form.Label>
            </Col>
            <Col className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                name="NumberOfChildren"
                min="0"
                ref={register({
                  validate: {
                    positive: (value) => value >= 0,
                  }
                })}

              />
              {errors.NumberOfChildren?.type === "positive" && (
                <p>Need number or 0</p>
              )}
            </Col>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>Adults</Form.Label>
            </Col>
            <Col className="inputData" md="6">
              <Form.Control
                as="input"
                type="number"
                name="NumberOfAdults"
                min="1"
                ref={register({
                  validate: {
                    positive: (value) => value > 0,
                  }
                })}

              />
              {errors.NumberOfAdults?.type === "positive" && (
                <p>Need number or 0</p>
              )}

            </Col>
          </Form.Row>
          <Form.Row>
            <Col md="3">
              <Form.Label>Room</Form.Label>
            </Col>
            <Col>
              <Form.Label>{getAvaiClicked ? room.RoomNumber + " at ฿" + room.Price + " per night." : null}</Form.Label>
            </Col>

          </Form.Row>
          <Form.Row>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                type="submit"
                size="large"
                name="getAvailableBut" 
                style={{ background: '#33FF8C', color: 'white' }} >
                Get Available Room
            </Button>
            </ThemeProvider>
            {getAvaiClicked ? (
              <ThemeProvider theme={theme}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={saveBooking}
                  name="bookroom" color="secondary" >
                  Book Room
              </Button>
              </ThemeProvider>
            )
              : (<div></div>)}
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                size="large"
                onClick={cancelBooking}
                name="back" color="default" >
                Back
                  </Button>
            </ThemeProvider>
          </Form.Row>
        </Form>
      )}
    </div>
  );
};

export default AddBooking;