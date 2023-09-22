import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function IncidentUpdateForm() {
  const { incident_id } = useParams();
  const [incidentData, setIncidentData] = useState(null);
  const [impactOverride, setImpactOverride] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("");
  const [componentStatuses, setComponentStatuses] = useState({});
  const [affectedComponents, setAffectedComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");

  useEffect(() => {
    // Fetch incident data for the specified incident_id
    const apiKey = "OAuth d487df27-78b9-42b5-8f38-e1084f0ef665";
    const apiUrl = `https://api.statuspage.io/v1/pages/v8pxqxntb33r/incidents/${incident_id}`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setIncidentData(response.data);
        setImpactOverride(response.data.impact_override);
        setIncidentStatus(response.data.status);

        // Extract affected components from incident updates
        const affectedComponentsData = response.data.incident_updates.map(
          (update) => update.affected_components
        );

        // Flatten the array of affected components into a single array
        const flattenedComponents = [].concat(...affectedComponentsData);

        // Filter and get unique affected component IDs
        const uniqueComponentIds = [
          ...new Set(flattenedComponents.map((component) => component.code)),
        ];

        setAffectedComponents(uniqueComponentIds);

        // Initialize componentStatuses with default values for each component
        const defaultComponentStatuses = {};
        uniqueComponentIds.forEach((componentId) => {
          defaultComponentStatuses[componentId] = ""; // You can set a default status here if needed
        });
        setComponentStatuses(defaultComponentStatuses);
      })
      .catch((error) => {
        console.error("Error fetching incident data:", error);
      });
  }, [incident_id]);
  const handleIncidentStatusChange = (e) => {
    setIncidentStatus(e.target.value);
  };
  const handleImpactOverrideChange = (e) => {
    setImpactOverride(e.target.value);
  };



  const handleComponentSelectChange = (event) => {
    // Ensure that selectedComponent is set to a valid value
    setSelectedComponent(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Update the status of the selected component in componentStatuses
    setComponentStatuses((prevComponentStatuses) => ({
      ...prevComponentStatuses,
      [selectedComponent]: componentStatuses[selectedComponent] || '', // Use the current status as default
    }));
  
    // You can send API requests to update the incident and component statuses here
    console.log("Updated Impact Override:", impactOverride);
    console.log("Updated Incident Status:", incidentStatus);
    console.log("Updated Component Statuses:", componentStatuses);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      {incidentData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Update Incident
          </h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <label
                htmlFor="impactOverride"
                className="block text-gray-600 font-bold mb-2"
              >
                Impact Override:
              </label>
              <select
                id="impactOverride"
                value={impactOverride}
                onChange={handleImpactOverrideChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="maintenance">Maintenance</option>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="incidentStatus"
                className="block text-gray-600 font-bold mb-2"
              >
                Incident Status:
              </label>
              <select
                id="incidentStatus"
                value={incidentStatus}
                onChange={handleIncidentStatusChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
              >
                <option value="investigating">Investigating</option>
                <option value="identified">Identified</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="verifying">Verifying</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="componentStatus"
                className="block text-gray-600 font-bold mb-2"
              >
                Select Affected Component:
              </label>

              {affectedComponents.length > 0 && (
                <select
                  id="componentStatus"
                  value={selectedComponent} // Remove the || "" here
                  onChange={handleComponentSelectChange}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select a Component
                  </option>
                  {affectedComponents.map((componentId) => (
                    <option key={componentId} value={componentId}>
                      {componentId}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-700"
            >
              Update Incident
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default IncidentUpdateForm;
