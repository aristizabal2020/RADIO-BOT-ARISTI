const { SlashCommandBuilder  } = require('discord.js');

//controlers
const { createVoiceConnection } = require('../../controllers/createVoiceConnection');

//model
const getGuildId = require("../../models/guilds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show-role')
        .setDescription('Shows the role you have configured as bot administrator.'),

    async execute(interaction, client, player) {

        try {

            const role = await interaction.options.getRole('role');

            const getGuild = await getGuildId.findOne({ guildId: interaction.guildId });

            if(!getGuild.roleAdminId){

                return interaction.reply(`Please set a role first!`);

            }
            const roleId = interaction.guild.roles.cache.get(getGuild.roleAdminId).id;
              
            switch (interaction.locale) {
                case 'en-US':

                    await interaction.reply(`Current role: <@&${roleId}>`);

                    break;
                case 'es-ES':

                    await interaction.reply(`Rol actual: <@&${roleId}>`);

                    break;
                case 'pt-BR':

                    await interaction.reply(`Papel seleccionado ${role}`);

                    break;
                default:

                    await interaction.reply(`Role selected: ${role}`);

                    break;
            }
        }
        catch (err) {
            console.log(err);
            interaction.reply("Not now, sorry :).");
        }

    },
};