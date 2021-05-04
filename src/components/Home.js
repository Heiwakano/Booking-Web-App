import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";
import { Redirect } from 'react-router-dom';
import { Image, Container, Row, Col, } from "react-bootstrap";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import InputIcon from '@material-ui/icons/Input';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import IconButton from '@material-ui/core/IconButton';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";

import CheckOut from "./CheckOutv1";

const Home = (props) => {

  const { user: currentUser } = useSelector((state) => state.auth);

  const [bookings, setBookings] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [idToCheckOut, setIdToCheckOut] = useState(undefined);
  const [bookingCheckInToday, setBookingCheckInToday] = useState([]);
  const [bookingCheckOutToday, setBookingCheckOutToday] = useState([]);

  const [order1, setOrder1] = useState('asc');
  const [order2, setOrder2] = useState('asc');
  const [orderBy1, setOrderBy1] = useState('CheckOutDate');
  const [orderBy2, setOrderBy2] = useState('CheckInDate');
  const [page1, setPage1] = useState(0);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }));

  const TablePaginationActions = (props) => {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  const columns1 = [
    { id: 'name', label: 'Name', minWidth: 170, numeric: false },
    {
      id: 'RoomNumber',
      label: 'Room',
      minWidth: 170,
      numeric: false,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 170,
      numeric: false,
    },
  ];

  const columns2 = [
    { id: 'name', label: 'Name', minWidth: 170, numeric: false },
    {
      id: 'RoomNumber',
      label: 'Room',
      minWidth: 170,
      numeric: false,
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 170,
      numeric: false,
    },
  ];

  const rows1 = bookingCheckInToday;
  const rows2 = bookingCheckOutToday;

  function descendingComparator(a, b, orderBy1) {
    if (b[orderBy1] < a[orderBy1]) {
      return -1;
    }
    if (b[orderBy1] > a[orderBy1]) {
      return 1;
    }
    return 0;
  }

  function getComparator2(order1, orderBy1) {
    return order1 === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy1)
      : (a, b) => -descendingComparator(a, b, orderBy1);
  }

  function getComparator1(order2, orderBy2) {
    return order1 === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy2)
      : (a, b) => -descendingComparator(a, b, orderBy2);
  }

  function stableSort1(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order1 = comparator(a[0], b[0]);
      if (order1 !== 0) return order1;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function stableSort2(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order2 = comparator(a[0], b[0]);
      if (order2 !== 0) return order2;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function EnhancedTableHead1(props) {
    const { classes, order1, orderBy1, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow >
          {columns1.map((headCell) => (
            currentUser ? (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                sortDirection={orderBy1 === headCell.id ? order1 : false}
              >
                <TableSortLabel
                  hideSortIcon={headCell.id === "actions"}
                  active={orderBy1 === headCell.id}
                  direction={orderBy1 === headCell.id ? order1 : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy1 === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order1 === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ) : (
              headCell.id !== 'actions' &&
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                sortDirection={orderBy1 === headCell.id ? order1 : false}
              >
                <TableSortLabel
                  hideSortIcon={headCell.id === "actions"}
                  active={orderBy1 === headCell.id}
                  direction={orderBy1 === headCell.id ? order1 : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy1 === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order1 === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            )

          ))}
        </TableRow>
      </TableHead>
    );
  }

  function EnhancedTableHead2(props) {
    const { classes, order2, orderBy2, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow >
          {columns2.map((headCell) => (
            currentUser ? (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                sortDirection={orderBy2 === headCell.id ? order2 : false}
              >
                <TableSortLabel
                  hideSortIcon={headCell.id === "actions"}
                  active={orderBy2 === headCell.id}
                  direction={orderBy2 === headCell.id ? order2 : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy2 === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order2 === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ) : (
              headCell.id !== 'actions' &&
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                sortDirection={orderBy2 === headCell.id ? order2 : false}
              >
                <TableSortLabel
                  hideSortIcon={headCell.id === "actions"}
                  active={orderBy2 === headCell.id}
                  direction={orderBy2 === headCell.id ? order2 : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy2 === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order2 === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            )

          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead1.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  EnhancedTableHead2.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: '1 1 100%',
    },
  }));

  const useStyles = makeStyles((theme) => ({
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 200,
      maxWidth: 490,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    root: {
      minWidth: 340,
      marginLeft: "16px",
      marginRight: "16px",
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    margin: {
      margin: theme.spacing(1),
    },
    paddingCell: {
      padding: '0 0 0 14px',
      border: 'none'
    },
    fixCell: {
      padding: '5px 0px 5px 14px'
    }
  }));

  const handleRequestSort1 = (event, property) => {
    const isAsc = orderBy1 === property && order1 === 'asc';
    property !== "actions" && setOrder1(isAsc ? 'desc' : 'asc');
    property !== "actions" && setOrderBy1(property);
  };

  const handleRequestSort2 = (event, property) => {
    const isAsc = orderBy2 === property && order2 === 'asc';
    property !== "actions" && setOrder2(isAsc ? 'desc' : 'asc');
    property !== "actions" && setOrderBy2(property);
  };


  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage1(0);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const emptyRows1 = rowsPerPage - Math.min(rowsPerPage, rows1.length - page1 * rowsPerPage);
  const emptyRows2 = rowsPerPage - Math.min(rowsPerPage, rows2.length - page2 * rowsPerPage);

  const EnhancedTableToolbar1 = () => {
    const classes = useToolbarStyles();

    return (
      <Toolbar
        className={clsx(classes.root)}
      >

        <Typography className={classes.title} variant="h6" id="tableTitle" component="div" style={{textAlign: "left"}}>
          <InputIcon /> Checking In Today
          </Typography>

      </Toolbar>
    );
  };

  const EnhancedTableToolbar2 = () => {
    const classes = useToolbarStyles();

    return (
      <Toolbar
        className={clsx(classes.root)}
      >

        <Typography className={classes.title} variant="h6" id="tableTitle" component="div" style={{textAlign: "left"}}>
          <InputIcon /> Checking Out Today
          </Typography>

      </Toolbar>
    );
  };

  const classes = useStyles();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  const todayTime = today.getTime();
  today = dd + '/' + mm + '/' + yyyy;

  useEffect(() => {
    retrieveBookings();
  }, []);

  const retrieveBookings = () => {
    BookingDataService.getAll()
      .then((response) => {
        const bookings = response.data;
        const bookingsWithName = [];
        bookings.map((booking) => {
          return bookingsWithName.push({ ...booking, name: booking.GuestFirstName + " " + booking.GuestLastName });
        })
        console.log(bookingsWithName);
        setBookings(bookingsWithName);
        const bookingCheckInToday = bookingsWithName.filter(booking =>
          String(new Date(booking.CheckInDate).getDate()).padStart(2, '0') + "/" +
          String(new Date(booking.CheckInDate).getMonth() + 1).padStart(2, '0') + "/" +
          String(new Date(booking.CheckInDate).getFullYear())
          === today && booking.Label === "Booked"
        );

        console.log("dataCheckingToDay", bookingCheckInToday);
        setBookingCheckInToday(bookingCheckInToday);

        const bookingCheckOutToday = bookingsWithName.filter(booking =>
          String(new Date(booking.CheckOutDate).getDate()).padStart(2, '0') + "/" +
          String(new Date(booking.CheckOutDate).getMonth() + 1).padStart(2, '0') + "/" +
          String(new Date(booking.CheckOutDate).getFullYear())
          === today && booking.Label === "CheckedIn"
        );
        console.log("dataCheckOutToDay", bookingCheckOutToday);
        setBookingCheckOutToday(bookingCheckOutToday);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkInBooking = (e) => {
    const id = e.currentTarget.name;
    BookingDataService.update(id, { statusId: 2 })
      .then(() => {
        console.log("Update Check In at bookingId", id);
        successCheckInNotify(id);

      })
      .catch(e => {
        errorNotify(id);
        console.log(e);
      });
  };

  const successCheckInNotify = (id) => {
    const bookingCheckedIn = bookingCheckInToday.find((booking) => {
      return booking.id.toString() === id
    });
    return toast.success(bookingCheckedIn.name + " checked in room " + bookingCheckedIn.RoomNumber, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => {
        refreshList();
        <Redirect to="/" />
      }
    });
  }

  const errorNotify = (id) => {
    const bookingCheckedIn = bookingCheckInToday.find((booking) => {
      return booking.id.toString() === id
    });
    return toast.error('Error occurs while checking in ' + bookingCheckedIn.name + " room " + bookingCheckedIn.RoomNumber, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const checkOutBooking = (e) => {
    const idx = e.currentTarget.name;
    setIdToCheckOut(bookingCheckOutToday[idx].id);
    setModalShow(true)
  }

  const refreshList = () => {
    retrieveBookings();
  };



  return (
    <Container className="sheet padding-0mm" style={{ "textAlign": "center" }}>
      <Row>
        <Image src="hotel_room.jpg" fluid style={{ width: "100%" }}/>
      </Row>
      <Row>
        <Col xk={6} style={{ "margin": "3% auto" }}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography variant="body2" component="p">
           
                  <EnhancedTableToolbar1 />
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size='medium'
                      aria-label="enhanced table"
                    >
                      <EnhancedTableHead1
                        classes={classes}
                        order={order1}
                        orderBy={orderBy1}
                        onRequestSort={handleRequestSort1}
                      />
                      <TableBody>
                        {stableSort1(rows1, getComparator1(order1, orderBy1))
                          .slice(page1 * rowsPerPage, page1 * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell component="th" id={labelId} scope="row" align="left" className={classes.fixCell}>
                                  <TableRow>
                                    <TableCell align="left" padding="none" className={classes.paddingCell}>
                                      <b>{row.GuestFirstName}</b> {row.GuestLastName}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell align="left" padding="none" className={classes.paddingCell}>
                                      <Typography className={classes.pos} color="textSecondary">
                                        Leaving {new Date(row.CheckOutDate).getDate()} {monthNames[new Date(row.CheckOutDate).getMonth()]}
                                        {Math.floor((new Date(row.CheckOutDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) > 0 ?
                                          " (in " + (Math.floor((new Date(row.CheckOutDate).getTime() - todayTime) / (1000 * 60 * 60 * 24))).toString() + " days)"
                                          :
                                          Math.floor((new Date(row.CheckOutDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) < 0 ?
                                            " (" + (Math.floor((todayTime - new Date(row.CheckOutDate).getTime()) / (1000 * 60 * 60 * 24))).toString() + " days ago)"
                                            :
                                            ""
                                        }
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableCell>
                                <TableCell align="left">{row.RoomNumber}</TableCell>
                                {currentUser && <TableCell align="left">
                                  <Button variant="contained" size="small" onClick={checkInBooking} name={row.id} color="primary" className={classes.margin}>Check In</Button>
                                </TableCell>}
                              </TableRow>
                            );
                          })}
                        {emptyRows1 > 0 && (
                          <TableRow style={{ height: 53 * emptyRows1 }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[4]}
                    component="div"
                    count={rows1.length}
                    rowsPerPage={rowsPerPage}
                    page={page1}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage1}
                    onChangeRowsPerPage={handleChangeRowsPerPage1}
                    ActionsComponent={TablePaginationActions}
                  />
              
              </Typography>
            </CardContent>

          </Card>
        </Col>
        <Col xk={6} style={{ "margin": "3% auto" }}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography variant="body2" component="p">
               
                  <EnhancedTableToolbar2 />
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size='medium'
                      aria-label="enhanced table"
                    >
                      <EnhancedTableHead2
                        classes={classes}
                        order={order2}
                        orderBy={orderBy2}
                        onRequestSort={handleRequestSort2}
                      />
                      <TableBody>
                        {stableSort2(rows2, getComparator2(order2, orderBy2))
                          .slice(page2 * rowsPerPage, page2 * rowsPerPage + rowsPerPage)
                          .map((row, index) => {

                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                              <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell component="th" id={labelId} scope="row" align="left" className={classes.fixCell}>
                                  <TableRow>
                                    <TableCell align="left" padding="none" className={classes.paddingCell}>
                                      <b>{row.GuestFirstName}</b> {row.GuestLastName}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell align="left" padding="none" className={classes.paddingCell}>
                                      <Typography className={classes.pos} color="textSecondary">

                                        Arrived {new Date(row.CheckInDate).getDate()} {monthNames[new Date(row.CheckInDate).getMonth()]}
                                        {Math.floor((new Date(row.CheckInDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) > 0 ?
                                          " (in " + (Math.floor((new Date(row.CheckInDate).getTime() - todayTime) / (1000 * 60 * 60 * 24))).toString() + " days)"
                                          :
                                          Math.floor((new Date(row.CheckInDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) < 0 ?
                                            " (" + (Math.floor((todayTime - new Date(row.CheckInDate).getTime()) / (1000 * 60 * 60 * 24))).toString() + " days ago)"
                                            :
                                            ""
                                        }
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableCell>
                                <TableCell align="left">{row.RoomNumber}</TableCell>
                                {currentUser && <TableCell align="left">
                                  <Button variant="contained" size="small" onClick={checkOutBooking} name={index} color="secondary" className={classes.margin}>Check Out</Button>
                                </TableCell>}
                              </TableRow>
                            );
                          })}
                        {emptyRows2 > 0 && (
                          <TableRow style={{ height: 53 * emptyRows2 }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[4]}
                    component="div"
                    count={rows2.length}
                    rowsPerPage={rowsPerPage}
                    page={page2}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage2}
                    onChangeRowsPerPage={handleChangeRowsPerPage2}
                    ActionsComponent={TablePaginationActions}
                  />
              
              </Typography>
            </CardContent>
          </Card>
        </Col>

      </Row>

      {idToCheckOut ? (<CheckOut
        show={modalShow}
        onHide={() => setModalShow(false)}
        id={idToCheckOut}
        history={props.history}
        name="home"
        finishAlert={refreshList}
        onClose={setModalShow}
      />)
        : (<div></div>)
      }

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </Container>
  );
};

export default Home;