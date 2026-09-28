const { randomBytes } = require("crypto")
const { CommandError } = require("../utils/CommandError")
const { ErrorCodes } = require("../utils/ErrorCodes")
const { replyError } = require("../utils/replyError")

module.exports = async (interaction, error) => {
    const source = interaction.commandName ? `/${interaction.commandName}` : interaction.customId

    if (error instanceof CommandError) {
        console.log(`[Command] ${source} : ${error.message} (${error.code})`)

        return replyError(interaction, error.message, error.code)
    }

    const incident = randomBytes(3).toString("hex")

    console.error(`[Command] Erreur imprevue sur ${source} (incident ${incident}) :`, error)

    await replyError(interaction, "Une erreur est survenue pendant la commande", ErrorCodes.INTERNAL_ERROR, incident)

    await interaction.client.logger.sendCommandError(interaction, error, incident)
}
