const { markConnected } = require("../reconnection")

module.exports = async (orcaInstance) => {
    console.log(`[Socket] 🟢 Connecté au Manager (Socket ID: ${orcaInstance.socket.id})`);

    orcaInstance.isTarTar = true

    const attempts = markConnected()

    console.log("Config demander")
    orcaInstance.socket.emit("request_config");

    if (attempts !== null) await orcaInstance.logger.sendRecoGood(attempts)
};
