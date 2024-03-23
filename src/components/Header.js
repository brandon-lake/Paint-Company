import React from "react";
import { Redirect } from 'react-router-dom';
import { Navbar, Nav, Button } from "react-bootstrap";
import { UserRole } from "../consts/UserRoles";

const Header = ({ userRole, setIsLoggedIn, setUserRole, setCurrentUser }) => {

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(UserRole.NONE);
        setCurrentUser("")
        localStorage.removeItem('paintUser');
        localStorage.removeItem('paintRole');
        return <Redirect to="/" />;
    }
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="p-2">
            <Navbar.Brand href="home">Paint Company</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="home">Home</Nav.Link>

                    {userRole !== "admin" && (
                        <Nav.Link href="stock">Paint Stock</Nav.Link>
                    )}

                    {userRole === "crud" && (
                        <Nav.Link href="board">Kanban Board</Nav.Link>
                    )}

                    {userRole === "admin" && (
                        <Nav.Link href="users">User Management</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
            <div>
                
            </div>
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
        </Navbar>
    );
};

export default Header;
