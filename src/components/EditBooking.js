import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { useForm } from "react-hook-form";
import { Col, Form } from "react-bootstrap";

import { useSelector } from "react-redux";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import CheckOut from "./CheckOutv1";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const EditBooking = props => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        errors,
        formState: { touched }
    } = useForm({
        defaultValues: {
            id: undefined,
            GuestLastName: undefined,
            GuestFirstName: undefined,
            CheckInDate: undefined,
            CheckOutDate: undefined,
            NumberOfAdults: undefined,
            NumberOfChildren: undefined,
            RoomNumber: undefined,
            Price: undefined,
            Label: undefined,
        }
    });

    const [status, setStatus] = useState("");
    const [statusId, setStatusId] = useState("");

    const { user: currentUser } = useSelector((state) => state.auth);

    const [modalShow, setModalShow] = useState(false);

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

    const getBooking = id => {
        BookingDataService.get(id)
            .then(response => {
                const booking = response.data[0];
                var CheckInDate = booking.CheckInDate;
                var CheckOutDate = booking.CheckOutDate;

                CheckInDate = String(new Date(CheckInDate).getDate()).padStart(2, '0') + "/" +
                    String(new Date(CheckInDate).getMonth() + 1).padStart(2, '0') + "/" +
                    String(new Date(CheckInDate).getFullYear());

                CheckOutDate = String(new Date(CheckOutDate).getDate()).padStart(2, '0') + "/" +
                    String(new Date(CheckOutDate).getMonth() + 1).padStart(2, '0') + "/" +
                    String(new Date(CheckOutDate).getFullYear());

                setValue("id", booking.id, { shouldDirty: true });
                setValue("GuestLastName", booking.GuestLastName, { shouldDirty: true });
                setValue("GuestFirstName", booking.GuestFirstName, { shouldDirty: true });
                setValue("CheckInDate", CheckInDate, { shouldDirty: true });
                setValue("CheckOutDate", CheckOutDate, { shouldDirty: true });
                setValue("NumberOfAdults", booking.NumberOfAdults, { shouldDirty: true });
                setValue("NumberOfChildren", booking.NumberOfChildren, { shouldDirty: true });
                setValue("RoomNumber", booking.RoomNumber, { shouldDirty: true });
                setValue("Price", booking.Price, { shouldDirty: true });
                setValue("Label", booking.Label, { shouldDirty: true });
                setStatus(booking.Label);

            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        console.log("UseEffect active");
        console.log(props.match.params.bookingId);
        getBooking(props.match.params.bookingId);

    }, [props.match.params.id]);

    const checkTypeOnClickedButton = (e) => {
        console.log(e.currentTarget.name);
        const statusButton = e.currentTarget.name;
        console.log(statusButton === "Check In");
        switch (statusButton) {
            case "Check In":
                setStatusId(2);
                break;
            case "Check Out":
                setStatusId(3);
                break;
            case "Cancel Booking":
                setStatusId(4);
                break;
            default:
                console.log(statusButton);
        }
    };

    const updateStatus = () => {
        console.log("statusId", statusId);
        const data = {
            statusId: statusId
        }
        console.log("id", getValues("id"));
        statusId != 3 ?
            BookingDataService.update(getValues("id"), data)
                .then(() => {
                    console.log("Update ok at statusId", statusId);
                    if (statusId === 2) {
                        Swal.fire(
                            'Saved!',
                            'Your booking has been checked in.',
                            'success'
                        )
                            .then(() => props.history.push("/bookings"));
                    } else {
                        Swal.fire(
                            'Saved!',
                            'Your booking has been canceled.',
                            'success'
                        )
                            .then(() => props.history.push("/bookings"));
                    }
                })
                .catch(e => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        // footer: '<a href>Why do I have this issue?</a>'
                      })
                    console.log(e);
                })

            : setModalShow(true);
        // : props.history.push("/checkout/" + getValues("id"));
    };

    const deleteBooking = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "you want to permanently delete this Booking?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {

                const id = props.match.params.bookingId;

                BookingDataService.remove(id)
                    .then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Your booking has been deleted.',
                            'success'
                        )
                            .then(() => props.history.push("/bookings"))

                    })
                    .catch((e) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            // footer: '<a href>Why do I have this issue?</a>'
                          })
                        console.log(e);
                    });

            }
        })
    }

    return (
        <div className="sheet padding-10mm">
            <div>
                <Form noValidate onSubmit={handleSubmit(updateStatus)}>
                    <Form.Row className="header-create">
                        <h1>Booking for {getValues("GuestFirstName")} {getValues("GuestLastName")}</h1>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>Last Name</Form.Label>
                        </Col>
                        <Form.Group as={Col} className="inputData" md="6">
                            <Form.Control
                                as="input"
                                type="text"
                                name="id"
                                ref={register}
                                className="hidden-input"
                            />
                            <Form.Control
                                as="input"
                                type="text"
                                name="RoomNumber"
                                ref={register}
                                className="hidden-input"
                            />
                            <Form.Control
                                as="input"
                                type="text"
                                name="Price"
                                ref={register}
                                className="hidden-input"
                            />
                            <Form.Control
                                as="input"
                                type="text"
                                name="Label"
                                ref={register}
                                className="hidden-input"
                            />
                            <Form.Control
                                as="input"
                                type="text"
                                name="GuestLastName"
                                ref={register}
                                readOnly
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>First Name</Form.Label>
                        </Col>
                        <Form.Group as={Col} className="inputData" md="6">
                            <Form.Control
                                as="input"
                                type="text"
                                name="GuestFirstName"
                                ref={register}
                                readOnly
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>Check-In</Form.Label>
                        </Col>
                        <Form.Group as={Col} className="inputData" md="6">
                            <Form.Control
                                as="input"
                                type="text"
                                name="CheckInDate"
                                ref={register}
                                readOnly
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>Check-Out</Form.Label>
                        </Col>
                        <Form.Group as={Col} className="inputData" md="6">
                            <Form.Control
                                as="input"
                                type="text"
                                name="CheckOutDate"
                                ref={register}
                                readOnly
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>Children</Form.Label>
                        </Col>
                        <Form.Group as={Col} className="inputData" md="6">
                            <Form.Control
                                as="input"
                                type="number"
                                name="NumberOfChildren"
                                ref={register}
                                readOnly
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>Adults</Form.Label>
                        </Col>
                        <Form.Group as={Col} className="inputData" md="6">
                            <Form.Control
                                as="input"
                                type="number"
                                name="NumberOfAdults"
                                ref={register}
                                readOnly
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="Row_Fix_Height">
                        <Col md="2">
                            <Form.Label>Room</Form.Label>
                        </Col>
                        <Col style={{ textAlign: "left", margin: "auto 0"}}>
                            <Form.Label>{getValues("RoomNumber")} at ฿ {getValues("Price")} per night.</Form.Label>
                        </Col>
                    </Form.Row>
                    <Form.Row style={{ textAlign: "left", marginLeft: "6%"}}>
                        {status === "Booked" ? currentUser ?
                            (
                                <Col>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="contained" type="submit" size="large" onClick={checkTypeOnClickedButton} name="Check In" color="primary" >Check In</Button>
                                    </ThemeProvider>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="contained" type="submit" size="large" onClick={checkTypeOnClickedButton} name="Cancel Booking" style={{ background: '#f9e154', color: 'black' }} >Cancel Booking</Button>
                                    </ThemeProvider>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="contained" size="large" onClick={() => props.history.push("/bookings")} name="Back" color="default" >Back</Button>
                                    </ThemeProvider>
                                </Col>

                            )
                            : (<Form.Row></Form.Row>)
                            : status === "CheckedIn" ? (
                                <Col>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="contained" type="submit" size="large" onClick={checkTypeOnClickedButton} name="Check Out" color="secondary" style={{ display: !currentUser ? "none" : null }}>Check Out</Button>
                                    </ThemeProvider>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="contained" size="large" onClick={() => props.history.push("/bookings")} name="Back" color="default" >Back</Button>
                                    </ThemeProvider>
                                </Col>
                            ) : (<Col></Col>)}
                    </Form.Row>
                    <Form.Row style={{ textAlign: "left", marginLeft: "6%"}}>
                        <Col>
                            {currentUser ?
                                <ThemeProvider theme={theme}>
                                    <Button variant="contained" size="large" onClick={deleteBooking} name="Delete" color="secondary" >Delete</Button>
                                </ThemeProvider>
                                : <div></div>}

                        </Col>

                    </Form.Row>
                </Form>
            </div>

            <CheckOut
                show={modalShow}
                onHide={() => setModalShow(false)}
                id={getValues("id")}
                history={props.history}
                name="editbooking"
            />
        </div>
    );


};

export default EditBooking;