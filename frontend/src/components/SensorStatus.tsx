// import { useEffect } from "./react";
import Box from '@mui/material/Box';
import StatusLabel from './StatusLabel';
import socket from '../socket'
import { useEffect, useState } from 'react'

const GREEN = "#0be881"
const RED = "#ff3f34"
const YELLOW = "#ffa801"

export default function SensorStatus() {
    const [occupancy, setOccupancy] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [temp, setTemp] = useState(0);
    const [light, setLight] = useState(0);

    useEffect(() => {
        socket.on("connect", () => {
            setConnectionStatus(true);
        });

        socket.on("sensor_data", (data) => {
            setTemp(data.temperature);
            setLight(data.light);
        });

        socket.on("occupancy", (data) => {
            setOccupancy(data);
        });

        return () => {
            socket.off("sensor_data");
            socket.off("occupancy");
            socket.off("connect");

            setConnectionStatus(false)
        }

    }, [])

    return (
        <Box gap={8} p={2} sx={{display: 'flex', marginBottom: '2em'}}>
            <StatusLabel label="Sensor Status" value={connectionStatus ? "Connected" : "Disconnected" } valueColor={connectionStatus ? GREEN : RED}/>
            <StatusLabel label="Occupancy" value={occupancy ? "Occupants detected" : "No occupants detected"} valueColor={occupancy ? GREEN : RED}/>
            <StatusLabel label="Temperature" value={temp} valueColor={YELLOW}/>
            <StatusLabel label="Light" value={light} valueColor={YELLOW}/>
        </Box>
    )
}