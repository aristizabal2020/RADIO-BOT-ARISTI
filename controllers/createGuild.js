const saveGuild = require("../models/guilds");

async function createGuild(guild, channel) {

  let query = { guildId: guild.id };
  const data = await saveGuild.findOne(query);

  if (!data) {

    let newGuild = new saveGuild({
      guildId: guild.id,
      guildName: guild.name,
      memberCount: guild.memberCount,
      guildDescription: guild.description,
      ownerGuildId: guild.ownerId,
      isActivated: true,
      guildCreatedAt: guild.createdTimestamp
    });

    if(channel){
      newGuild.channelId = channel;
    }

    console.log(`El bot se ha unido a la guild: ${guild.name} con ${guild.memberCount} usuarios.`);

    await newGuild.save();

    return newGuild;


  } else {

    await saveGuild.findOneAndUpdate(
      query,
      {
        guildName: guild.name,
        memberCount: guild.memberCount,
        guildDescription: guild.description,
        ownerGuildId: guild.ownerId,
        isActivated: true,
        timestamp: Date.now(),
      });
      console.log("Guild actualizada: ", guild.name)

  }

}

module.exports = { createGuild }; 