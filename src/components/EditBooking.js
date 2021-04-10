import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { Redirect } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Col, Form, Button } from "react-bootstrap";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const [submitted, setSubmitted] = useState(false);
    const [bookingfName, setbookingfName] = useState("");
    const [bookinglName, setbookinglName] = useState("");
    const [status, setStatus] = useState("");
    const [statusId, setStatusId] = useState("");

    const getBooking = id => {
        BookingDataService.get(id)
            .then(response => {
                setValue("id", response.data[0].id, { shouldDirty: true });
                setValue("GuestLastName", response.data[0].GuestLastName, { shouldDirty: true });
                setValue("GuestFirstName", response.data[0].GuestFirstName, { shouldDirty: true });
                setValue("CheckInDate", response.data[0].CheckInDate, { shouldDirty: true });
                setValue("CheckOutDate", response.data[0].CheckOutDate, { shouldDirty: true });
                setValue("NumberOfAdults", response.data[0].NumberOfAdults, { shouldDirty: true });
                setValue("NumberOfChildren", response.data[0].NumberOfChildren, { shouldDirty: true });
                setValue("RoomNumber", response.data[0].RoomNumber, { shouldDirty: true });
                setValue("Price", response.data[0].Price, { shouldDirty: true });
                setValue("Label", response.data[0].Label, { shouldDirty: true });
                setbookinglName(response.data[0].GuestLastName);
                setbookingfName(response.data[0].GuestFirstName);
                setStatus(response.data[0].Label);
                console.log(response.data[0].GuestLastName);
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
        console.log(e.target.value);
        const statusButton = e.target.value;
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
        console.log("statusId",statusId);
        const data = {
            statusId: statusId
        }
        console.log("id", getValues("id"));
        statusId!=3?
        BookingDataService.update(getValues("id"), data)
            .then(response => {
                console.log("Update ok at statusId",statusId);
                props.history.push("/bookings");
                
                // successSaveNotify();
            })
            .catch(e => {
                // errorNotify();
                console.log(e);
            })
        :props.history.push("/checkout/"+getValues("id"));
    };

    return (
        <div className="sheet padding-10mm">
            {submitted ? (
                <Redirect to="/bookings" />
            ) : (
                <div>
                    <Form noValidate onSubmit={handleSubmit(updateStatus)}>
                        <Form.Row className="header-create">
                            <h1>Booking for {getValues("GuestFirstName")} {getValues("GuestLastName")}</h1>
                        </Form.Row>
                        <Form.Row>
                            <Col md="3">
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
                        <Form.Row>
                            <Col md="3">
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
                        <Form.Row>
                            <Col md="3">
                                <Form.Label>Check-In</Form.Label>
                            </Col>
                            <Form.Group as={Col} className="inputData" md="6">
                                <Form.Control
                                    as="input"
                                    type="date"
                                    name="CheckInDate"
                                    ref={register}
                                    readOnly
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Col md="3">
                                <Form.Label>Check-Out</Form.Label>
                            </Col>
                            <Form.Group as={Col} className="inputData" md="6">
                                <Form.Control
                                    as="input"
                                    type="date"
                                    name="CheckOutDate"
                                    ref={register}
                                    readOnly
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Col md="3">
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
                        <Form.Row>
                            <Col md="3">
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
                        <Form.Row>
                            <Col md="3">
                                <Form.Label>Room</Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>{getValues("RoomNumber")} at ฿ {getValues("Price")} per night.</Form.Label>
                            </Col>
                        </Form.Row>
                        <div>
                            {status === "Booked" ? (
                                <Form.Row>
                                    <Col md="3">
                                        <Button as="input" type="submit" value="Check In" onClick={checkTypeOnClickedButton} />{' '}
                                    </Col>
                                    <Col md="3">
                                        <Button as="input" type="submit" value="Cancel Booking" onClick={checkTypeOnClickedButton} />{' '}
                                    </Col>
                                </Form.Row>
                            )
                                : (<Form.Row>
                                    <Col md="3">
                                        <Button as="input" type="submit" value="Check Out" onClick={checkTypeOnClickedButton} />{' '}
                                    </Col>
                                </Form.Row>)}
                        </div>
                    </Form>
                </div>
            )}

        </div>
    );


};

export default EditBooking;