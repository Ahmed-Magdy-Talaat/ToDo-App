const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = process.env.port || 5000;
const routes = require("./routes/DoRoute");
const cors = require("cors");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to mongo..."))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());
app.use(routes);
app.listen(PORT, () => console.log(`listen on port ${PORT}`));
