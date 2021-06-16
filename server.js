const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

// express set up

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
console.log("Starting server...")
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use("/get", require("./routes/getClips.js"))

app.use("/channel", require('./routes/getChannel.js'))