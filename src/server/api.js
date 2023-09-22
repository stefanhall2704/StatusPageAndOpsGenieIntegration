const axios = require("axios");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.post("/createOpsGenieIncident", async (req, res) => {
  try {
    console.log("GOIOENRWOFIKDJNGKO");
    const apiKey = `GenieKey 2188fe89-117e-4a52-9e24-fbae62c4ed04`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
      // You can set other required headers here
    };

    const opsGenieBody = {
      message: req.body.title,
      description: req.body.description,
      priority: req.body.priority, // Fix the typo here
      notifyStakeholder: req.body.notifications,
    };
    console.log(`OpsGenieBody: ${opsGenieBody}`);
    const response = await axios.post(
      "https://api.opsgenie.com/v1/incidents/create",
      opsGenieBody, // Assuming your client sends the request body
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
    const apiKey = `GenieKey 2188fe89-117e-4a52-9e24-fbae62c4ed04`;
    const headers = {
      Authorization: apiKey,
      "Content-Type": "application/json",
      // You can set other required headers here
    };

    // Retrieve the incidentTitle from query parameters
    const incidentTitle = req.query.message;
    console.log(incidentTitle);

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





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
