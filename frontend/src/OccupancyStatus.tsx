import { useState, useEffect } from 'react';
import socket from "./socket"


function OccupancyStatus() {
    const [occupancy, setStatus] = useState(false);

    useEffect(() => {
        socket.on("update_occupancy", (data) => {
            setStatus(data);
        });

        return () => {
            socket.off("update_occupancy");
        }

    }, [])

    return (
        <>
            <h2 className="text-center">{occupancy ? 'Occupant Detected' : 'No Occupants Detected'}</h2>
        </>
    );
}

export default OccupancyStatus;