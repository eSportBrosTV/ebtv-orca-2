const catchHandler = (name, handler) => async (...args) => {
    try {
        await handler(...args)
    } catch (error) {
        console.error(`[${name}] Erreur non geree :`, error)
    }
}

module.exports = {
    catchHandler
}
