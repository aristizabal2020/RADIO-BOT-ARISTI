const { SlashCommandBuilder  } = require('discord.js');

//controllers
const { createGuild } = require("../../controllers/createGuild");

//model
const getGuildId = require("../../models/guilds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Sets the role that will have privileges to use the bot.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Set which role will be considered DJ!')
                .setRequired(true)
        ),

    async execute(interaction, client, player) {

        try {

            const role = await interaction.options.getRole('role');

            // await createGuild(interaction.guild);

            const guildUpdated = await getGuildId.findOneAndUpdate(
                { guildId: interaction.guildId },
                {
                    roleAdminId: role.id
                });


            switch (interaction.locale) {
                case 'en-US':

                    await interaction.reply(`Role selected: ${role}`);

                    break;
                case 'es-ES':

                    await interaction.reply(`Rol seleccionado: ${role}`);

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