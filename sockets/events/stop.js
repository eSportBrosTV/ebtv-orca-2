module.exports = async (orcaInstance, callback) => {
    console.log(`[Socket] Arret demander`);
    
    await orcaInstance.logger.sendEnd()

    callback({success: true})

    process.exit(0)
};