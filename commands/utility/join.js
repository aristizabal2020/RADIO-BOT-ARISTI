const { SlashCommandBuilder } = require('discord.js');
require("dotenv").config();
const { createAudioResource,
    createAudioPlayer,
    joinVoiceChannel,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    entersState,
    VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join a channel!'),
    
    playRadio: (interaction, client, player, guild) => {

        try {
        
            let connection = joinVoiceChannel({
              channelId: '945430997875445794',
              guildId: guild.id,
              adapterCreator: guild.voiceAdapterCreator,
            });
        
            // Crear el recurso de audio con la URL de la radio
            const resource = createAudioResource(process.env.RADIO_STREAM);
        
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
    },

	async execute(interaction, client, player, guild) {

        try{
            switch (interaction.locale){
                case 'en-US':

                    this.playRadio(interaction, client, player, guild);

                    await interaction.reply(`Radio On `);

                    break;
                case 'es-ES':
                    this.playRadio(interaction, client, player, guild);

                    await interaction.reply(`Radio Encendida `);
                    break;
                case 'pt-BR':
                    await interaction.reply(`Meu ping é de **${client.ws.ping} ms**`);
                    break;
                default:
                    await interaction.reply(`My ping is **${client.ws.ping} ms**`,);
                    break;
            }
        }
        catch (err){
            console.log(err);
            interaction.reply("Now not, sorry :).");
        }
        
	},
};