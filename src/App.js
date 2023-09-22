import "./App.css";
import IncidentTable from "./incident_list";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1 className="">Incident Management System</h1>
      <div className="create-incident-container"> {/* Use flex and justify-end to right-align */}
        <Link
          to="/create/incident"
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Incident
        </Link>
      </div>
      <IncidentTable />
    </div>
  );
}

export default App;
