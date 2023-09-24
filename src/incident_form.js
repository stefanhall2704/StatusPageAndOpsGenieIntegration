import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function IncidentForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("");
  const [componentIds, setComponentIds] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [outageType, setOutageType] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = `OAuth ${process.env.REACT_APP_STATUSPAGE_API_KEY}`;
    const apiUrl = `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/components`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };
    fetch(apiUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setComponents(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleImpactChange = (e) => {
    setImpact(e.target.value);
  };

  const handleOutageTypeChange = (e) => {
    setOutageType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const createStatusPageIncident = async (
    title,
    description,
    impact,
    componentIds,
    notifications,
    outageType,
    status,
    priority
  ) => {
    let componentOutageMap = {};
    for (let i = 0; i < componentIds.length; i++) {
      componentOutageMap[componentIds[i]] = outageType;
    }
    let statusPageBody = {
      incident: {
        name: title,
        status: status,
        impact_override: impact,
        scheduled_remind_prior: false,
        auto_transition_to_maintenance_state: false,
        auto_transition_to_operational_state: false,
        scheduled_auto_in_progress: false,
        scheduled_auto_completed: false,
        auto_transition_deliver_notifications_at_start: false,
        auto_transition_deliver_notifications_at_end: false,
        reminder_intervals: "[3, 6, 12, 24]",
        metadata: {},
        deliver_notifications: notifications,
        auto_tweet_at_beginning: false,
        auto_tweet_on_completion: false,
        auto_tweet_on_creation: false,
        auto_tweet_one_hour_before: false,
        body: description,
        components: componentOutageMap,
        component_ids: componentIds,
        scheduled_auto_transition: false,
      },
    };
    try {
      const apiKey = `OAuth ${process.env.REACT_APP_STATUSPAGE_API_KEY}`;
      const headers = {
        Authorization: apiKey,
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents`,
        statusPageBody,
        { headers: headers }
      );
      console.log("Status Page Incident Created:", response.data);
      const opsGenieFormData = {
        title: title,
        description: description,
        priority: priority,
        notifications: notifications,
      };
      const opsGenieResponse = await axios.post(
        "http://localhost:5001/createOpsGenieIncident",
        opsGenieFormData
      );
      console.log("OpsGenie Incident Created:", opsGenieResponse.data);
    } catch (error) {
      console.error("Error creating Status Page incident:", error);
      console.log("Response data:", error.response.data);
    }
  };

  const IncidentTitle = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="title"
        className="block text-gray-600 font-bold mb-2"
      >
        Title:
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={handleTitleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      />
    </div>
    )
  };
  const IncidentDescription = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="description"
        className="block text-gray-600 font-bold mb-2"
      >
        Description:
      </label>
      <textarea
        id="description"
        value={description}
        onChange={handleDescriptionChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      />
    </div>
    )
  };
  const OpsGeniePriority = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="priority"
        className="block text-gray-600 font-bold mb-2"
      >
        Priority:
      </label>
      <select
        id="priority"
        value={priority}
        onChange={handlePriorityChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      >
        <option value="" disabled>
          Select priority
        </option>
        <option value="P1">P1</option>
        <option value="P2">P2</option>
        <option value="P3">P3</option>
        <option value="P4">P4</option>
        <option value="P5">P5</option>
      </select>
    </div>
    )
  }
  const IncidentImpact = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="impact"
        className="block text-gray-600 font-bold mb-2"
      >
        Impact:
      </label>
      <select
        id="impact"
        value={impact}
        onChange={handleImpactChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      >
        <option value="" disabled>
          Select impact
        </option>
        <option value="maintenance">Maintenance</option>
        <option value="minor">Minor</option>
        <option value="major">Major</option>
        <option value="critical">Critical</option>
      </select>
    </div>
    )
  };

  const AffectedComponents = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="componentIds"
        className="block text-gray-600 font-bold mb-2"
      >
        Select Components (Ctrl+Click for multiple):
      </label>
      <select
        id="componentIds"
        multiple
        value={componentIds}
        onChange={(e) =>
          setComponentIds(
            [...e.target.selectedOptions].map((option) => option.value)
          )
        }
        className="w-full h-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      >
        {components.map((component) => (
          <option key={component.id} value={component.id}>
            {component.name}
          </option>
        ))}
      </select>
    </div>
    )
  };
  const SendNotifications = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="notifications"
        className="block text-gray-600 font-bold mb-2"
      >
        Send Notifications?
      </label>
      <input
        type="checkbox"
        id="notifications"
        checked={notifications}
        onChange={() => setNotifications(!notifications)}
        className="mr-2 leading-tight"
      />
      <span className="text-gray-700">Yes</span>
    </div>
    )
  };
  const OutageType = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="outageType"
        className="block text-gray-600 font-bold mb-2"
      >
        Outage Type:
      </label>
      <select
        id="outageType"
        value={outageType}
        onChange={handleOutageTypeChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      >
        <option value="" disabled>
          Select outage type
        </option>
        <option value="operational">Operational</option>
        <option value="under_maintenance">Under Maintenance</option>
        <option value="degraded_performance">Degraded Performance</option>
        <option value="partial_outage">Partial Outage</option>
        <option value="major_outage">Major Outage</option>
      </select>
    </div>
    )
  };
  const Status = () => {
    return (
      <div className="mb-4">
      <label
        htmlFor="status"
        className="block text-gray-600 font-bold mb-2"
      >
        Status:
      </label>
      <select
        id="status"
        value={status}
        onChange={handleStatusChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        required
      >
        <option value="" disabled>
          Select status
        </option>
        <option value="investigating">Investigating</option>
        <option value="identified">Identified</option>
        <option value="monitoring">Monitoring</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
    )
  };

  const IncidentCreationSubmitButton = () => {
    return (
      <button
      type="submit"
      className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-700"
    >
      Create Incident
    </button>
    )
  };

  const CreateIncidentForm = () => {
    return (
      <form onSubmit={handleSubmit}>
      <IncidentTitle />
      <IncidentDescription />
      <OpsGeniePriority />
      <IncidentImpact />
      <AffectedComponents />
      <SendNotifications />
      <OutageType />
      <Status />
      <IncidentCreationSubmitButton />
    </form>
    )
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createStatusPageIncident(
      title,
      description,
      impact,
      componentIds,
      notifications,
      outageType,
      status,
      priority
    );
    navigate("/");
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create Incident
        </h2>
        <CreateIncidentForm />
      </div>
    </div>
  );
}

function CreateIncidentPage() {
  return (
    <div>
      <IncidentForm />
    </div>
  );
}

export default CreateIncidentPage;
