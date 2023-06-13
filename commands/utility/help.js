const { SlashCommandBuilder } = require('discord.js');
const { helpMsg } = require('../../controllers/embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows 426 FM Radio help menu.'),

	async execute(interaction, client) {

        try {

            await interaction.reply({ embeds: [helpMsg(interaction, client)]});            
           
        }
        catch (err) {
            console.log(err);
            interaction.reply("Not now, sorry :).");
        }
        
	},
};