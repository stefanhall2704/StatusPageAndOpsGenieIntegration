import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateIncidentPage from "./incident_form.js";
import IncidentUpdateForm from "./incident_update";
import AllIncidentsPage from "./incident_list";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AllIncidentsPage />,
  },
  {
    path: "create/incident",
    element: <CreateIncidentPage />,
  },
  {
    path: "update/incident/:incident_id",
    element: <IncidentUpdateForm />,
  },
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;