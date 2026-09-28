const { scheduleRetry } = require("../reconnection")

module.exports = async (orcaInstance, error) => {
    if (orcaInstance.socket.active) return

    console.log(`[Socket] Connexion refusee par TarTar : ${error.message}`);

    await scheduleRetry(orcaInstance)
};
