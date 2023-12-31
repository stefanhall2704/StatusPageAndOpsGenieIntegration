import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function IncidentTable({ data, title, itemsPerPage }) {
  const [expandedIncidentId, setExpandedIncidentId] = useState(null);
  const [filterImpact, setFilterImpact] = useState("");
  const [opsgenieIncidentData, setOpsgenieIncidentData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchOpsgenieData = async (incidentName) => {
      try {
        const opsgenieData = await fetchOpsgenieIncident(incidentName);
        setOpsgenieIncidentData((prevData) => ({
          ...prevData,
          [incidentName]: opsgenieData,
        }));
      } catch (error) {
        console.error("Error fetching Opsgenie incident:", error);
      }
    };
  
    data.forEach(async (incident) => {
      await fetchOpsgenieData(incident.name);
    });
  
  }, [data, filterImpact, searchTerm]);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  


  const totalPages = Math.ceil(data.length / itemsPerPage);

  const toggleCollapse = (incidentId) => {
    if (expandedIncidentId === incidentId) {
      setExpandedIncidentId(null);
    } else {
      setExpandedIncidentId(incidentId);
    }
  };

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

  const filteredData = data.filter((incident) => {
    if (filterImpact === "") {
      return true;
    }
    return incident.impact === filterImpact;
  });
  const update_url = (data, opsGenieId) => {
    if (opsGenieId) {
      return `/update/incident/${data.id}?opsGenieId=${opsGenieId}`;
    } else {
      return `/update/incident/${data.id}`;
    }
  };

  const fetchOpsgenieIncident = async (incidentName) => {
    try {
      const apiKey = `GenieKey ${process.env.REACT_APP_OPSGENIE_API_KEY}`;
      const headers = {
        Authorization: apiKey,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN}:5001/getOpsGenieIncident`,
        { params: { message: incidentName }, headers }
      );
      
      if (response.data.data && response.data.data.length > 0) {
        const incidentData = response.data.data[0];
        return incidentData;
      } else {
        console.warn("Opsgenie API Response is empty for:", incidentName);
        return null;
      }
    } catch (error) {
      console.error("Error fetching Opsgenie incident:", error);
      return null;
    }
  };
  const Filters = () => {
    return (
      <div className="mb-4 flex justify-between items-center">
      <div>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md"
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
        >
          <option value="">All Impacts</option>
          <option value="maintenance">Maintenance</option>
          <option value="critical">Critical</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
        <input
          type="text"
          placeholder="Incident Name..."
          className="ml-4 px-3 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
    )
  };

  const MainTableHeaders = () => {
    return (
      <thead>
      <tr>
        <th
          colSpan="8" 
          className="bg-blue-500 underline bold text-lg text-white py-2 px-3"
        >
          {title}
        </th>
      </tr>
      <tr className="bg-blue-500 text-white">
        <th className="py-2 px-3 text-left">Incident Name</th>
        <th className="py-2 px-3 text-left">Impact</th>
        <th className="py-2 px-3 text-left">Status</th>
        <th className="py-2 px-3 text-left">Created At</th>
        <th className="py-2 px-3 text-left">Resolved At</th>
        <th className="py-2 px-3 text-left">Updates</th>
        <th className="py-2 px-3 text-left">Status Page Incident</th>
        <th className="py-2 px-3 text-left">OpsGenie Incident</th>
      </tr>
    </thead>
    )
  };
  
  
  const searchedData = filteredData.filter((incident) => {
    if (searchTerm === "") {
      return true;
    }
    return incident.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const paginatedData = searchedData.slice(startIndex, endIndex);

  return (
    <div className="w-3/4 mx-auto rounded-lg overflow-hidden">
      <Filters />
      <table className="min-w-full bg-white border border-blue-200">
        <MainTableHeaders />
        <tbody>
          {paginatedData.map((incident) => (
            <React.Fragment key={incident.id}>
              <tr className={`border-t border-blue-200 hover:bg-gray-100`}>
                <td className="py-2 px-3 hover:underline">
                  <a href={update_url(incident, opsgenieIncidentData[incident.name]?.id || false)}>
                    {incident.name}
                  </a>
                </td>
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
                      ? "Collapse Updates"
                      : "Expand Updates"}
                  </button>
                </td>
                <td className="py-2 px-3">
                  <Link
                    to={`https://manage.statuspage.io/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents/${incident.id}`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Status Page Incident
                  </Link>
                </td>
                <td className="py-2 px-3">
                  {opsgenieIncidentData && opsgenieIncidentData[incident.name] ? (
                    <Link
                      to={`https://${process.env.REACT_OPSGENIE_DOMAIN}.app.opsgenie.com/incident/detail/${opsgenieIncidentData[incident.name].id}`}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OpsGenie Incident
                    </Link>
                  ) : (
                    "No OpsGenie Incident found"
                  )}
                </td>
              </tr>
              {expandedIncidentId === incident.id && (
                <tr>
                  <td colSpan="8">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Status Page Incident Updates
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
      <div className="pagination flex justify-between items-center pb-28 pt-5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function AllIncidentsPage() {
  const [unresolvedIncidents, setUnresolvedIncidents] = useState([]);
  const [resolvedIncidents, setResolvedIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = `OAuth ${process.env.REACT_APP_STATUSPAGE_API_KEY}`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };

    const unresolvedIncidentsUrl =
      `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents/unresolved`;
    const resolvedIncidentsUrl =
      `https://api.statuspage.io/v1/pages/${process.env.REACT_APP_STATUSPAGE_PAGE_ID}/incidents`;

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
      <h2 className="text-3xl flex justify-center">
        Incident Management System
      </h2>
      <div className="create-incident-container">
        <Link
          to="/create/incident"
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Incident
        </Link>
      </div>
      {unresolvedIncidents.length > 0 && (
        <>
          <IncidentTable
            data={unresolvedIncidents}
            title="Unresolved Incidents"
            itemsPerPage={10}
          />
        </>
      )}

      <IncidentTable 
        data={resolvedIncidents} 
        title="Resolved Incidents" 
        itemsPerPage={10} 
      />
    </div>
  );
}
