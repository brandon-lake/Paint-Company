import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { statusOptions, capitalizeFirstLetter, userRolesToReadableMap } from '../utils';

const UserForm = ({ users, fetchUsers }) => {
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedAccessType, setSelectedAccessType] = useState("");
    const [selectedEnabled, setSelectedEnabled] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorMessage("");
        }, 4000);
        return () => clearTimeout(timeout);
    }, [errorMessage]);
    
    const userList = [...new Set(users.map(user => user.username))]

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
    };
    const handleAccessChange = (e) => {
        setSelectedAccessType(e.target.value);
    };
    const handleEnabledChange = (e) => {
        setSelectedEnabled(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedUser === "" && (selectedAccessType === "" || selectedEnabled === "")) {
            setErrorMessage("Must both select a user, and update at least one of their fields");
            return;
        }
        
        const data = { username: selectedUser, role: selectedAccessType, enabled: selectedEnabled };
        try {
            const response = await fetch(`http://localhost:3001/users/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        
            if (!response.ok) {
                throw new Error('Failed to update users');
            }
        
            console.log('Users updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const resetForm = () => {
        setSelectedUser("");
        setSelectedAccessType("");
        setSelectedEnabled("");
    }

    return (
        <div>
            <h3 className="mt-5 mb-3">Update User Access</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <Row>
                        <Col>
                            <label htmlFor="userSelect">Select User:</label>
                            <select className="form-control" id="userSelect" value={selectedUser} onChange={handleUserChange}>
                                <option value="" disabled hidden>Select User</option>
                                {userList.map((user, index) => (
                                    <option key={index} value={user}>{capitalizeFirstLetter(user)}</option>
                                ))}
                            </select>
                        </Col>
                        <Col>
                            <label htmlFor="roleSelect">Select Access Type:</label>
                            <select className="form-control" id="roleSelect" value={selectedAccessType} onChange={handleAccessChange}>
                                <option value="" disabled hidden>Select Access Type</option>
                                {Object.keys(userRolesToReadableMap).map((role, index) => (
                                    <option key={index} value={role}>{userRolesToReadableMap[role]}</option>
                                ))}
                            </select>
                        </Col>
                        <Col>
                            <label htmlFor="enabledSelect">Select Enabled:</label>
                            <select className="form-control" id="enabledSelect" value={selectedEnabled} onChange={handleEnabledChange}>
                                <option value="" disabled hidden>Select Enabled</option>
                                <option value="Yes" >Yes</option>
                                <option value="No">No</option>
                            </select>
                        </Col>
                    </Row>
                </div>
                <Button variant="primary" type="submit" className="mt-3">Submit</Button>
                &nbsp;
                <Button variant="secondary" className="mt-3" onClick={resetForm}>Clear</Button>
                
            </Form>

            {errorMessage && 
                <div className="alert alert-danger mt-5" role="alert">
                    {errorMessage}
                </div>
            }
        </div>
    );
};

export default UserForm;