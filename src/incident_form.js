import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//const config = require("./config.js");

function IncidentForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("");
  const [componentIds, setComponentIds] = useState([]);
  const [notifications, setNotifications] = useState(false); // Updated to a boolean
  const [outageType, setOutageType] = useState("");
  const [status, setStatus] = useState("");
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Statuspage components when the component mounts
    // Replace 'your-api-key-goes-here' and 'your-page-id' with your actual API key and page ID

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

  const handleImpactChange = (e) => {
    setImpact(e.target.value);
  };

  const handleOutageTypeChange = (e) => {
    setOutageType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const createOpsGenieIncident = async (title, description) => {
    try {
      const response = await axios.post("OPS_GENIE_API_URL", {
        title,
        description,
        // Other required fields for OpsGenie
      });
      console.log("OpsGenie Incident Created:", response.data);
    } catch (error) {
      console.error("Error creating OpsGenie incident:", error);
    }
  };

  const createStatusPageIncident = async (
    title,
    description,
    impact,
    componentIds,
    notifications,
    outageType,
    status
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
        scheduled_for: "2023-09-16T04:00:00Z",
        scheduled_until: "2023-09-16T18:00:00Z",
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
      console.log("Status Page Body:", statusPageBody);
      const response = await axios.post(
        `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents`,
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

    // TODO: Handle form submission and create incidents
    console.log("Title:", title);
    console.log("Description:", description);
    createOpsGenieIncident(title, description);
    createStatusPageIncident(
      title,
      description,
      impact,
      componentIds,
      notifications,
      outageType,
      status
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
        <form onSubmit={handleSubmit}>
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
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="verifying">Verifying</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-700"
          >
            Create Incident
          </button>
        </form>
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
