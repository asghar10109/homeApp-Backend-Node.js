const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const propertyTenantRoutes = require("./routes/propertyTenantRoutes");
const rentaltracking = require("./routes/RentalTrackingRoutes");
const chatRoutes = require('./routes/chatRoutes');
const Auth = require("./middlewares/Authentication");
const dotenv = require("dotenv").config("./");
const path = require("path");
const { iniateSockets } = require("./controllers/ChatController");

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(cors());
app.use("/chat/api/", chatRoutes)
app.use("/user/api/", userRoutes);
app.use("/property/api/", Auth, propertyRoutes);
app.use("/property/tenant/api/", Auth, propertyTenantRoutes);
app.use("/rentaltracking/api/", rentaltracking);

iniateSockets(server);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.mongodb_url)
  .then((response) => {
    console.log(`Database Connected Successfully`);
  })
  .catch((error) => {
    console.log(`Database Disconnected ${error}`);
  });

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
