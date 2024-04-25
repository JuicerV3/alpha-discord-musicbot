const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	async execute(interaction) {
		const msg = await interaction.reply(
			`Pong! Websocket: ${interaction.client.ws.ping}ms`
		);
		return setTimeout(() => msg.delete(), 15000);
	},
};
