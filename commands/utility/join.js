const { SlashCommandBuilder, ChannelType  } = require('discord.js');
const { createAudioResource } = require('@discordjs/voice');
const { createVoiceConnection } = require('../../controllers/createVoiceConnection');

//controllers
const { createGuild } = require("../../controllers/createGuild");

//model
const updateGuild = require("../../models/guilds");

//config
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Sets channel and plays.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('🔊 The channel to join')
                .addChannelTypes(ChannelType.GuildVoice)
        ),

    playRadio: async (guild, player) => {

        try {
            const Guild = await updateGuild.findOne({ guildId: guild.id });
            const channel = Guild.channelId;

            const connection = createVoiceConnection(channel, guild);

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

    async execute(interaction, client, player) {

        try {

            const channelName = await interaction.options.getChannel('channel');

            if(!channelName){
                return interaction.reply(`Please select a voice channel first!`);
            }

            const guildUpdated = await updateGuild.findOneAndUpdate(
                { guildId: interaction.guildId },
                {
                    channelId: channelName.id
                });

                //todo: borrar
                // console.log("Actualizado el canal: ", guildUpdated.channelId)

                this.playRadio(interaction.guild, player);
            switch (interaction.locale) {
                case 'en-US':


                    await interaction.reply(`Radio On ${channelName}`);

                    break;
                case 'es-ES':

                    await interaction.reply(`Radio encendida en: ${channelName}`);

                    break;
                case 'pt-BR':

                    await interaction.reply(`Rádio ligado em: ${channelName}`);

                    break;
                default:
                    await interaction.reply(`Radio On ${channelName}`);
                    break;
            }
        }
        catch (err) {
            console.log(err);
            interaction.reply("Not now, sorry :).");
        }

    },
};