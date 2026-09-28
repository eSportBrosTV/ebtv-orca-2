const fs = require("fs");
const path = require("path");
const { io } = require("socket.io-client");
const { catchHandler } = require("../utils/catchHandler");

const socketInit = (orcaInstance) => {
  const managerUrl = process.env.MANAGER_URL || "http://localhost:3000";

  console.log("[Socket] Connexion a Tartar ...");

  const socket = io(`${managerUrl}/bots`, {
    auth: { token: process.env.TARTAR_TOKEN },
    path: '/socket/',
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5
  });

  /*socket.io.on("error", (error) => {
    console.log("[Socket ] Erreur de reseau :", error);
  });*/

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const eventName = file.split(".")[0];

    const eventHandler = require(`./events/${file}`);

    socket.on(eventName, catchHandler(`Socket ${eventName}`, (...args) => eventHandler(orcaInstance, ...args)));

    console.log(`[Socket] Evenement chargé : ${eventName}`);
  }

  const eventsIoPath = path.join(__dirname, "events/io");
  const eventIoFiles = fs
    .readdirSync(eventsIoPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventIoFiles) {
    const eventName = file.split(".")[0];

    const eventHandler = require(`./events/io/${file}`);

    socket.io.on(eventName, catchHandler(`Socket io ${eventName}`, (...args) => eventHandler(orcaInstance, ...args)));

    console.log(`[Socket] Evenement chargé : ${eventName}`);
  }

  return socket;
};

module.exports = {
  socketInit,
};
