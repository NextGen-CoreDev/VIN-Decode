// vin-decoder-api/index.js

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// GET /decode/:vin - Decodes VIN using NHTSA API
app.get("/decode/:vin", async (req, res) => {
  const { vin } = req.params;

  if (!vin || vin.length < 11) {
    return res.status(400).json({ error: "Invalid VIN" });
  }

  try {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`
    );

    const data = response.data?.Results?.[0];
    const decoded = {
      vin,
      year: data.ModelYear,
      make: data.Make,
      model: data.Model,
      trim: data.Trim,
      drivetrain: data.DriveType,
      bodyStyle: data.BodyClass,
      engine: data.EngineModel,
    };

    res.json({ success: true, data: decoded });
  } catch (error) {
    res.status(500).json({ error: "Failed to decode VIN" });
  }
});

app.listen(PORT, () => {
  console.log(`VIN Decoder API is running on http://localhost:${PORT}`);
});
