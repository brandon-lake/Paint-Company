import React, { useRef, useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import StickyNote from './StickyNote';

const PaintBoard = () => {
    /* reference to the table, used to get info about its width such that the code can tell when a note has been dragged
    * to a different column on different sized screens
    */
    const tableRef = useRef(null);
    // reference to the container, used for moving the stickynotes
    const containerRef = useRef(null);
    // list of all paints in the database
    const [paints, setPaints] = useState([]);
    // contains the tables width
    const [tableWidth, setTableWidth] = useState(null);

    // padding between the top of the container and the table.  Roughly the size of the table title and header row.
    const topPadding = 120;

    // rough calculations used to determine where to place each note horizontally on page load
    const columnSpacing = { 
        "available": (tableWidth / 10), 
        "running low": tableWidth / 3 * 1 + (tableWidth / 10),
        "out of stock": tableWidth / 3 * 2 + (tableWidth / 10)
    }

    useEffect(() => {
        // get and update table width value
        const observeTableWidth = () => {
        const table = tableRef.current;
        if (table) {
            const observer = new ResizeObserver((entries) => {
                const { width } = entries[0].contentRect;
                setTableWidth(width);
            });
            observer.observe(table);
            return () => observer.disconnect();
        }
        };

        observeTableWidth();

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

    const updateIfChangedColumn = async (paint, newX) => {
        let newStatus;

        // check where the note was dropped to see if it was moved to a different column
        if (newX < tableWidth / 3) {
            newStatus = "available";
        } else if (newX < tableWidth / 3 * 2) {
            newStatus = "running low";
        } else {
            newStatus = "out of stock";
        }

        // if it was moved, update state and perform a put to the database
        if (paint.status !== newStatus) {
            const updatedPaints = paints.map(p => {
                if (p.colour === paint.colour) {
                    return {
                        ...p, status: newStatus
                    }
                }
                return p;
            });
            setPaints(updatedPaints);

            // perform
            const data = { status: newStatus, colour: paint.colour };
            try {
                const response = await fetch(`http://localhost:3001/paints/updateStatus`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            
                if (!response.ok) {
                    throw new Error('Failed to update paint status', response.error);
                }
            
                fetchPaints();
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    }

    return (
        <Container ref={containerRef} className="position-relative" id="stickyContainer" style={{ height: '90vh', width: '80vw', overflow: 'hidden' }}>
            {paints.map((paint, index) => {
                const newSticky = 
                    <StickyNote key={index} paint={paint} xPosition={columnSpacing[paint.status]} yPosition={index * 120 + topPadding} 
                        containerRef={containerRef} updateIfChangedColumn={updateIfChangedColumn} />;

                return (newSticky)
            })}

            <h3 className="mt-3 mb-3">Paint Kanban Board</h3>
            <Table striped bordered hover style={{ height: '90%', width: '100%' }} ref={tableRef}>
                <colgroup>
                    <col style={{ width: '33.33%' }} />
                    <col style={{ width: '33.33%' }} />
                    <col style={{ width: '33.33%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>Available</th>
                        <th>Running Low</th>
                        <th>Out of Stock</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default PaintBoard;