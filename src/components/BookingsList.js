import React, { useState, useEffect } from "react";
import BookingDataService from "../services/BookingDataService";

import { DropdownButton, Dropdown, Container, Row, Col } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from "react-redux";

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, withStyles, useTheme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import AddCircleIcon from '@material-ui/icons/AddCircle';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BookingsList = (props) => {
    const [bookings, setBookings] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [dispStatusButton, setDispStatusButton] = useState("-Any Status-")
    const [searchStatus, setSearchStatus] = useState("");


    const { user: currentUser } = useSelector((state) => state.auth);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    //sweetalert
    const MySwal = withReactContent(Swal);

    const customtheme = createMuiTheme({
        overrides: {
            // Style sheet name ⚛️
            MuiTableCell: {
                // Name of the rule
                head: {
                    paddingLeft: '48px',
                    backgroundColor: "#FAD02C",
                    color: "white",
                    width: '200px',
                },
                body: {
                    // Some CSS
                    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    // borderRadius: 3,
                    // border: 0,
                    // color: 'white',
                    // height: 48,
                    paddingLeft: '48px',
                    width: '200px',
                    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                },
            },
        },
    });

    const useStyles1 = makeStyles((theme) => ({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }));

    console.log("user", currentUser);

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

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: "#FA53A0",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
        root: {
            backgroundColor: "#EFEBE0",
            color: "black"
        },
    }))(TableRow);

    const StyledToolbar = withStyles((theme) => ({
        root: {
            backgroundColor: "#FB4570",
        },
    }))(Toolbar);

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170, },
        {
            id: 'RoomNumber',
            label: 'Room',
            minWidth: 170,
        },
        {
            id: 'CheckInDate',
            label: 'Check-In',
            minWidth: 170,
            align: 'right',
        },
        {
            id: 'CheckOutDate',
            label: 'Check-Out',
            minWidth: 170,
            align: 'right',
        },
        {
            id: 'Label',
            label: 'Status',
            minWidth: 170,
            align: 'left',
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 170,
            align: 'left',
        },
    ];

    const rows = bookings;

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function EnhancedTableHead(props) {
        const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {currentUser && <StyledTableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    </StyledTableCell>}
                    {columns.map((headCell) => (
                        currentUser ? (
                            <StyledTableCell
                                key={headCell.id}
                                align={headCell.align}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    <b>{headCell.label}</b>
                                    {orderBy === headCell.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            </StyledTableCell>
                        ) : (
                            headCell.id !== 'actions' &&
                            <ThemeProvider theme={customtheme}>
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.align}
                                    sortDirection={orderBy === headCell.id ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        <b>{headCell.label}</b>
                                        {orderBy === headCell.id ? (
                                            <span className={classes.visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            </ThemeProvider>
                        )
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        classes: PropTypes.object.isRequired,
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
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
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
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
    }));

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    useEffect(() => {
        retrieveBookings();
    }, []);

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;

        setSearchName(searchName);
    };

    const onClickStatus = (e) => {
        const status = e.target.name;

        switch (status) {
            case "":
                setDispStatusButton("-Any Status-");
                break;
            case "1":
                setDispStatusButton("Booked");
                break;
            case "2":
                setDispStatusButton("CheckedIn");
                break;
            case "3":
                setDispStatusButton("CheckedOut");
                break;
            case "4":
                setDispStatusButton("Canceled");
                break;
            default:
                console.log(status);
        }
        setSearchStatus(status);
    };

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
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findBooking = () => {

        BookingDataService.findBooking(searchName, searchStatus)
            .then((response) => {
                console.log("found!!");
                console.log(response.data);
                setBookings(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const openBooking = (id) => {
        props.history.push("/bookings/" + id);
    };

    const deleteBooking = (bookingSelected) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "you want to permanently delete?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                bookingSelected.map((id) => {
                    BookingDataService.remove(id)
                        .then(() => {
                            successDeleteNotify(id);
                            console.log("deleted id = " + id.toString());
                        })
                        .catch((e) => {
                            errorNotify(id);
                            console.log(e);
                        });
                })
            }
        })
    };

    const successDeleteNotify = (id) => {
        const bookingDeleted = bookings.find((booking) => {
            return booking.id === id
        });
        return toast.success('Deleted booking of ' + bookingDeleted.name, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => {
                props.history.push("/bookings");
                window.location.reload();
            }
        });
    }

    const errorNotify = (id) => {
        const bookingDeleted = bookings.find((booking) => {
            return booking.id === id
        });
        return toast.error('Error occurs while delete booking of ' + bookingDeleted.name, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const EnhancedTableToolbar = (props) => {
        const classes = useToolbarStyles();
        const { numSelected, nameSearch } = props;

        return (
            <StyledToolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                {numSelected > 0 ? (
                    <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">

                        {numSelected} selected

                    </Typography>
                ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

                    </Typography>
                )}

                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                            <DeleteIcon onClick={() => deleteBooking(selected)} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <div></div>
                    /* <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip> */
                )}
            </StyledToolbar>
        );
    };

    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
        nameSearch: PropTypes.string.isRequired,
    };

    const classes = useStyles();

    const today = new Date();
    const todayTime = today.getTime();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    return (
        <Container className="sheet padding-10mm">
            <Row>
                <Col style={{ "marginRight": "52%" }}>
                    <Typography className={classes.title} variant="h3" id="tableTitle" component="div">
                        Bookings
                    </Typography>

                </Col>
                <Col className="justify-content-md-center ">
                    <Button startIcon={<AddCircleIcon color="error" fontSize="large" />} href="/createBooking/" style={{ display: !currentUser ? "none" : null }} size="large">
                        <h4 style={{ margin: 0 }}>New Booking</h4>
                    </Button>
                </Col>
            </Row>
            <Row style={{ "marginTop": "3%" }}>
                <Col xs={4}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                </Col>
                <Col md="auto">
                    <DropdownButton id="dropdown-item-button" title={dispStatusButton} variant="flat">
                        <Dropdown.Item as="button" name="" onClick={onClickStatus}>-Any Status-</Dropdown.Item>
                        <Dropdown.Item as="button" name="1" onClick={onClickStatus}>Booked</Dropdown.Item>
                        <Dropdown.Item as="button" name="2" onClick={onClickStatus}>CheckedIn</Dropdown.Item>
                        <Dropdown.Item as="button" name="3" onClick={onClickStatus}>CheckedOut</Dropdown.Item>
                        <Dropdown.Item as="button" name="4" onClick={onClickStatus}>Canceled</Dropdown.Item>
                    </DropdownButton>
                </Col>

                <Col>
                    <Col md="auto">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findBooking}
                        >
                            Search
                            </button>
                    </Col>
                </Col>

            </Row>
            <Row style={{ "marginTop": "3%" }}>
                <Col>
                    <Paper className={classes.paper}>
                        {currentUser && selected.length !== 0 && <EnhancedTableToolbar numSelected={selected.length} nameSearch={searchName} />}
                        <TableContainer>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size='medium'
                                aria-label="enhanced table"
                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <StyledTableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.id)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    selected={isItemSelected}
                                                >
                                                    {currentUser && <StyledTableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </StyledTableCell>}
                                                    {currentUser ? (
                                                        <StyledTableCell component="th" id={labelId} scope="row" padding="none">
                                                            {row.GuestFirstName} {row.GuestLastName}
                                                        </StyledTableCell>
                                                    ) : (
                                                        <ThemeProvider theme={customtheme}>
                                                            <StyledTableCell component="th" id={labelId} scope="row" >
                                                                {row.GuestFirstName} {row.GuestLastName}
                                                            </StyledTableCell>
                                                        </ThemeProvider>
                                                    )}

                                                    <StyledTableCell align="left">{row.RoomNumber}</StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        {new Date(row.CheckInDate).getDate()} {monthNames[new Date(row.CheckInDate).getMonth()]}
                                                        {Math.floor((new Date(row.CheckInDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) > 0 ?
                                                            " (in " + (Math.floor((new Date(row.CheckInDate).getTime() - todayTime) / (1000 * 60 * 60 * 24))).toString() + " days)"
                                                            :
                                                            Math.floor((new Date(row.CheckInDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) < 0 ?
                                                                " ( " + (Math.floor((todayTime - new Date(row.CheckInDate).getTime()) / (1000 * 60 * 60 * 24))).toString() + " days ago)"
                                                                :
                                                                ""
                                                        }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        {new Date(row.CheckOutDate).getDate()} {monthNames[new Date(row.CheckOutDate).getMonth()]}
                                                        {Math.floor((new Date(row.CheckOutDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) > 0 ?
                                                            " (in " + (Math.floor((new Date(row.CheckOutDate).getTime() - todayTime) / (1000 * 60 * 60 * 24))).toString() + " days)"
                                                            :
                                                            Math.floor((new Date(row.CheckOutDate).getTime() - todayTime) / (1000 * 60 * 60 * 24)) < 0 ?
                                                                " ( " + (Math.floor((todayTime - new Date(row.CheckOutDate).getTime()) / (1000 * 60 * 60 * 24))).toString() + " days ago)"
                                                                :
                                                                ""
                                                        }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{row.Label}</StyledTableCell>
                                                    {currentUser && <StyledTableCell align="left">{
                                                        <Button startIcon={<EditIcon fontSize="small" />} onClick={() => openBooking(row.id)} size="small" color="#90ADC6" variant="contained">
                                                        </Button>
                                                    }</StyledTableCell>}
                                                </StyledTableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <StyledTableRow style={{ height: 53 * emptyRows }}>
                                            <StyledTableCell colSpan={12} />
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[9]}
                            component="div"
                            // colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </Paper>
                </Col>
            </Row>
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

export default BookingsList;