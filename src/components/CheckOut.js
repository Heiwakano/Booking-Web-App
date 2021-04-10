import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { Col, Row, Button, Container } from "react-bootstrap";

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
        RoomNumber: "000",
        id: 22,
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
    const [dOfCheckOut,mOfCheckOut,yOfCheckOut] = [booking.CheckOutDate.slice(0,4),booking.CheckOutDate.slice(5,7),booking.CheckOutDate.slice(8,10)];
    
    const [dOfCheckIn,mOfCheckIn,yOfCheckIn] = [booking.CheckInDate.slice(0,4),booking.CheckInDate.slice(5,7),booking.CheckInDate.slice(8,10)];

    // const calNightsOfBooking = () => {
    //     return yOfCheckOut===yOfCheckIn?mOfCheckOut===mOfCheckIn?parseInt(dOfCheckOut)-parseInt(dOfCheckIn): 
        
    // }
    
    useEffect(() => {
        console.log("UseEffect active checkout");
        console.log(props.match.params.bookingId);
        getBooking(props.match.params.bookingId);

    }, [props.match.params.id]);

    const BookingDetail = props => {
        return (
            <Row>
                <Col md="3">
                    {props.name}
                </Col>
                <Col>
                    {props.value}
                </Col>
            </Row>
        )
    };

    const updateStatus = () => {
        BookingDataService.update(booking.id, {statusId: 3})
            .then(response => {
                props.history.push("/bookings");
                // successSaveNotify();
            })
            .catch(e => {
                // errorNotify();
                console.log(e);
            })
    };

    return (
        <Container>
            <Row>
                <h1>Check Out {booking.GuestFirstName} {booking.GuestLastName}</h1>
            </Row>
            <BookingDetail name="Room" value={booking.RoomNumber} />
            <BookingDetail name="Check-In" value={booking.CheckInDate} />
            <BookingDetail name="Check-Out" value={booking.CheckOutDate} />
            <BookingDetail name="Nights" value={
                parseInt(booking.CheckOutDate[8] + booking.CheckOutDate[9])
                - parseInt(booking.CheckInDate[8] + booking.CheckInDate[9])
            } />
            <BookingDetail name="Adults" value={booking.NumberOfAdults} />
            <BookingDetail name="Children" value={booking.NumberOfChildren} />
            <BookingDetail name="Room Price" value={
                "฿" + booking.Price.toString() + " per night"
            } />
            <BookingDetail name="Total" value={
                "฿" + (booking.Price * (parseInt(booking.CheckOutDate[8] + booking.CheckOutDate[9])
                    - parseInt(booking.CheckInDate[8] + booking.CheckInDate[9]))).toString()
            } />
            <Row>
                <Col md="3">
                    <Button as="input" type="button" value="Confirm Check-Out" onClick={updateStatus} />{' '}
                </Col>
                <Col md="3">
                    <Button as="input" type="button" value="Cancel" onClick={() => props.history.push("/bookings/" + booking.id)} />{' '}
                </Col>
            </Row>




        </Container>
    )
};
export default CheckOut;