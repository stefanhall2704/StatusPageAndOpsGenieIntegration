import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function IncidentTable({ data }) {
  const [expandedIncidentId, setExpandedIncidentId] = useState(null);
  const [filterImpact, setFilterImpact] = useState(""); // State for filtering by impact
  const [searchTerm, setSearchTerm] = useState(""); // State for searching by incident name

  const toggleCollapse = (incidentId) => {
    if (expandedIncidentId === incidentId) {
      setExpandedIncidentId(null);
    } else {
      setExpandedIncidentId(incidentId);
    }
  };

  // Function to format the date
  const formatDate = (dateTimeString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      month: "long",
      day: "2-digit",
      year: "numeric",
    };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString(undefined, options);
  };

  // Filter incidents by impact
  const filteredData = data.filter((incident) => {
    if (filterImpact === "") {
      return true; // No impact filter selected, show all incidents
    }
    return incident.impact === filterImpact;
  });

  // Search incidents by incident name
  const searchedData = filteredData.filter((incident) => {
    if (searchTerm === "") {
      return true; // No search term, show all incidents
    }
    return incident.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-3/4 mx-auto rounded-lg overflow-hidden">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Incident List
      </h2>
      <div className="mb-4 flex justify-between items-center">
        <div>
          {/* Filter by Impact Dropdown */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
          >
            <option value="">All Impacts</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Incident Name"
            className="ml-4 px-3 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Button to Create Incident (Now at top right) */}
        <Link
          to="/create/incident"
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Incident
        </Link>
      </div>
      <table className="min-w-full bg-white border border-blue-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-2 px-3 text-left">Incident Name</th>
            <th className="py-2 px-3 text-left">Impact</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-left">Created At</th>
            <th className="py-2 px-3 text-left">Resolved At</th>
            <th className="py-2 px-3 text-left">Updates</th>
            <th className="py-2 px-3 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {searchedData.map((incident) => (
            <React.Fragment key={incident.id}>
              <tr className="border-t border-blue-200">
                <td className="py-2 px-3">{incident.name}</td>
                <td className="py-2 px-3">{incident.impact}</td>
                <td className="py-2 px-3">{incident.status}</td>
                <td className="py-2 px-3">{formatDate(incident.created_at)}</td>
                <td className="py-2 px-3">
                  {formatDate(incident.resolved_at)}
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => toggleCollapse(incident.id)}
                    className="text-blue-500 hover:underline"
                  >
                    {expandedIncidentId === incident.id
                      ? "Collapse"
                      : "Updates"}
                  </button>
                </td>
                <td className="py-2 px-3">
                  <Link
                    to={`https://manage.statuspage.io/pages/v8pxqxntb33r/incidents/${incident.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
              {expandedIncidentId === incident.id && (
                <tr>
                  <td colSpan="7">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      {/* Display Incident Updates in a Table */}
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Incident Updates
                      </h3>
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="py-2 px-3 bg-gray-200 text-left">
                              Created At
                            </th>
                            <th className="py-2 px-3 bg-gray-200 text-left">
                              Update
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {incident.incident_updates.map((update) => (
                            <tr key={update.id}>
                              <td className="py-2 px-3 text-left">
                                {formatDate(update.created_at)}
                              </td>
                              <td className="py-2 px-3 text-left max-w-md">
                                {update.body}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AllIncidentsPage() {
  const [unresolvedIncidents, setUnresolvedIncidents] = useState([]);
  const [resolvedIncidents, setResolvedIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch unresolved and resolved incidents
    const apiKey = "OAuth d487df27-78b9-42b5-8f38-e1084f0ef665";
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };

    const unresolvedIncidentsUrl =
      "https://api.statuspage.io/v1/pages/v8pxqxntb33r/incidents/unresolved";
    const resolvedIncidentsUrl =
      "https://api.statuspage.io/v1/pages/v8pxqxntb33r/incidents";

    const fetchIncidents = (url, isResolved) => {
      fetch(url, {
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
          if (isResolved) {
            setResolvedIncidents(data);
          } else {
            setUnresolvedIncidents(data);
          }
        })
        .catch((error) => {
          setError(error);
        });
    };

    fetchIncidents(resolvedIncidentsUrl, true);
    fetchIncidents(unresolvedIncidentsUrl, false);
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {/* Display Unresolved Incidents table */}
      {unresolvedIncidents.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Unresolved Incidents
          </h2>
          <IncidentTable data={unresolvedIncidents} />
        </>
      )}

      {/* Display Resolved Incidents table */}
      {resolvedIncidents.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Resolved Incidents
          </h2>
          <IncidentTable data={resolvedIncidents} />
        </>
      )}
    </div>
  );
}