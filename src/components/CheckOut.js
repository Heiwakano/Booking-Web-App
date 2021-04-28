import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { Col, Row, Button, Container, Form } from "react-bootstrap";

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
        console.log(props.match.params.bookingId);
        getBooking(props.match.params.bookingId);

    }, [props.match.params.id]);

    const BookingDetail = props => {
        return (
            <Form.Row>
                <Col md="3">
                    <Form.Label>{props.name}</Form.Label>
                </Col>
                {props.name==="Room Price"||props.name==="Total"?(
                    <Col md="6">
                        <Form.Label>{props.value}</Form.Label>
                    </Col>
                    
                ):(
                    <Form.Group as={Col} className="inputData" md="6">
                    <Form.Control
                        as="input"
                        type="text"
                        name={props.name}
                        readOnly
                        value={props.value}
                    />
                </Form.Group>
                )}
               
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
                    .then(() => props.history.push("/bookings"))
            })
            .catch(e => {
                
                console.log(e);
            })
    };

    var checkIn = new Date(booking.CheckInDate);
    const timeCheckIn = checkIn.getTime();
    var dd = String(checkIn.getDate()).padStart(2, '0');
    var mm = String(checkIn.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = checkIn.getFullYear();

    checkIn = dd + '/' + mm + '/' + yyyy;

    var checkOut = new Date(booking.CheckOutDate);
    const timeCheckOut = checkOut.getTime();
    dd = String(checkOut.getDate()).padStart(2, '0');
    mm = String(checkOut.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = checkOut.getFullYear();

    checkOut = dd + '/' + mm + '/' + yyyy;

    const night = Math.floor((timeCheckOut - timeCheckIn) / (1000 * 60 * 60 * 24));

    return (
        <Container className="sheet padding-10mm">
            <Form>
                <Form.Row className="header-create">
                    <h1>Check Out {booking.GuestFirstName} {booking.GuestLastName}</h1>
                </Form.Row>
                <BookingDetail name="Room" value={booking.RoomNumber} />
                <BookingDetail name="Check-In" value={checkIn} />
                <BookingDetail name="Check-Out" value={checkOut} />
                <BookingDetail name="Nights" value={night} />
                <BookingDetail name="Adults" value={booking.NumberOfAdults} />
                <BookingDetail name="Children" value={booking.NumberOfChildren} />
                <BookingDetail name="Room Price" value={
                    "฿" + booking.Price.toString() + " per night"
                } />
                <BookingDetail name="Total" value={
                    "฿" + (booking.Price * night)} />
                <Row>
                    <Col md="3">
                        <Button as="input" type="button" value="Confirm Check-Out" onClick={updateStatus} />{' '}
                    </Col>
                    <Col md="3">
                        <Button as="input" type="button" value="Back" onClick={() => props.history.push("/bookings/" + booking.id)} />{' '}
                    </Col>
                </Row>

            </Form>





        </Container>
    )
};
export default CheckOut;