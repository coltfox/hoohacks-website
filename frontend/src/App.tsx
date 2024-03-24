import Counter from './components/Counter'
import ToggleColorMode from './components/ToggleColorMode';
import useSocketSetup from "./useSocketSetup"
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { createContext, useContext, useMemo, useState } from "react"
// import TemperatureChart from "./components/TemperatureChart"
import LiveChart from './components/LiveChart';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SensorStatus from './components/SensorStatus';
import { Grid } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  useSocketSetup();

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: "100%",
              minWidth: "100%",
            }}
          >
            <ToggleColorMode/>
            {/* <Counter/> */}
            <SensorStatus />
            <Grid container columns={4}>
              <LiveChart title="Temperature" dataKey="temperature"/>
              <LiveChart title="Light" dataKey="light"/>
              <LiveChart title="CO2" dataKey="co2"/>
              <LiveChart title="Humidity" dataKey="humidity"/>
            </Grid>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
