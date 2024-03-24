import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { UserRole } from "../consts/UserRoles";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { capitalizeFirstLetter } from "../utils";

const Header = ({ userRole, setUserRole, setIsLoggedIn, currentUser, setCurrentUser }) => {
    let history = useHistory();

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(UserRole.NONE);
        setCurrentUser("")
        localStorage.removeItem("loggedIn")
        localStorage.removeItem("paintUser");
        localStorage.removeItem("paintRole");
        history.push("/login");
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
            <span className="text-light">Welcome, {capitalizeFirstLetter(currentUser)}! &nbsp;&nbsp;</span>
            <Button variant="outline-light link" onClick={handleLogout} href="/login">Logout</Button>
        </Navbar>
    );
};

export default Header;
