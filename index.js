require("colors");
const port = process.env.PORT || 5000;

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://lensExpertDb:VOXSLchKpZCxjrFv@cluster0.rmm92lc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database is connected".yellow);
  } catch (error) {
    console.log(error.name.bgRed, error.message.blue);
  }
}
dbConnect();

const Services = client.db("lensExpert").collection("services");

app.get("/", (req, res) => {
  res.send("Lens Expert Server Is Running");
});

app.post("/services", async (req, res) => {
  try {
    const result = await Services.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// app.get("/services", (req, res) => {
//   res.send("Here is your data");
// });

app.listen(port, () => {
  console.log("Server is running".cyan, port);
});

// Name : lensExpertDb
// Password : VOXSLchKpZCxjrFv
