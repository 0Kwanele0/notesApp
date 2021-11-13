const express = require("express");
const app = express();
const myroute = require("./routes/userRoutes");
const noteroute = require("./routes/notesRoute");
const auth = require("./middleware/auth");
const db = require("./database/db");
db();
app.use(express.json());
app.all("/api/*", auth);
app.use("/api/user", myroute);
app.use("/api/notes", noteroute);

const port = 3001;
app.listen(port, () => {
  console.log("Server Running");
});
