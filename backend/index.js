const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["https://projectly-xi.vercel.app/login", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],    
  credentials: true                              
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
