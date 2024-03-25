import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const LoginPage = ({ isLoggedIn, setIsLoggedIn, setUserRole, setCurrentUser }) => {
    // username from the text input field
    const [username, setUsername] = useState("");
    // error message to be shown if login is valid or disabled
    const [errorMessage, setErrorMessage] = useState("");
    // used for page routing
    const history = useHistory();

    // show error message for only 4 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorMessage("");
        }, 4000);
        return () => clearTimeout(timeout);
    }, [errorMessage]);

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/home');
        }
    }, [isLoggedIn, history]);

    const handleLoginRequest = async (e) => {
        e.preventDefault();

        let user = username.trim().toLocaleLowerCase();

        fetch(`http://localhost:3001/users/${user}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // this means we have returned a user object from the database
                if ('id' in data) {
                    // check if the user is disabled
                    if (data.enabled === "Yes") {
                        setIsLoggedIn(true);
                        setUserRole(data.role);
                        setCurrentUser(data.username);
                        localStorage.setItem("loggedIn", true);
                        localStorage.setItem("paintUser", data.username);
                        localStorage.setItem("paintRole", data.role);
                    } else {
                        setErrorMessage("Your login has been disabled, please contact a server Administrator.");
                    }
                } else {
                    setErrorMessage(data.error);
                }
            })
            .catch(error => {
                console.log("Error encountered: ", error);
            });
    }

    return (
        <div>
            <Container>
            <h1 className="mt-5">Login</h1>
            <Form className="mt-3" onSubmit={handleLoginRequest}>
                <Form.Label>(Try logging in as John, Jane, Painter, Adam, or Manager)</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Button variant="primary" type="submit" className="mt-3">Login</Button>
            </Form>
            </Container>

            {errorMessage && 
                <div className="alert alert-danger mt-5" role="alert">
                    {errorMessage}
                </div>
            }
            
        </div>
    );
    
};

export default LoginPage;