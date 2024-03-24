import React, { useEffect, useState } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { userRolesToReadableMap, capitalizeFirstLetter } from '../utils';
import UserForm from './UserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch("http://localhost:3001/users")
            .then(response => {
                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.log("Error encountered: ", error);
            });
    };

    return (
        <Container>
            <h3 className="mt-3 mb-3">User Access Control</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>User</th>
                    <th>Access Type</th>
                    <th>Enabled</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td className="align-middle">{capitalizeFirstLetter(user.username)}</td>
                            <td className="align-middle">{userRolesToReadableMap[user.role]}</td>
                            <td className="align-middle">{capitalizeFirstLetter(user.enabled)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <UserForm users={users} fetchUsers={fetchUsers} />
        </Container>
    );
};

export default UserManagement;