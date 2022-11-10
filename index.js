require("colors");
const port = process.env.PORT || 5000;

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const { MongoClient, ObjectId } = require("mongodb");
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
const Reviews = client.db("lensExpert").collection("reviews");

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

app.get("/services", async (req, res) => {
  try {
    const cursor = Services.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: services,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/service-details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await Services.findOne(query);
    res.send(service);
    console.log(id);
  } catch {
    (err) => console.log(err);
  }
});

app.post("/reviews", async (req, res) => {
  try {
    const result = await Reviews.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't post the review",
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

app.get("/reviewsbyid/:_id", async (req, res) => {
  try {
    const id = req.params._id;
    console.log(id);
    const query = {
      serviceId: id,
    };
    const cursor = Reviews.find(query);
    const reviewById = await cursor.sort({ addedTimeEncrypted: -1 }).toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: reviewById,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("Server is running".cyan, port);
});

// Name : lensExpertDb
// Password : VOXSLchKpZCxjrFv
