module.exports.id = "2"

module.exports.execute = async (interaction, metadata) => {
    interaction.client.requestConfig()

    await interaction.reply("Demande de nouvelle config envoyer")
}
