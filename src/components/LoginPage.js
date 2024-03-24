import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const LoginPage = ({ isLoggedIn, setIsLoggedIn, setUserRole, setCurrentUser }) => {
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();

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

    const handleLoginRequest = (e) => {
        let user = username.trim().toLocaleLowerCase();

        fetch(`http://localhost:3001/users/${user}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if ('id' in data) {
                    setIsLoggedIn(true);
                    setUserRole(data.role);
                    setCurrentUser(data.username);
                    localStorage.setItem("loggedIn", true);
                    localStorage.setItem("paintUser", data.username);
                    localStorage.setItem("paintRole", data.role);

                    history.push('/home');
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
                <Form.Label>(Try logging in as "John", "Jane", "Adam", or "Painter")</Form.Label>
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