import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { Col, Form, Button } from "react-bootstrap";

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
      GuestLastName: "Last name",
      GuestFirstName: "First name",
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
      CheckInDate: new Date(getValues("CheckInDate")),
      CheckOutDate: new Date(getValues("CheckOutDate")),
      NumberOfAdults: getValues("NumberOfAdults"),
      NumberOfChildren: getValues("NumberOfChildren"),
      roomId: room.id,
      statusId: 1,// id:1 = Booked
    }

    BookingDataService.create(bookingData)
      .then(response => {
        setSubmitted(true);
        console.log("saved booking in data base");
        console.log(response.data);
      })
      .catch(e => {
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
                      value: /[A-Za-z]/
                    }
                  })
                }
                isValid={!errors.GuestLastName && touched.GuestLastName}
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
                      value: /[A-Za-z]/
                    }
                  })
                }
                isValid={!errors.GuestFirstName && touched.GuestFirstName}
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
                isValid={!errors.CheckInDate && touched.CheckInDate}
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

                isValid={!errors.CheckOutDate && touched.CheckOutDate}
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
                isValid={!errors.NumberOfChildren && touched.NumberOfChildren}
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
                isValid={!errors.NumberOfAdults && touched.NumberOfAdults}
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
            <Col md="6">
              <Button as="input"
                name="getAvailableBut"
                type="Submit"
                value="Get Available Room"
                className="btn-lg btn-block"
              />{' '}
            </Col>

            {getAvaiClicked ? (
              <Col>
                <Button as="input" type="button" value="Book Room" onClick={saveBooking} className="btn-lg btn-block" />{' '}
              </Col>)
              : (<div></div>)}
              {getAvaiClicked ? (
              <Form.Row>
                <Col md="12">
                  <Button as="input"
                    type="button"
                    value="Cancel"
                    className="btn-lg btn-block"
                    onClick={cancelBooking}
                  />{' '}
                </Col>
              </Form.Row>
            ) :
              (
                <Col md="6">
                  <Button as="input"
                    type="button"
                    value="Cancel"
                    className="btn-lg btn-block"
                    onClick={cancelBooking}
                  />{' '}
                </Col>
              )}

          </Form.Row>
        </Form>
      )}
    </div>
  );
};

export default AddBooking;