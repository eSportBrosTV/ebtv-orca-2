class CommandError extends Error {
    constructor(message, code) {
        super(message)
        this.name = "CommandError"
        this.code = code
    }
}

module.exports = {
    CommandError
}
