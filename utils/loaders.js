const { readdirSync } = require("fs")
const { SlashCommandBuilder } = require("discord.js")
const { catchHandler } = require("./catchHandler")

const loadEvents = (botClient, dir = "./events/") => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));

        for (const event of events) {
            const evt = require(`../${dir}/${dirs}/${event}`)
            const evtName = event.split(".")[0]
            botClient.on(evtName, catchHandler(`Event ${evtName}`, evt))
            console.log(`[Event Loader] L'evenement ${evtName} est chargé !`)
        }
    })
}

const loadCommands = (botClient, dir = "./commands/") => {
  readdirSync(dir).forEach(dirs => {
      const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));

      for (const file of commands) {
          const commandModule = require(`../${dir}/${dirs}/${file}`);

          const configCmd = botClient.config.commands.find(c => c.id === commandModule.id);

          if (configCmd && configCmd.metadata && configCmd.metadata.active) {
              try {
                  const builder = commandModule.slashData || new SlashCommandBuilder();

                  builder.setName(configCmd.metadata.name.toLowerCase());
                  builder.setDescription(configCmd.metadata.description);

                  const finalCommand = {
                      id: commandModule.id,
                      slashData: builder,
                      metadata: configCmd.metadata,
                      execute: commandModule.execute
                  };

                  botClient.commands.set(finalCommand.slashData.name, finalCommand);
                  console.log(`[Command Loader] La commande /${finalCommand.slashData.name} est chargée !`);
              } catch (error) {
                  console.error(`[Command Loader] Ignore : ${file} (config invalide pour Discord)`, error.message);
              }
          } else {
              console.log(`Ignore : ${file} (Desactivee ou absente)`);
          }
      }
  });
};

module.exports = {
    loadEvents,
    loadCommands
}