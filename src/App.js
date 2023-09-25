import './App.css';
import { authProvider } from './authProvider';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
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

 
 <AzureAD provider={authProvider} forceLogin={true}>
  {
    
    ({login, logout, authenticationState, error, accountInfo}) => {
      switch (authenticationState) {
        case AuthenticationState.Authenticated:
          return (
            <div>
            <div>
              <span>Welcome, {accountInfo.account.userName}!</span>
              <button 
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={logout}>Logout</button>
              </div>
              <AzureAD provider={authProvider}>
            <RouterProvider router={router} />
            </AzureAD>
            </div>
            
          );
        case AuthenticationState.Unauthenticated:
          return (
            <div>
              {error && <p><span>An error occured during authentication, please try again!</span></p>}
              <p>
                <span>Hey stranger, you look new!</span>
                <button 
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={login}>Login</button>
              </p>
            </div>
          );
        case AuthenticationState.InProgress:
          return (<p>Authenticating...</p>);
      }
    }
  }
</AzureAD>
    </div>
  );
}
export default App;