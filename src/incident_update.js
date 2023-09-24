import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


function IncidentUpdateForm() {
  const navigate = useNavigate();
  const { incident_id } = useParams();
  const [incidentData, setIncidentData] = useState(null);
  const [impactOverride, setImpactOverride] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("");
  const [componentStatuses, setComponentStatuses] = useState({});
  const [affectedComponents, setAffectedComponents] = useState([]);
  const [componentIds, setComponentIds] = useState([]);
  const [opsgenieIncidentStatus, setOpsgenieIncidentStatus] = useState("");
  const [opsgeniePriority, setOpsgeniePriority] = useState("");
  const [opsgenieIdInput, setOpsgenieIdInput] = useState("");


  useEffect(() => {
    const apiKey = `OAuth ${process.env.REACT_APP_STATUSPAGE_API_KEY}`;
    const apiUrl = `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents/${incident_id}`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };
  
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setIncidentData(response.data);
        if (response.data.impact_override !== null) {
          setImpactOverride(response.data.impact_override);
        } else {
          setImpactOverride(response.data.impact);
        }
        setIncidentStatus(response.data.status);
  
        const componentData = response.data.components || [];
        const uniqueComponentData = Array.from(
          new Set(componentData.map((component) => component.id))
        ).map((uniqueId) => {
          const componentWithStatus = componentData.find(
            (component) => component.id === uniqueId
          );
          return {
            id: uniqueId,
            name: componentWithStatus.name,
            status: componentWithStatus.status,
          };
        });
        const componentIDs = Array.from(
          new Set(componentData.map((component) => component.id))
        );
        setComponentIds(componentIDs);
        setAffectedComponents(uniqueComponentData);
  
        const defaultComponentStatuses = {};
        uniqueComponentData.forEach((component) => {
          defaultComponentStatuses[component.id] = component.status;
        });
        setComponentStatuses(defaultComponentStatuses);
  
        const queryParameters = new URLSearchParams(window.location.search);
        const opsGenieId = queryParameters.get("opsGenieId");
        fetchOpsgenieIncident(opsGenieId)
          .then(() => {
          })
          .catch((error) => {
            console.error("Error fetching Opsgenie incident data:", error);
          });
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
    setComponentStatuses((prevComponentStatuses) => ({
      ...prevComponentStatuses,
      [componentId]: e.target.value,
    }));
  };
  const handleOpsgenieIncidentStatusChange = (e) => {
    setOpsgenieIncidentStatus(e.target.value);
  };
  const handleOpsgenieIdInputChange = (e) => {
    setOpsgenieIdInput(e.target.value);
  };
  
  const handleLinkOpsgenieIncident = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    fetchOpsgenieIncident(opsgenieIdInput)
      .then(() => {
        navigate(`/update/incident/${incident_id}?opsGenieId=${opsgenieIdInput}`)
      })
      .catch((error) => {
        console.error("Error fetching Opsgenie incident data:", error);
      });
  };
  
  

  const fetchOpsgenieIncident = async (opsGenieId) => {
    try {
      const apiUrl = `http://localhost:5001/getOpsGenieIncidentById?incidentId=${opsGenieId}`;
      const response = await axios.get(apiUrl);
      const initialOpsgenieIncidentStatus = response.data.data.status;
      const initialOpsGenieIncidentPriority = response.data.data.priority;
      setOpsgenieIncidentStatus(initialOpsgenieIncidentStatus);
      setOpsgeniePriority(initialOpsGenieIncidentPriority);
      return response.data;
    } catch (error) {
      console.error("Error fetching Opsgenie incident data:", error);
      throw error;
    }
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
      const apiKey = `OAuth ${process.env.REACT_APP_STATUSPAGE_API_KEY}`;
      const headers = {
        Authorization: apiKey,
        "Content-Type": "application/json",
      };
      const baseUrl = `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents/`;
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
const handleOpsgeniePriorityChange = (e) => {
  setOpsgeniePriority(e.target.value);
};
const OpsGeniePriority = () => {
  return (
    <div className="mb-4">
      <label
        htmlFor="opsgeniePriority"
        className="block text-gray-600 font-bold mb-2"
      >
        Opsgenie Priority:
      </label>
      <select
      id="opsgeniePriority"
      value={opsgeniePriority}
      onChange={handleOpsgeniePriorityChange}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
    >
      <option value="P1">P1</option>
      <option value="P2">P2</option>
      <option value="P3">P3</option>
      <option value="P4">P4</option>
      <option value="P5">P5</option>
    </select>
  </div>
  )
};

const HandleManualOpsGenieIncidentLinking = () => {
  return (
    <div className="mb-4">
    <div className="mb-4">
    <input
      type="text"
      placeholder="Enter Opsgenie ID"
      value={opsgenieIdInput}
      onChange={handleOpsgenieIdInputChange}
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
    />
    </div>
    <div className="mb-4">
    <button
      className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-700"
      onClick={handleLinkOpsgenieIncident}
    >
      Link Opsgenie Incident
    </button>
    </div>
  </div>
  )
};

const OpsGenieIncidentControls = () => {
  return (
    <div className="mb-4">
      <label
        htmlFor="opsgenieIncidentStatus"
        className="block text-gray-600 font-bold mb-2"
      >
        Opsgenie Incident Status:
      </label>
      <select
        id="opsgenieIncidentStatus"
        value={opsgenieIncidentStatus}
        onChange={handleOpsgenieIncidentStatusChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
      >
        <option value="open">Open</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <OpsGeniePriority />
    </div>
  )
}

const OpsGenieIncidentStatusSelect = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const opsGenieId = queryParameters.get("opsGenieId");

  if (opsGenieId !== null) {
  return (
    <OpsGenieIncidentControls />
  )          
  } else {
    return (
      <HandleManualOpsGenieIncidentLinking />
    )
  }
}

  const IncidentImpact = () => {
    return (
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
    )
  }
  const StatusPageIncidentStatus = () => {
    return (
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
    )
  }

  const AffectedComponents = () => {
    return (
      
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
      
    )
  }

  const SubmitUpdateButton = () => {
    return (
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-700"
      >
        Update Incident
      </button>
    )
  }
  const SubmitUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
      <OpsGenieIncidentStatusSelect />
      <IncidentImpact />
      <StatusPageIncidentStatus />
      <div className="mb-4">
        <label
          htmlFor="componentStatus"
          className="block text-gray-600 font-bold mb-2"
        >
          Select Affected Components:
        </label>
        {affectedComponents.length > 0 && (
          <AffectedComponents />
        )}
      </div>
      <SubmitUpdateButton />
    </form>
    )
  }
  const BaseFormStructure = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Update Incident
      </h2>
      <SubmitUpdateForm />
    </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStatusPageIncident(incidentStatus, impactOverride, componentIds, componentStatuses);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      {incidentData && (
        <BaseFormStructure />
      )}
    </div>
  );
}

export default IncidentUpdateForm;
