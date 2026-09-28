const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { loadEvents, loadCommands } = require("./utils/loaders");
const { Logger } = require("./utils/Logger");
const { socketInit } = require("./sockets/socketClient");

var instance = null;

class Orca extends Client {
  socket = null;
  commands = null;
  config = null;
  logger = null;
  isTarTar = false

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });
    this.commands = new Collection();
    this.logger = new Logger(this);
  }

  setConfig(newConfig) {
    this.config = newConfig;
  }

  reloadCommands() {
    this.commands.clear()
    loadCommands(this)
  }

  requestConfig() {
    this.socket.emit("request_config");
  }

  async #waitConfig() {
    return new Promise((resolve, reject) => {
      this.socket = socketInit(this);

      const timeout = setTimeout(() => {
        reject(new Error("Tartar n'as pas envoyé de config"));
      }, 15000);

      this.socket.once("update_config", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  async start(token) {
    try {
      await this.#waitConfig()

      loadEvents(this);

      await this.login(token);
    } catch (err) {
      console.error("[Orca] Echec lors du demarage :", err)
      process.exit(1)
    }
  }

  /**
   *
   * @returns {Orca}
   */
  static getInstance() {
    if (instance == null) {
      instance = new Orca();
    }

    return instance;
  }
}

module.exports = {
  Orca,
};
