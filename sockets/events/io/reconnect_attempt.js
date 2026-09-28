const { countAttempt } = require("../../reconnection")

module.exports = (orcaInstance, attemptNumber) => {
    console.log(`[Socket] Tentative de reconexxion ${attemptNumber}`);

    countAttempt()
};
