const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// To Read env File
require("dotenv").config();
require("./services/reminderCron");


const app = express();

// For frontend backend communication b/c both runs on different ports
app.use(cors());
app.use(express.json());
app.use("/auth", require("./routes/authRoutes"))
app.use("/routines", require("./routes/routineRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/reminders",require("./routes/reminderRoutes"));




app.get("/", (req, res) => {
  res.send("ProdMate Backend Running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Only run backend if DB is connected not before that
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });
