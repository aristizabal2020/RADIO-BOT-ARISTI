const { Client, GatewayIntentBits, Partials, Events, Collection, ActivityType } = require("discord.js");
const { createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  entersState,
  VoiceConnectionStatus } = require('@discordjs/voice');

require("dotenv").config();

const saveGuild = require("./models/guilds");

let { playRadio } = require("./commands/utility/join");
const { createGuild } = require("./controllers/createGuild");

const mongoose = require('mongoose');

const fs = require('node:fs');
const path = require('node:path');
const { channel } = require("node:diagnostics_channel");


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
let connection;
let connected = false;

// Crear el reproductor de audio
const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

//evento Nuevo Guild
client.on(Events.GuildCreate, async guild => {

  guild = guild;

  let Guild = await saveGuild.findOne({ guildId: guild.id });

  if(!Guild){
    
    Guild = createGuild(guild);

  }

  console.log("Guild evento create: ", Guild.guildName);

});

//evento del bot conectado y listo!
client.once(Events.ClientReady, async c => {

  console.log(`Bot conectado como ${c.user.tag}`);
  console.log(`${c.guilds.cache.size} Servidores`);

  c.user.setPresence({ activities: [{ name: '426FM', type: ActivityType.Streaming }], status: 'online' });
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
  
  // Obtén los IDs de los roles
  // const channelId = interaction.channelId;
  // if (channelId !== '1112547639397994560') return;

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {

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

// client.on("voiceStateUpdate", async (oldState, newState) => {
//   if (oldState.member.user.bot || newState.member.user.bot) return;

//   if (!oldState.channelId && newState.channelId) {
//     console.log("entra")
//     playRadio();
//   }

// });

player.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {

  console.log(`La conexión de voz fue desconectada (${newState.reason}).`);

  // Reconectar automáticamente si el motivo de la desconexión es 'EndpointMoved'
  if (newState.reason === 'EndpointMoved') {
    console.log('Intentando reconectar...');

    try {
      await entersState(player, VoiceConnectionStatus.Connecting, 5_000);
      console.log('Reconexión exitosa.');

      console.log('Reiniciando stream ausente')

      playRadio();

    } catch (error) {
      console.error('Error al intentar reconectar:', error);
    }
  }
});

player.on(VoiceConnectionStatus.Ready, async () => {

  console.log('Conexión de voz establecida.');

  // Iniciar la reproducción de audio aquí

  try {

    console.log('Reiniciando stream ausente');

    playRadio();

  } catch (error) {

    console.log(error);

  }
});

player.on(AudioPlayerStatus.Idle, async () => {

  try {

    const Guild = await saveGuild.findOne({ guildId: guild.id });

    console.log('Reiniciando stream ausente');

    playRadio(Guild.channelId, guild, player);

  } catch (error) {
    console.log(error);
  }
});



// async function playRadio() {

//   try {

//     connected = true;

//     connection = joinVoiceChannel({
//       channelId: '945430997875445794',
//       guildId: guild.id,
//       adapterCreator: guild.voiceAdapterCreator,
//     });

//     // Crear el recurso de audio con la URL de la radio
//     const resource = createAudioResource(RadioStreamURL);

//     // Reproducir el audio
//     connection.subscribe(player);
//     player.play(resource);

//     // Evento para verificar si el reproductor ha terminado de reproducir el audio
//     connection.on('error', (error) => {
//       console.error('Error al reproducir el audio:', error);
//     });

//   } catch (error) {

//     console.log(error);

//   }
// }

// function stopRadioStream() {

//   try {

//     connected = false;

//     connection = joinVoiceChannel({
//       channelId: '945430997875445794',
//       guildId: guild.id,
//       adapterCreator: guild.voiceAdapterCreator,
//     });

//     console.log(connection);

//     connection.destroy();

//   } catch (error) {

//     console.error("Error stopping radio stream:", error);

//   }
// }

client.login(process.env.TOKEN_BOT);


//enlace de invitacion del bot
//https://discord.com/api/oauth2/authorize?client_id=1115083732542558230&permissions=2150631424&scope=bot