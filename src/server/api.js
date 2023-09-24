const axios = require("axios");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());


app.post("/createOpsGenieIncident", async (req, res) => {
  try {
    const apiKey = `GenieKey ${process.env.OPSGENIE_API_KEY}`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };

    const opsGenieBody = {
      message: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      notifyStakeholder: req.body.notifications,
    };
    const response = await axios.post(
      "https://api.opsgenie.com/v1/incidents/create",
      opsGenieBody,
      { headers },
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error creating Opsgenie incident:", error);
    res
      .status(error.response?.status || 500)
      .json({ error: "Internal Server Error" });
  }
});


app.get("/getOpsGenieIncident", async (req, res) => {
  try {
    const apiKey = `GenieKey ${process.env.OPSGENIE_API_KEY}`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };
    const incidentTitle = req.query.message;
    const response = await axios.get(
      `https://api.opsgenie.com/v1/incidents?query=message:${incidentTitle}`,
      { headers },
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error creating Opsgenie incident:", error);
    res
      .status(error.response?.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

app.get("/getOpsGenieIncidentById", async (req, res) => {
  try {
    const opsGenieId = req.query.incidentId;
    const apiKey = `GenieKey ${process.env.OPSGENIE_API_KEY}`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      `https://api.opsgenie.com/v1/incidents/${opsGenieId}`,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Opsgenie incident data:", error);
    res
      .status(error.response?.status || 500)
      .json({ error: "Internal Server Error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
