const {Schema, model} = require("mongoose");

const guild = new Schema({
    guildId: {type: String, required: true},
    guildName: {type: String, required: true},
    channelId: {type: String, default: '', required: false},
    memberCount: {type: Number, required: true},
    guildDescription: {type: String, default: '', required: false},
    ownerGuildId: {type: String, required: true},
    roleAdminId: {type: String, required: false},
    isActivated: {type: Boolean, required: false},
    guildCreatedAt: {type: Date, required: false},
    timestamp: { type: Date, default: Date.now },
});

module.exports = model("Guilds", guild);