import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import socket from '../socket';
import { useState, useEffect } from 'react';

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

const keyToLabel: { [key: string]: string } = {
    time: 'Time elapsed (s)',
    temp: 'Temperature (C)',
  };
  
  const colors: { [key: string]: string } = {
    time: 'lightblue',
    temp: 'blue',
  };

const stackStrategy = {
    stack: 'total',
    area: true,
    stackOffset: 'none', // To stack 0 on top of others
  } as const;
  
  const customize = {
    height: 300,
    width: 500,
    // legend: { hidden: true },
    // margin: { top: 5 },
    // stackingOrder: 'descending',
  };

export default function BasicLineChart() {
    const [times, setTimes] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    const [lastTime, setLastTime] = useState(new Date());
    const [temps, setTemps] = useState([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    const [dataset, setData] = useState([]);

    useEffect(() => {
        socket.on("sensor_data", (data) => {
            let newTemps = [...temps, data.temperature];
            newTemps.shift();
            let currentTime = new Date();
            let secs = Math.round((currentTime - lastTime) / 1000)
            // let newTimes = makeArr(0, secs, 6);
            console.log(newTimes);
            setTimes(newTimes);
            setLastTime(currentTime);
            setTemps(newTemps);
            
            let newDataset = [...dataset, {"temp": data.temperature, "time": secs}]
            setData(newDataset);
            console.log(newDataset)
        });

        return () => {
            socket.off("sensor_data");
        }

    }, [dataset])

    return (
        <Box p={2} sx={{display: 'flex', flexDirection: 'column'}}>
            <h3>Temperature</h3>
            <LineChart
                // xAxis={[
                //     {
                //     dataKey: 'time',
                //     valueFormatter: (value) => value.toString(),
                //     // min: 1985,
                //     // max: 2022,
                //     },
                // ]}
                // series={Object.keys(keyToLabel).map((key) => ({
                //     dataKey: key,
                //     label: keyToLabel[key],
                //     color: colors[key],
                //     // showMark: false,
                //     // ...stackStrategy,
                //   }))}
                // dataset={dataset}
                xAxis={[{ data: dataset }]}
                series={[
                    {
                    data: temps,
                    area: true,
                    },
                ]}
                {...customize}
            />
        </Box>
    );
}