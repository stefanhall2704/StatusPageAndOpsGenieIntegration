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
  const [componentIds, setComponentIds] = useState([]);


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

        // Get component data directly from the response
        const componentData = response.data.components || [];
        // Filter and get unique affected component IDs and their names
        const uniqueComponentData = Array.from(
          new Set(componentData.map((component) => component.id))
        ).map((uniqueId) => {
          const componentWithStatus = componentData.find(
            (component) => component.id === uniqueId
          );
          return {
            id: uniqueId,
            name: componentWithStatus.name,
            status: componentWithStatus.status, // Include status
          };
        });
        const componentIDs = Array.from(
          new Set(componentData.map((component) => component.id))
        );
        setComponentIds(componentIDs);
        setAffectedComponents(uniqueComponentData);

        // Initialize componentStatuses with default values for each component
        const defaultComponentStatuses = {};
        uniqueComponentData.forEach((component) => {
          defaultComponentStatuses[component.id] = component.status; // Set status as default
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


  const handleComponentStatusChange = (componentId, e) => {
    // Update the status of the selected component in componentStatuses
    setComponentStatuses((prevComponentStatuses) => ({
      ...prevComponentStatuses,
      [componentId]: e.target.value,
    }));
  };


  const updateStatusPageIncident = async (
    incidentStatus,
    impactOverride,
    componentIds,
    componentStatuses,
  ) => {

    let statusPageBody = {
      "incident": {
        "status": incidentStatus,
        "impact_override": impactOverride,
        "components": componentStatuses,
        "component_ids": componentIds,
      },
    };
    try {
      const apiKey = "OAuth d487df27-78b9-42b5-8f38-e1084f0ef665";
      const headers = {
        Authorization: apiKey,
        "Content-Type": "application/json",
      };
      const baseUrl = "https://api.statuspage.io/v1/pages/v8pxqxntb33r/incidents/";
      const apiURL = baseUrl.concat(incident_id);
      const response = await axios.patch(
        apiURL,
        statusPageBody,
        { headers: headers }
      );
      console.log("Status Page Incident Created:", response.data);
    } catch (error) {
      console.error("Error creating Status Page incident:", error);
      console.log("Response data:", error.response.data);
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    updateStatusPageIncident(incidentStatus, impactOverride, componentIds, componentStatuses);
    // You can send API requests to update the incident and component statuses here
    console.log("Updated Impact Override:", impactOverride);
    console.log("Updated Incident Status:", incidentStatus);
    console.log("Updated Component Statuses:", componentStatuses);
    console.log(componentIds);
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
                Select Affected Components:
              </label>

              {affectedComponents.length > 0 && (
                <div>
                  {affectedComponents.map((component) => (
                    <div key={component.id} className="mb-2">
                      <label htmlFor={`componentStatus_${component.id}`} className="block text-gray-600 font-bold mb-2">
                        {component.name} Status:
                      </label>
                      <select
                        id={`componentStatus_${component.id}`}
                        value={componentStatuses[component.id]}
                        onChange={(e) => handleComponentStatusChange(component.id, e)}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                      >
                        
                        <option value="under_maintenance">Under Maintenance</option>
                        <option value="degraded_performance">Degraded Performance</option>
                        <option value="partial_outage">Partial Outage</option>
                        <option value="operational">Operational</option>
                        <option value="major_outage">Major Outage</option>
                      </select>
                    </div>
                  ))}
                </div>
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
