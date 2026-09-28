const { EmbedBuilder } = require("discord.js");

class Logger {
  #client = null;

  constructor(client) {
    this.#client = client;
  }

  #getLogChannel() {
    return this.#client.channels.cache.get(this.#client.config?.logChannel);
  }

  async sendReadyLog() {
    const commandNumber = this.#client.commands.size.toString();

    const logReadyEmbed = new EmbedBuilder()
      .setTitle("En ligne")
      .setDescription(
        `Le bot est connecter sous le compte \`\`${this.#client.user.tag}\`\``
      )
      .setColor("#18e000")
      .setTimestamp()
      .setThumbnail(
        this.#client.user.avatarURL({
          extension: "png",
          size: 128,
        })
      )
      .setFooter({
        text: `O.R.C.A 2 v${process.env.BOT_VERSION || '???'}`
      })
      .addFields([
        {
          name: "Orga",
          value: this.#client.config.orga.name,
          inline: true,
        },
        {
          name: "Nb commande",
          value: commandNumber,
          inline: true,
        },
      ]);

    await this.#sendLog(logReadyEmbed, [], [this.#getConfigFile()]);
  }

  async sendHotReload() {
    const hotReloadLog = new EmbedBuilder()
      .setTitle("Hot Reload")
      .setDescription("Hot reload effectuer avec une nouvelle config")
      .setTimestamp()
      .setThumbnail("attachment://setting.png")
      .setColor("#E0612F")

    await this.#sendLog(hotReloadLog, ['./image/setting.png'], [this.#getConfigFile()])
  }

  async sendDeco(reason) {
    const decoEmbed = new EmbedBuilder()
      .setTitle("Connexion avec TarTar perdu")
      .setDescription("La connexion avec TarTar a etait perdu")
      .setColor("#BD0B00")
      .setThumbnail("attachment://error.png")
      .addFields([{
        name: "Raison",
        value: `\`\`${reason}\`\``
      }])
      .setTimestamp()

      await this.#sendLog(decoEmbed, ['./image/error.png'])
  }

  async sendRecoEchec() {
    const recoBadEmbed = new EmbedBuilder()
      .setTitle("Impossible de recuperer la connexion avec TarTar")
      .setDescription("TarTar ne repond plus O.R.C.A va s'arreter byebye :wave:")
      .setColor("#BD0B00")
      .setThumbnail("attachment://error.png")
      .setTimestamp()

      await this.#sendLog(recoBadEmbed, ['./image/error.png'])
  }

  async sendRecoGood(nbAtemp) {
    const recoGoodEmbed = new EmbedBuilder()
      .setTitle("Connexion avec TarTar recuperer")
      .setDescription("TarTar est de retour !")
      .setColor("#18e000")
      .setThumbnail("attachment://y.png")
      .addFields([{
        name: "Tentative",
        value: `${nbAtemp}`
      }])
      .setTimestamp()

      await this.#sendLog(recoGoodEmbed, ['./image/y.png'])
  }

  async sendCommandError(interaction, error, incident) {
    const source = interaction.commandName ? `/${interaction.commandName}` : `${interaction.customId}`;

    const commandErrorEmbed = new EmbedBuilder()
      .setTitle("Erreur de commande")
      .setDescription(`\`\`${String(error.message).slice(0, 1000)}\`\``)
      .setColor("#BD0B00")
      .setThumbnail("attachment://error.png")
      .addFields([
        {
          name: "Commande",
          value: source,
          inline: true,
        },
        {
          name: "Utilisateur",
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: "Salon",
          value: `<#${interaction.channelId}>`,
          inline: true,
        },
        {
          name: "Incident",
          value: incident,
          inline: true,
        },
      ])
      .setTimestamp()

    await this.#sendLog(commandErrorEmbed, ['./image/error.png'], [{
      name: "error.txt",
      attachment: Buffer.from(error.stack || String(error)),
    }])
  }

  async sendEnd(){
    const endEmbed = new EmbedBuilder()
      .setTitle("Arret demander par TarTar")
      .setDescription("TarTar m'as demander de m'arreter bye :wave:")
      .setColor("#BD0B00")
      .setTimestamp()

      await this.#sendLog(endEmbed)
  }

  async sendContainerStop(){
    const containerStopEmbed = new EmbedBuilder()
      .setTitle("Arret du conteneur")
      .setDescription("Le conteneur d'O.R.C.A a ete arrete, je m'arrete bye :wave:")
      .setColor("#BD0B00")
      .setTimestamp()

      await this.#sendLog(containerStopEmbed)
  }

  #getConfigFile() {
    return {
      name: "config.json",
      attachment: Buffer.from(JSON.stringify(this.#client.config, null, 2)),
    };
  }

  async #sendLog(embed, attach = [], followingFiles = []) {
    const dataSend = {
      embeds: [embed],
    };

    if (attach.length > 0) {
      let files = [];

      for (const img of attach) {
        let imgName = img.split("/").pop();

        files.push({
          name: imgName,
          attachment: img,
        });
      }

      dataSend.files = files;
    }

    try {
      const logChannel = this.#getLogChannel();

      if (!logChannel) {
        throw new Error("Salon de log introuvable");
      }

      await logChannel.send(dataSend);

      if (followingFiles.length > 0) {
        await logChannel.send({ files: followingFiles });
      }
    } catch (err) {
      console.error("[Logger] Impossible d'envoyer le log :", err.message);
    }
  }
}

module.exports = {
  Logger,
};
