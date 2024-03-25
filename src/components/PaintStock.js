import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { capitalizeFirstLetter } from "../utils";
import PaintsForm from './PaintsForm';

const PaintStock = ({userRole}) => {
    // list of all paints in the database
    const [paints, setPaints] = useState([]);

    useEffect(() => {
        fetchPaints();
    }, []);

    const fetchPaints = () => {
        fetch("http://localhost:3001/paints")
            .then(response => {
                return response.json();
            })
            .then(data => {
                setPaints(data);
            })
            .catch(error => {
                console.log("Error encountered: ", error);
            });
    }

    return (
        <Container>
            <h3 className="mt-3 mb-3">Paint Availability</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Color</th>
                    <th>Availability</th>
                    <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {paints.map((paint, index) => (
                        <tr key={index}>
                            <td>{capitalizeFirstLetter(paint.colour)}</td>
                            <td>{capitalizeFirstLetter(paint.status)}</td>
                            <td>{paint.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {userRole === "crud" &&
                <PaintsForm paints={paints} fetchPaints={fetchPaints} />
            }
            
        </Container>
    );
};

export default PaintStock;