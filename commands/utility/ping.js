const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong.'),

	async execute(interaction, client) {

        try{
            switch (interaction.locale){
                case 'en-US':
                    await interaction.reply(`My ping is **${client.ws.ping} ms** `);
                    break;
                case 'es-ES':
                    await interaction.reply(`Mi ping es de **${client.ws.ping} ms**`);
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