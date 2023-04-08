import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper, TextField, Button, Typography, Link, CircularProgress } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast/Toast';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(8),
    },
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        width: '100%',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login() {
    const classes = useStyles();
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        try {
            if (
                email && reg.test(email) &&
                password.trim() !== ''
            ) {
                setLoading(true);
                const body = { email, password }
                await fetch("http://localhost:4001/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*"
                    },
                    body: JSON.stringify(body),
                }).then(async (res: any) => {
                    const resJson = await res.json()
                    console.log(resJson);
                    if (res.status === 200) {
                        localStorage.setItem('token', resJson.token)
                        setLoading(false)
                        navigate('/employees')
                    } else {
                        setLoading(false);
                        Toast({ message: `${resJson.message} : ${resJson?.error?.details[0]?.message ? resJson?.error?.details[0]?.message : ""}`, type: 'error' })
                    }
                }).catch((error: any) => {
                    console.log(error);
                    setLoading(false)
                });
            } else Toast({ message: "Email or password cannot be empty" })
        } catch (error) {
            console.log(error);

        }
    };
    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <LockOutlined />
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress style={{ color: '#fff' }} /> : "Sign In"}
                    </Button>
                    <Typography align="center">
                        Don't have an account? <Link style={{ cursor: 'pointer' }} onClick={() => navigate('/sign-up')}>Sign Up</Link>
                    </Typography>
                </Paper>
            </div>
        </Container>
    );
}