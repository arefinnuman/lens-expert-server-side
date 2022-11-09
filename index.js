const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Lens Expert Server Is Running");
});

app.listen(port, () => {
  console.log("Server is running", port);
});
