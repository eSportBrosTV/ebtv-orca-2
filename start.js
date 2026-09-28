require('dotenv').config();
const { Orca } = require("./orca");

const orca = Orca.getInstance();

process.on("unhandledRejection", (err) => {
    console.error("[Process] Promesse rejetee non geree :", err);
});

process.on("SIGTERM", async () => {
    console.log("[Process] Signal d'arret recu, arret du bot");

    await orca.logger.sendContainerStop();

    process.exit(0);
});

async function startBot() {
    try {
        await orca.start(process.env.DIS_TOKEN);
        
        console.log('[Start] Démarrage termine !');
    } catch (err) {
        console.error('[Start] Erreur lors du démarrage :', err);
        
        process.exit(1); 
    }
}

startBot();