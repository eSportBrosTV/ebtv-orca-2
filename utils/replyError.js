const { EmbedBuilder } = require("discord.js")

const replyError = async (interaction, message, code = null, incident = null) => {
    const errorEmbed = new EmbedBuilder()
        .setTitle("Erreur")
        .setDescription(message)
        .setColor("#BD0B00")
        .setThumbnail("attachment://error.png")

    if (code) {
        errorEmbed.setFooter({
            text: incident ? `Code : ${code} | Incident : ${incident}` : `Code : ${code}`
        })
    }

    const payload = {
        embeds: [errorEmbed],
        files: [{
            name: "error.png",
            attachment: "./image/error.png"
        }]
    }

    try {
        if (interaction.replied) {
            await interaction.followUp(payload)
        } else if (interaction.deferred) {
            await interaction.editReply(payload)
        } else {
            await interaction.reply(payload)
        }
    } catch (error) {
        console.error("[Command] Impossible d'afficher l'erreur a l'utilisateur :", error.message)
    }
}

module.exports = {
    replyError
}
