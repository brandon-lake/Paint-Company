import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { statusOptions, capitalizeFirstLetter } from '../utils';

const PaintsForm = ({ paints, fetchPaints }) => {
    // the current selected colour from the dropdown select
    const [selectedColour, setSelectedColour] = useState("");
    // the current selected status from the dropdown select
    const [selectedStatus, setSelectedStatus] = useState("");
    // the current input stock from the text input
    const [newStock, setNewStock] = useState("");
    // error message to be displayed on invalid form submission
    const [errorMessage, setErrorMessage] = useState("");

    // show error message for only 4 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorMessage("");
        }, 4000);
        return () => clearTimeout(timeout);
    }, [errorMessage]);
    
    const colours = [...new Set(paints.map(paint => paint.colour))]

    const handleColourChange = (e) => {
        setSelectedColour(e.target.value);
    };
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };
    const handleStockChange = (e) => {
        setNewStock(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        /* If I was to spend more time on this I think I would either remove the ability to update status here
         * since the managers can update that on the kanban board.  Or if not, I would change the query to allow
         * only some parameters and build the sqlite query based on provided parameters.  Not sure which solution I prefer.
         */
        if (selectedColour === "" || selectedStatus === "" || newStock === "") {
            setErrorMessage("Cannot submit form with empty fields");
            return;
        }
        
        const data = { colour: selectedColour, status: selectedStatus, stock: newStock };
        try {
            const response = await fetch(`http://localhost:3001/paints/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        
            if (!response.ok) {
                throw new Error('Failed to update paints');
            }
        
            fetchPaints();
        } catch (error) {
            console.error('Error updating paint:', error);
        }
    }

    const resetForm = () => {
        setSelectedColour("");
        setSelectedStatus("");
        setNewStock("");
    }

    return (
        <div>
            <h3 className="mt-5 mb-3">Update Paint Stock</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <Row>
                        <Col>
                            <label htmlFor="colorSelect">Select Color:</label>
                            <select className="form-control" id="colorSelect" value={selectedColour} onChange={handleColourChange}>
                                <option value="" disabled hidden>Select Color</option>
                                {colours.map((color, index) => (
                                    <option key={index} value={color}>{capitalizeFirstLetter(color)}</option>
                                ))}
                            </select>
                        </Col>
                        <Col>
                            <label htmlFor="statusSelect">Select Status:</label>
                            <select className="form-control" id="statusSelect" value={selectedStatus} onChange={handleStatusChange}>
                                <option value="" disabled hidden>Select Status</option>
                                {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>{capitalizeFirstLetter(status)}</option>
                                ))}
                            </select>
                        </Col>
                        <Col>
                            <label htmlFor="stockInput">Update Stock:</label>
                            <input type="number" className="form-control text-center" id="stockInput" value={newStock} onChange={handleStockChange}
                            />
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

export default PaintsForm;