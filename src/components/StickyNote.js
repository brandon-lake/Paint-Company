import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';

const StickyNote = ({ colour, stock, xPosition, yPosition, containerRef }) => {
    const stickyRef = useRef(null);
    const isNoteHeld = useRef(false);
    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: xPosition,
        lastY: xPosition
    });

    useEffect(() => {
        if (!stickyRef.current || !containerRef.current) {
            return;
        }

        const note = stickyRef.current;
        const container = containerRef.current;

        const grabNote = (mouseEvent) => {
            console.log(`Note is at (${coords.current.lastX}, ${coords.current.lastY})`);
            coords.current.startX = mouseEvent.clientX;
            coords.current.startY = mouseEvent.clientY;
            isNoteHeld.current = true;
        }
        const releaseNote = (mouseEvent) => {
            isNoteHeld.current = false;

            coords.current.lastX = note.offsetLeft;
            coords.current.lastY = note.offsetTop;
        }
        const dragNote = (mouseEvent) => {
            if (!isNoteHeld.current) {
                return;
            }

            const newX = mouseEvent.clientX - coords.current.startX + coords.current.lastX;
            const newY = mouseEvent.clientY - coords.current.startY + coords.current.lastY;

            note.style.left = `${newX}px`;
            note.style.top = `${newY}px`;
        }

        note.addEventListener("mousedown", grabNote);
        note.addEventListener("mouseup", releaseNote);
        container.addEventListener("mousemove", dragNote);
        container.addEventListener("mouseup", releaseNote);

        const cleanup = () => {
            note.removeEventListener("mousedown", grabNote);
            note.removeEventListener("mouseup", releaseNote);
        }
        
        return cleanup;
    }, []);

    return (
        <Card ref={stickyRef} className="position-absolute pt-2" style={{ height: '7rem', backgroundColor: colour, top: yPosition, left: xPosition, cursor: 'pointer' }}>
            {/* dont love hard coding this colour but it works for now */}
            <Card.Body style={{ color: colour === "black" ? "white" : "black" }}>
                <Card.Title>{colour}</Card.Title>
                <Card.Text>
                    <strong>Stock:</strong> {stock}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default StickyNote;