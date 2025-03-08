// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
// initialize the express application
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
// static assets middleware - used to sent static assets 9CSS, Imgs and DOM malipulation JS) to the client
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
console.log('Mongo URI:', process.env.MONGO_URI); // Debugging line

// Import the Vegetable model
const Vegetable = require("./models/vegetable.js");

// body parser middleware: this function loads the req body and decodes it into req.body so we can access
// form data // Mount it along with our other middleware, ABOVE the routes
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /vegetables index route sends a page that lists all vegetables from the database
app.get("/vegetables", async (req, res) => {
    const allVegetables = await Vegetable.find({});
    console.log(allVegetables); // log the vegetables!
    res.render("vegetables/index.ejs", { vegetables: allVegetables });
});

// GET /vegetables/new
app.get("/vegetables/new", (req, res) => {
    res.render("vegetables/new.ejs"); // relative file path
});

app.get("/vegetables/:vegetableId", async (req, res) => {
  const foundVegetable = await Vegetable.findById(req.params.vegetableId);
  res.render("vegetables/show.ejs", { vegetable: foundVegetable });
});

// POST /vegetables Path used to receive form submissions
app.post("/vegetables", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    try {
        const newVegetable = await Vegetable.create(req.body);
        console.log("New vegetable saved:", newVegetable); // ✅ Logs the saved vegetable
        res.redirect("/vegetables"); // Redirect to the vegetables index page
    } catch (error) {
        console.error("Error saving vegetable:", error); // ❌ Logs errors
        res.status(500).send("Error saving vegetable");
    }
});

app.delete("/vegetables/:vegetableId", async (req, res) => {
  await Vegetable.findByIdAndDelete(req.params.vegetableId);
  res.redirect("/vegetables");
});

// GET /vegetables/:vegetableId/edit
app.get("/vegetables/:vegetableId/edit", async (req, res) => {
  const foundVegetable = await Vegetable.findById(req.params.vegetableId);
  res.render("vegetables/edit.ejs", { vegetable: foundVegetable });
});

// PUT /vegetables/:vegetableId
app.put("/vegetables/:vegetableId", async (req, res) => {
  console.log('Updated vegetable data:', req.body);
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  const updatedVegetable = await Vegetable.findByIdAndUpdate(req.params.vegetableId, req.body, { new: true });
  console.log('Updated vegetable:', updatedVegetable);

  res.redirect(`/vegetables/${req.params.vegetableId}`);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
