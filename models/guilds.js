const {Schema, model} = require("mongoose");

const guild = new Schema({
    guildId: {type: String, required: true},
    guildTag: {type: String, required: true},
    ownerId: {type: String, required: true},
    timestamp: { type: Date, default: Date.now },
})

module.exports = model("Guilds", guild);