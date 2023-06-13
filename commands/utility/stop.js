const { SlashCommandBuilder  } = require('discord.js');

//controlers
const { createVoiceConnection } = require('../../controllers/createVoiceConnection');

//model
const getGuildId = require("../../models/guilds");

//config
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the radio.'),

    async execute(interaction, client, player) {

        try {

            const Guild = await getGuildId.findOne({ guildId: interaction.guildId});

            // console.log(Guild.guildId);

            if (Guild.guildId == interaction.guildId){

                const connection = createVoiceConnection(Guild.channelId, interaction.guild);
    
                connection.destroy();            
            }


            switch (interaction.locale) {
                case 'en-US':

                    await interaction.reply(`Radio Off`);

                    break;
                case 'es-ES':

                    await interaction.reply(`Radio apagada`);
                    break;
                case 'pt-BR':

                    await interaction.reply(`rádio desligado`);
                    break;
                default:

                    await interaction.reply(`Radio Off`,);
                    break;
            }
        }
        catch (err) {
            console.log(err);
            interaction.reply("Not now, sorry :).");
        }

    },
};