let attempts = 0
let connectedOnce = false
let retryTimer = null

const countAttempt = () => {
    attempts++
}

const markConnected = () => {
    const previousAttempts = connectedOnce ? attempts : null

    connectedOnce = true
    attempts = 0

    return previousAttempts
}

const getRetryDelay = (manager) => {
    const base = Math.min(manager.reconnectionDelay() * 2 ** attempts, manager.reconnectionDelayMax())
    const jitter = base * manager.randomizationFactor()

    return base - jitter + Math.random() * jitter * 2
}

const scheduleRetry = async (orcaInstance) => {
    if (retryTimer) return

    const manager = orcaInstance.socket.io

    if (attempts >= manager.reconnectionAttempts()) {
        console.log("[Socket] TarTar refuse toujours la connexion, arret du bot")

        await orcaInstance.logger.sendRecoEchec()

        process.exit(1)
    }

    const delay = getRetryDelay(manager)
    countAttempt()

    console.log(`[Socket] Nouvelle tentative de connexion ${attempts} dans ${Math.round(delay / 1000)}s`)

    retryTimer = setTimeout(() => {
        retryTimer = null
        orcaInstance.socket.connect()
    }, delay)
}

module.exports = {
    countAttempt,
    markConnected,
    scheduleRetry
}
