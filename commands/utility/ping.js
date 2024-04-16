const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	async execute(interaction) {
		await interaction.reply(
			`Pong! Websocket: ${interaction.client.ws.ping}ms`
		);
	},
};
