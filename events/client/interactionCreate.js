const { commandHandle } = require("../../handlers")
const { replyError } = require("../../utils/replyError")
const { ErrorCodes } = require("../../utils/ErrorCodes")

module.exports = async (interaction) => {
    if(!interaction.inGuild()) return

    if(interaction.guildId != interaction.client.config.serv) return

    if(!interaction.isCommand()) return

    if(!interaction.client.isTarTar){
        return replyError(interaction, "Je ne peut pas faire ce qui m'es demander sans TarTar ...", ErrorCodes.TARTAR_UNAVAILABLE)
    }

    await commandHandle(interaction)
}
