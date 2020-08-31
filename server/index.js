const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("API RUNNING SCOKET.IO");
});

app.listen(5000, () => console.log("Srever is running at port 5000"));
