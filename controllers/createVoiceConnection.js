const { joinVoiceChannel } = require('@discordjs/voice');

function createVoiceConnection(channel, guild) {
  CONNECTION = joinVoiceChannel({
    channelId: channel,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  return CONNECTION;
}

module.exports = { createVoiceConnection };