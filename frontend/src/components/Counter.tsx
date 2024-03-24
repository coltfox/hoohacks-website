import { useState, useEffect } from 'react';
import socket from "../socket"


function Counter() {
    const [counter, setCounter] = useState(false);

    useEffect(() => {
        socket.on("counter", (data) => {
            setCounter(data);
        });

        return () => {
            socket.off("counter");
        }

    }, [])

    return (
        <>
            {/* <h2 className="text-center">{occupancy ? 'Occupant Detected' : 'No Occupants Detected'}</h2> */}
            <h2>Counter</h2>
            <p>{counter}</p>
        </>
    );
}

export default Counter;