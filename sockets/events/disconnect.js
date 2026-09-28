const { scheduleRetry } = require("../reconnection")

module.exports = async (orcaInstance, reason) => {
    console.log(`[Socket] Connexion avec TarTar perdu (Raison : ${reason})`);

    orcaInstance.isTarTar = false

    await orcaInstance.logger.sendDeco(reason)

    if (reason === "io server disconnect") await scheduleRetry(orcaInstance)
};
