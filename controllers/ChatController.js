const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");
const Conv = require("../models/ConversationModel");

function iniateSockets(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: false,
      transports: ["websocket", "polling"],
      allowEIO3: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("connection");

    socket.on("send-message", (message) => {
      const msg = message;
      Stringy;
      console.log("====================================");
      console.log(`Message: ${msg}`);
      console.log("====================================");
    });

    socket.on("disconnect", (message) => {
      console.log("Disconnect");
    });

    socket.on("", (message) => {});
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
}

module.exports = iniateSockets;
