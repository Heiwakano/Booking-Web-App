import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { Col, Row, Button, Container, Form, Modal } from "react-bootstrap";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';



const CheckOut = props => {

    const [booking, setBooking] = useState({
        CheckInDate: "",
        CheckOutDate: "",
        GuestFirstName: "",
        GuestLastName: "",
        Label: "",
        NumberOfAdults: 0,
        NumberOfChildren: 0,
        Price: 0,
        RoomNumber: "",
        id: undefined,
    });


    const getBooking = id => {
        BookingDataService.get(id)
            .then(response => {
                const data = response.data[0];
                setBooking(data);
                console.log(data);

            })
            .catch(e => {
                console.log(e);
            });
    };


    useEffect(() => {
        console.log("UseEffect active checkout");
        console.log(props.id);
        getBooking(props.id)

    }, [props.id]);

    const BookingDetail = props => {
        return (
            <Form.Row>
                <Col md="3">
                    <Form.Label>{props.name}</Form.Label>
                </Col>
                <Col md="6">
                    <Form.Label>{props.value}</Form.Label>
                </Col>
            </Form.Row>
        )
    };

    const updateStatus = () => {
        BookingDataService.update(booking.id, { statusId: 3 })
            .then(() => {
                Swal.fire(
                    'Saved!',
                    'Your booking has been checked out.',
                    'success'
                )
                    .then(() => {
                        if (props.name==="home") {
                            props.finishAlert();
                            props.history.push("/");
                            props.onClose(false);
                        } else {
                            props.history.push("/bookings")
                        }
                    })
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
    };

    const today = new Date();
    const todayTime = today.getTime();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const CheckInDate = new Date(booking.CheckInDate);
    var dd = String(CheckInDate.getDate()).padStart(2, '0');
    const timeCheckIn = CheckInDate.getTime();
    const isCheckInMorethanToday = Math.floor((CheckInDate.getTime() - todayTime) / (1000 * 60 * 60 * 24)) >= 0;
    const checkIn = isCheckInMorethanToday ?
        dd + " " + monthNames[CheckInDate.getMonth()] + " " + " (in " + (Math.floor((CheckInDate.getTime() - todayTime) / (1000 * 60 * 60 * 24))).toString() + " days)"
        : !isCheckInMorethanToday ?
            dd + " " + monthNames[CheckInDate.getMonth()] + " " + " ( " + (Math.floor((todayTime - CheckInDate.getTime()) / (1000 * 60 * 60 * 24))).toString() + " days ago)"
            : dd + " " + monthNames[CheckInDate.getMonth()];


    const CheckOutDate = new Date(booking.CheckOutDate);
    dd = String(CheckOutDate.getDate()).padStart(2, '0');
    const timeCheckOut = CheckOutDate.getTime();
    const isCheckOutMorethanToday = Math.floor((CheckOutDate.getTime() - todayTime) / (1000 * 60 * 60 * 24)) >= 0;
    var checkOut = isCheckOutMorethanToday ?
        "" + dd + " " +
        monthNames[CheckOutDate.getMonth()] + " (in " + (Math.floor((CheckOutDate.getTime() - todayTime) / (1000 * 60 * 60 * 24))).toString() + " days)"
        : !isCheckOutMorethanToday ?
            "" + dd + " " +
            monthNames[CheckOutDate.getMonth()] + " (" + (Math.floor((todayTime - CheckOutDate.getTime()) / (1000 * 60 * 60 * 24))).toString() + " days ago)"
            : dd + " " + monthNames[CheckInDate.getMonth()];

    const night = Math.floor((timeCheckOut - timeCheckIn) / (1000 * 60 * 60 * 24));

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Check Out Room {booking.RoomNumber}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form>
                        <BookingDetail name="Room" value={booking.RoomNumber} />
                        <BookingDetail name="Check-In Date" value={checkIn} />
                        <BookingDetail name="Check-Out Date" value={checkOut} />
                        <BookingDetail name="Nights" value={night} />
                        <BookingDetail name="Number of Adults" value={booking.NumberOfAdults} />
                        <BookingDetail name="Number of Children" value={booking.NumberOfChildren} />
                        <BookingDetail name="Room Price" value={
                            "฿" + booking.Price.toFixed(2) + " per night"
                        } />
                        <BookingDetail name="Total" value={
                            "฿" + (booking.Price * night).toFixed(2)} />


                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Row className="button-left">
                    <Col>
                        <Button as="input" type="button" value="Confirm Check-Out" onClick={updateStatus} variant="success"/>{' '}
                    </Col>
                    <Col>
                        <Button onClick={props.onHide} variant="secondary">Close</Button>
                    </Col>
                </Row>

            </Modal.Footer>
        </Modal>
    )
};
export default CheckOut;