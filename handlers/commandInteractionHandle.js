const { CommandError } = require("../utils/CommandError")
const { ErrorCodes } = require("../utils/ErrorCodes")
const interactionErrorHandle = require("./interactionErrorHandle")

module.exports = async (interaction) => {
    try {
        const command = interaction.client.commands.get(interaction.commandName)

        if(!command) {
            throw new CommandError("Cette commande n'est pas disponible pour le moment ...", ErrorCodes.COMMAND_UNAVAILABLE)
        }

        await command.execute(interaction, command.metadata)
    } catch (error) {
        await interactionErrorHandle(interaction, error)
    }
}
