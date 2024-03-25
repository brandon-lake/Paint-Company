import React, { useRef, useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import StickyNote from './StickyNote';

const PaintBoard = () => {
    const tableRef = useRef(null);
    const containerRef = useRef(null);
    const [paints, setPaints] = useState([]);
    const [tableWidth, setTableWidth] = useState(null);

    const topPadding = 100;
    const columnSpacing = { 
        "available": (tableWidth / 10), 
        "running low": tableWidth / 3 * 1 + (tableWidth / 10),
        "out of stock": tableWidth / 3 * 2 + (tableWidth / 10)
    }

    useEffect(() => {
        const observeTableWidth = () => {
        const table = tableRef.current;
        if (table) {
            const observer = new ResizeObserver((entries) => {
            const { width } = entries[0].contentRect;
            console.log(width);
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

    return (
        <Container ref={containerRef} className="position-relative" id="stickyContainer" style={{ height: '80vh' }}>
            {paints.map((paint, index) => {
                console.log(index * 50 + topPadding);
                const newSticky = <StickyNote key={index} colour={paint.colour} stock={paint.stock} xPosition={columnSpacing[paint.status]} yPosition={index * 120 + topPadding} containerRef={containerRef} />;

                return (newSticky)
            })}

            <h3 className="mt-3 mb-3">Paint Kanban Board</h3>
            <Table striped bordered hover style={{ height: '100%' }} ref={tableRef}>
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