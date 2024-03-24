import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import socket from '../socket';
import { useState, useEffect } from 'react';

export default function BasicLineChart() {
    const [times, setTimes] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    const [lastTime, setLastTime] = useState(new Date());
    const [temps, setTemps] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);

    useEffect(() => {
        socket.on("sensor_data", (data) => {
            let newTemps = temps;
            newTemps.shift();
            newTemps.push(data.temperature)

            let currentTime = new Date();
            let secs = Math.round((currentTime - lastTime) / 1000)
            let newTimes = times;
            newTimes.shift()
            newTimes.push(secs)

            setTimes(newTimes);
            setLastTime(currentTime);
            setTemps(newTemps);
        });

        return () => {
            socket.off("sensor_data");
        }

    }, [])

    return (
        <Box p={2} sx={{display: 'flex', flexDirection: 'column'}}>
            <h3>Temperature</h3>
            <LineChart
                xAxis={[{ data: times }]}
                series={[
                    {
                    data: temps,
                    area: true,
                    },
                ]}
                width={500}
                height={300}
                grid={{ vertical: true, horizontal: true }}
            />
        </Box>
    );
}