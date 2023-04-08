import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper, TextField, Button, Typography, Link } from '@material-ui/core';
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

export default function SignUp() {
    const classes = useStyles();
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async () => {
        const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (
            email && reg.test(email) &&
            password.trim() !== '' &&
            password.trim() !== ''
        ) {
            const body = { email, password, confirmPassword }
            await fetch("http://localhost:4001/user/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(body),
            }).then(async (res: any) => {
                const resJson = await res.json()
                console.log(res);
                if (res.status === 201) {
                    localStorage.setItem('token', resJson.token)
                    navigate('/')
                } else Toast({ message: `${resJson.message} : ${resJson?.error?.details[0]?.message ? resJson?.error?.details[0]?.message : ""}`, type: 'error' })
            });
        }
    };

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: any) => {
        setConfirmPassword(event.target.value);
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <LockOutlined />
                    <Typography component="h1" variant="h5">
                        Sign up
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Sign up
                    </Button>
                    <Typography align="center">
                        Already have an account? <Link style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Sign in</Link>
                    </Typography>
                </Paper>
            </div>
        </Container>
    );
}
