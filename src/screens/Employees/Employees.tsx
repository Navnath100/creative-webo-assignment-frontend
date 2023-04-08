import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Drawer, TextField, IconButton,
    Divider, Avatar, Tooltip
} from '@material-ui/core';
import { ChevronRight, EditOutlined } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast/Toast';

const { innerWidth: width, innerHeight: height } = window;

const useStyles = makeStyles((theme: any) => ({
    table: {
        minWidth: 650,
    },
    skeletonLoader: {
        backgroundColor: '#ddd',
    },
    button: {
        height: '30px',
        fontSize: '12px',
        padding: '4px 8px',
    },
    drawer: {
        width: '400px',
        flexShrink: 0,
    },
    drawerPaper: {
        width: '400px',
        position: 'relative',
        overflowX: 'hidden',
        transition: 'width 0.2s',
        marginLeft: width - 440,
        padding: 20
    },
    drawerOpen: {
        width: '100%',
    },
    drawerClose: {
        width: '0',
    },
    closeButton: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
    },
    form: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: theme.spacing(2),
    },
    addButton: {
        marginTop: theme.spacing(2),
    },
    avatarContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: theme.spacing(2)
    },
    avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        marginBottom: 10,
        padding: 10,
        border: '1px #ddd solid',
        boxShadow: '1px 1px 1px 1px #ddd'
    },
    profilePicinput: {
        display: "none",
    },
}));

const SkeletonRow = () => {
    const classes = useStyles();

    return (
        <TableRow>
            <TableCell>
                <div className={classes.skeletonLoader} style={{ height: 40, width: 50, borderRadius: 50 }}></div>
            </TableCell>
            <TableCell>
                <div className={classes.skeletonLoader} style={{ height: 16, width: 100, borderRadius: 4 }}></div>
            </TableCell>
            <TableCell>
                <div className={classes.skeletonLoader} style={{ height: 16, width: 100, borderRadius: 4 }}></div>
            </TableCell>
            <TableCell>
                <div className={classes.skeletonLoader} style={{ height: 16, width: 100, borderRadius: 4 }}></div>
            </TableCell>
            <TableCell>
                <div className={classes.skeletonLoader} style={{ height: 16, width: 100, borderRadius: 4 }}></div>
            </TableCell>
            <TableCell>
                <div className={classes.skeletonLoader} style={{ height: 16, width: 40, borderRadius: 4 }}></div>
            </TableCell>
        </TableRow>
    );
};

