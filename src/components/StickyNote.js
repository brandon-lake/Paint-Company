import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { capitalizeFirstLetter } from '../utils';

const StickyNote = ({ paint, xPosition, yPosition, containerRef, updateIfChangedColumn }) => {
    // reference to this instance of a stickynote
    const stickyRef = useRef(null);
    // tracks whether a stickynote is currently being held
    const isNoteHeld = useRef(false);
    // tracks important coordinates - start location where a note is first grabbed, and end location when a note is released
    const coords = useRef({
        startX: 0,
        startY: 0,
        lastX: xPosition,
        lastY: yPosition
    });

    // solution isn't perfect, but I am happy given the time constraints
    useEffect(() => {
        if (!stickyRef.current || !containerRef.current) {
            return;
        }

        const note = stickyRef.current;
        const container = containerRef.current;

        const grabNote = (mouseEvent) => {
            isNoteHeld.current = true;
            
            coords.current.startX = mouseEvent.clientX;
            coords.current.startY = mouseEvent.clientY;
        }
        const releaseNote = (mouseEvent) => {
            if (isNoteHeld.current === false) {
                return;
            }

            isNoteHeld.current = false;

            coords.current.lastX = note.offsetLeft;
            coords.current.lastY = note.offsetTop;
            updateIfChangedColumn(paint, coords.current.lastX);
        }
        
        // update position based on the mouses relative movement since the note was grabbed
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
        container.addEventListener("mouseleave", releaseNote);

        const cleanup = () => {
            note.removeEventListener("mousedown", grabNote);
            note.removeEventListener("mouseup", releaseNote);
            container.removeEventListener("mousemove", dragNote);
            container.removeEventListener("mouseleave", releaseNote);

        }
        
        return cleanup;
    }, []);

    return (
        <Card ref={stickyRef} className="position-absolute" style={{ height: '7rem', backgroundColor: paint.colour, top: yPosition, left: xPosition, cursor: 'pointer' }}>
            {/* dont love hard coding this colour but it works for now */}
            <Card.Body style={{ color: paint.colour === "black" ? "white" : "black" }}>
                <Card.Title>{capitalizeFirstLetter(paint.colour)}</Card.Title>
                <Card.Text>
                    <strong>Stock:</strong> {paint.stock}<br />
                    <i>{paint.status}</i>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default StickyNote;