const { Client, GatewayIntentBits, Partials, Events, Collection } = require("discord.js");
const { createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  entersState,
  VoiceConnectionStatus } = require('@discordjs/voice');

require("dotenv").config();

const mongoose = require('mongoose');

const { Prefix, RadioStreamURL } = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');


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
  useUnifiedTopology: true
})
.then(() =>{
  console.log("Conectado a MongoDB");
})
.catch((err) =>{
  console.log=(err);
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

// client.on('ready', async () => {

//   guild = await client.guilds.fetch(process.env.GUILD_ID);

//   console.log(`Bot conectado como ${client.user.tag}`);

//   // playRadio();

// });

client.once(Events.ClientReady, async c => {

	guild = await client.guilds.fetch(process.env.GUILD_ID);

  console.log(`Bot conectado como ${c.user.tag}`);

	c.user.setPresence({ activities: [{ name: '426FM' }], status: 'online' });
});

client.on(Events.GuildCreate, guild => {

  // Obtén el ID de la guild recién agregada

  guild = guild.id;

  console.log(`El bot se ha unido a la guild con ID: ${guild}`);

});

// client.on('messageCreate', async (message) => {

//   if (!message.content.startsWith(Prefix) || message.author.bot) return;

//   const args = message.content.slice(Prefix.length).trim().split(/ +/);
//   const command = args.shift().toLowerCase();

//   if (command === 'join') {
//     if (!message.member.voice.channel) {
//       return message.reply('Debes unirte a un canal de voz primero.');
//     }

//     playRadio();
//     connected = true;

//     console.log("Radio On")

//     message.reply('Radio on.');

//   }
//   //Comando STOP
//   else if (command === 'stop') {
//     try {
//       if (!connected) { return message.reply("You have already disconnected") };

//       stopRadioStream();

//       message.reply('Radio off.');

//     } catch (error) {

//       console.error(error);
//       message.reply('Ocurrió un error al detener la transmisión de radio.');

//     }
//   }
// });

client.on(Events.InteractionCreate, async interaction => {

	// const channelId = interaction.channelId;
	// if (channelId !== '1112547639397994560') return;

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {

		await command.execute(interaction, client, player, guild);
		// await interaction.channel.send('https://cdn.discordapp.com/attachments/1109263433871921203/1110488827367272499/DEATH_SHOT.png')

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

    playRadio();

    console.log('Reiniciando stream ausente');

  } catch (error) {
    console.log(error);
  }
});



async function playRadio() {

  try {

    connected = true;

    connection = joinVoiceChannel({
      channelId: '945430997875445794',
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    // Crear el recurso de audio con la URL de la radio
    const resource = createAudioResource(RadioStreamURL);

    // Reproducir el audio
    connection.subscribe(player);
    player.play(resource);

    // Evento para verificar si el reproductor ha terminado de reproducir el audio
    connection.on('error', (error) => {
      console.error('Error al reproducir el audio:', error);
    });

  } catch (error) {

    console.log(error);

  }
}

function stopRadioStream() {

  try {

    connected = false;

    connection = joinVoiceChannel({
      channelId: '945430997875445794',
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    console.log(connection);

    connection.destroy();
    // player.stop();
    console.log("Music stopped.");

  } catch (error) {

    console.error("Error stopping radio stream:", error);
    
  }
}

client.login(process.env.TOKEN_BOT);