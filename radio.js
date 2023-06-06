// const Discord = require("discord.js");
const {Client, GatewayIntentBits} = require("discord.js");
const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
require("dotenv").config();
const { Prefix, RadioStreamURL } = require('./config.json');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

//   const connection = new StreamConnection();

//     const player = new Player(client, {
//         leaveOnEmpty: false, // This options are optional.
//     });


// client.player = player;

client.on('ready', () => {
    
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(Prefix) || message.author.bot) return;
    
    const args = message.content.slice(Prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();    
    
    if (command === 'join') {
        if (!message.member.voice.channel) {
            return message.reply('Debes unirte a un canal de voz primero.');
        }
    
    // Unirse al canal de voz
    const channel = message.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    // Crear el reproductor de audio
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    // Crear el recurso de audio con la URL de la radio
    const resource = createAudioResource(RadioStreamURL);

    // Reproducir el audio
    player.play(resource);
    connection.subscribe(player);

    // Evento para verificar si el reproductor ha terminado de reproducir el audio
    connection.on('error', (error) => {
        console.error('Error al reproducir el audio:', error);
      });

  } else if (command === 'stop') {
    try {
      await guildQueue.stop();
      await guildQueue.leave();
      message.channel.send('La transmisión de radio ha sido detenida.');
    } catch (error) {
      console.error(error);
      message.channel.send('Ocurrió un error al detener la transmisión de radio.');
    }
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
    if (oldState.member.user.bot || newState.member.user.bot) return;
  
    if (!oldState.channelId && newState.channelId ) {
      console.log("entra")
    } 
    
  });

client.login(process.env.TOKEN_BOT);


