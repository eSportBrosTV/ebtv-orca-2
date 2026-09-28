const { SlashDeployer } = require("../../utils/SlashDeployer")

module.exports = async (client) => {
    console.log(`Prêt ! Connecter sous ${client.user.tag}`)
    await client.logger.sendReadyLog()

    try {
        await SlashDeployer.deploy(client)

        if(client.config.requireFirstDeploy) client.socket.emit('deployment_done')
    } catch (error) {
        console.error("[Deploy] Impossible de deployer les commandes", error)
    }
}