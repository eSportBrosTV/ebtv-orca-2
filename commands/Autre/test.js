const { EmbedBuilder } = require("discord.js")

module.exports.id = "0"

module.exports.execute = async (interaction, metadata) => {
    const testEmbed = new EmbedBuilder()
        .setTitle("Test")
        .setColor("#ff8000")
        .setDescription("Petit test")
        .addFields([{
            name: "Meta commande",
            value: `${JSON.stringify(metadata)}`
        }])

    await interaction.reply({
        embeds: [testEmbed]
    })
}