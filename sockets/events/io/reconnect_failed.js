module.exports = async (orcaInstance) => {
    console.log(`[Socket] Reconnexion impossible arret du bot`);

    await orcaInstance.logger.sendRecoEchec()

    process.exit(1)
};