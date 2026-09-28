const { SlashDeployer } = require("../../utils/SlashDeployer");

module.exports = async (orcaInstance, newConfig) => {
    console.log(`[Socket] Reception nouvelle config`);
    
    orcaInstance.setConfig(newConfig)

    console.log("[Socket] Config charger en memoire")

    orcaInstance.reloadCommands()

    if(orcaInstance.isReady()){
        console.log("[Socket] Hot reload redeploiment des commandes")

        await SlashDeployer.deploy(orcaInstance)

        await orcaInstance.logger.sendHotReload()
    }
};