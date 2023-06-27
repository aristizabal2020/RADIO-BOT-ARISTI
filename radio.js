const { Client, GatewayIntentBits, Partials, Events, Collection, ActivityType } = require("discord.js");
const { createAudioPlayer,
  AudioPlayerStatus,
  NoSubscriberBehavior } = require('@discordjs/voice');
  
//config
require("dotenv").config();
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
const { channel } = require("node:diagnostics_channel");

//models
const saveGuild = require("./models/guilds");

//controllers
let { playRadio } = require("./commands/utility/join");
const { createGuild } = require("./controllers/createGuild");

//CLIENT DISCORD.JS
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

//conectar base de datos
mongoose
  .connect(process.env.MONGO_DB_TOKEN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
  })
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


  // Comandos FS de DiscordJS
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

let guild;
let connected;

// Crear el reproductor de audio
const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

//Evento Nuevo Guild
client.on(Events.GuildCreate, async guildCreate => {

  guild = guildCreate;

  const Guild = await saveGuild.findOne({ guildId: guildCreate.id });    

    createGuild(guildCreate);

  console.log("Guild evento create: ", guildCreate.name);

});

//evento Guild abandona
client.on(Events.GuildDelete, async guildDelete => {   

  const guildUpdated = await saveGuild.findOneAndUpdate(
    { guildId: guildDelete.id },
    {
      isActivated: false
    });

  console.log("Guild evento delete: ", guildDelete.name);

});

//evento del bot conectado y listo!
client.once(Events.ClientReady, async c => {

  console.log(`Bot conectado como ${c.user.tag}`);
  console.log(`${c.guilds.cache.size} Servidores`);

  c.user.setPresence({ activities: [{ name: '426FM.com', type: ActivityType.Listening }], status: 'online' });

  //arranca automáticamente el bot si está en un canal de voz después de un reinicio
  c.guilds.cache.forEach((guildSearched) => {

    const botVoiceState = guildSearched.voiceStates.cache.get(client.user.id);
    if (botVoiceState && botVoiceState.channel) {
      // const channelId = botVoiceState.channel.id;
      connected = true;
      guild = guildSearched;
      playRadio(guildSearched, player);
      console.log(`Reproduciento automáticamente en: '${guildSearched.name}'`);
    } else {
      guild = guildSearched;
      console.log(`El bot no está en ningún canal de audio en la guild '${guildSearched.name}'`);
    }
  });


});

//evento interaction creada
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return;
  
  const command = interaction.client.commands.get(interaction.commandName);
  
  guild = interaction.guild;

  let Guild = await saveGuild.findOne({ guildId: interaction.guildId });

  if(!Guild){

    Guild = createGuild(interaction.guild);

  }
  
  const roles = interaction.member.roles.cache;

  const roleIds = roles.map(role => role.id);

  if(!roleIds.includes(Guild.roleAdminId) && Guild.roleAdminId ) return;

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {

    if( command.data.name === 'join') {connected = true};
    if( command.data.name === 'stop') {connected = false};

    await command.execute(interaction, client, player);

  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

//cuando la conexión es ausente intenta reestablecer hasta encontrarla nuevamente
player.on(AudioPlayerStatus.Idle, async () => {

  try {
    

    if(!connected) return;

    client.guilds.cache.forEach((guildSearched) => {
      if (guildSearched.id == guild.id) {
        playRadio(guildSearched, player);
        console.log(`Reproduciendo ausente en: '${guild.name}'`);
      } 
    });


  } catch (error) {
    console.log(error);
  }
});



client.login(process.env.TOKEN_BOT);