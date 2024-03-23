import OccupancyStatus from './OccupancyStatus'
import useSocketSetup from "./useSocketSetup"

function App() {
  useSocketSetup();

  return (
    <div className="center-content">
      <OccupancyStatus/>
      {/* <Data /> */}
    </div>
  )
}

export default App
