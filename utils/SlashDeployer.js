class SlashDeployer {
    static async deploy(client) {

        if (!client.isReady()) {
            throw new Error("Impossible de déployer : le bot n'est pas connecté.");
        }

        const commandsData = client.commands.map(cmd => cmd.slashData);

        console.log(`Envoi de ${commandsData.length} commandes à Discord...`);

        await client.application.commands.set([]);
        await client.application.commands.set(commandsData, client.config.serv);

        console.log(`Commandes deployé !`);
    }
}

module.exports = { SlashDeployer };
