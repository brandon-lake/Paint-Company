import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { UserRole } from "../consts/UserRoles";

const LoginPage = ({ setIsLoggedIn, setUserRole, isLoggedIn, setCurrentUser }) => {
    const [username, setUsername] = useState("");

    const handleLoginRequest = (e) => {
        e.preventDefault();
        let validLogin = false;
        let user = username.trim().toLocaleLowerCase();
        let role = UserRole.NONE;

        switch(user) {
            case "john":
                validLogin = true;
                role = UserRole.VIEW;
                break;
            case "jane":
                validLogin = true;
                role = UserRole.CRUD;
                break;
            case "adam":
                validLogin = true;
                role = UserRole.ADMIN;
                break;
            case "painter":
                validLogin = true;
                role = UserRole.CRUD;
                break;
            default:
        }
        if (validLogin) {
            setIsLoggedIn(true);
            setUserRole(role);
            setCurrentUser(user);
            localStorage.setItem("paintUser", user);
            localStorage.setItem("paintRole", role);
        }
    }

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <Container>
        <h1 className="mt-5">Login</h1>
        <Form className="mt-3" onSubmit={handleLoginRequest}>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Button variant="primary" type="submit" className="mt-3">Login</Button>
        </Form>
        </Container>
    );
    
};

export default LoginPage;