module.exports = async (orcaInstance) => {
    console.log(`[Socket] Reload Demander`);
    
    orcaInstance.socket.emit("request_config")
};