export default function Employees() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<Array<any>>([]);
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<any>(null);
    const [employee, setEmployee] = useState<any>(Object);
    const imgPlaceholder = "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png";
    useEffect(() => {
        getEmployees()
    }, []);

    async function getEmployees() {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoading(true);
            await fetch("http://localhost:4001/auth/employee", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": token
                },
            }).then(async (res: any) => {
                const resJson = await res.json()
                console.log(res);
                setIsLoading(false);
                if (res.status === 200) {
                    setRows(resJson)
                }
            });
        } else navigate('/')
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setEmployee({
            name: "",
            mobile: "",
            email: "",
            address: ""
        })
    };

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }


    async function editEmployee() {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await fetch("http://localhost:4001/auth/employee/" + employee._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*",
                        "Authorization": token
                    },
                    body: JSON.stringify({ name: employee.name, mobile: employee.mobile, email: employee.email, address: employee.address }),
                }).then(async (res: any) => {
                    const resJson = await res.json()
                    if (res.status === 201) {
                        console.log(resJson);
                        let arr = [...rows]
                        const index = arr.findIndex((row: any) => row._id === employee._id);
                        arr[index] = { ...resJson.employee, profilePicture: previewImage };
                        setRows([...arr])
                        handleDrawerClose()
                        setPreviewImage(null)
                    } else Toast({ message: `${resJson.message} : ${resJson?.error?.details[0]?.message ? resJson?.error?.details[0]?.message : ""}`, type: 'error' })
                });
            } else navigate('/')
        } catch (error) {
            console.log("Error catched : ", error);

        }
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                if (!employee._id) {
                    await fetch("http://localhost:4001/auth/employee", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "*/*",
                            "Authorization": token
                        },
                        body: JSON.stringify(employee),
                    }).then(async (res: any) => {
                        const resJson = await res.json()
                        if (res.status === 201) {
                            console.log(resJson);
                            setRows([{ ...resJson.employee, profilePicture: previewImage }, ...rows])
                            handleDrawerClose()
                            setPreviewImage(null)
                        } else Toast({ message: `${resJson.message} : ${resJson?.error?.details[0]?.message ? resJson?.error?.details[0]?.message : ""}`, type: 'error' })
                    });
                } else editEmployee()
            } else navigate('/')
        } catch (error) {
            console.log("Error catched : ", error);

        }
    };

    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        if (file)
            setPreviewImage(URL.createObjectURL(file));
    };


    return (
        <div style={{ padding: 10 }}>
            <div style={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'space-between', padding: '0px 10px' }}>
                <h4>Employees</h4>
                <span>
                    <Button
                        onClick={handleDrawerOpen}
                        variant="contained" color="primary"
                        size="small" className={classes.button}>
                        Add
                    </Button>
                    <Button
                        style={{ marginLeft: 20 }}
                        onClick={handleLogout}
                        variant="contained" color="primary"
                        size="small" className={classes.button}>
                        Logout
                    </Button>
                </span>
            </div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : (
                            <>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            <img style={{ height: 25, width: 25, borderRadius: 50, margin: 5, marginLeft: 20 }} src={row.profilePicture ? row.profilePicture : imgPlaceholder} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.mobile}</TableCell>
                                        <TableCell>{row.address}</TableCell>
                                        <TableCell><Button
                                            onClick={() => {
                                                setEmployee(row);
                                                setPreviewImage(row.profilePicture)
                                                handleDrawerOpen()
                                            }}
                                        ><EditOutlined style={{ fontSize: 15 }} /></Button></TableCell>
                                    </TableRow>
                                ))
                                }
                            </>
                        )}
                    </TableBody>
                </Table>
                {rows.length === 0 && !isLoading && <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>No records found</div>}
            </TableContainer>
            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="right"
                open={open}
                classes={{
                    paper: `${classes.drawerPaper} ${open ? classes.drawerOpen : classes.drawerClose
                        }`,
                }}
                onClose={handleDrawerClose}
            >
                <div>
                    <IconButton className={classes.closeButton} onClick={handleDrawerClose}>
                        <ChevronRight />
                    </IconButton>
                </div>
                <div className={classes.avatarContainer}>
                    <Tooltip title="Click to Upload Picture" aria-label="Upload Picture">
                        <label htmlFor="icon-button-file">
                            {previewImage ? (
                                <Avatar alt="Profile Picture" src={previewImage} className={classes.avatar} />
                            ) : (
                                <Avatar alt="Profile Picture" className={classes.avatar} />
                            )}
                        </label>
                    </Tooltip>
                    <input
                        accept="image/*"
                        className={classes.profilePicinput}
                        id="icon-button-file"
                        type="file"
                        onChange={handleFileInputChange}
                    />
                </div>
                <TextField
                    className={classes.input}
                    defaultValue={employee.name}
                    label="Name"
                    variant="outlined"
                    required
                    onChange={(e: any) => setEmployee({ ...employee, name: e.target.value })}
                />
                <TextField
                    className={classes.input}
                    defaultValue={employee.email}
                    label="Email"
                    variant="outlined"
                    required
                    onChange={(e: any) => setEmployee({ ...employee, email: e.target.value })}
                />
                <TextField
                    className={classes.input}
                    defaultValue={employee.mobile}
                    label="Mobile"
                    variant="outlined"
                    required
                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                    onChange={(e: any) => setEmployee({ ...employee, mobile: e.target.value })}
                />
                <TextField
                    className={classes.input}
                    defaultValue={employee.address}
                    label="Address"
                    variant="outlined"
                    required
                    onChange={(e: any) => setEmployee({ ...employee, address: e.target.value })}
                />
                <Button
                    className={classes.addButton}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Add Employee
                </Button>
            </Drawer>
        </div>
    );
}
