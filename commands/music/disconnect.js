const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect bot from voice channel'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

		// check if player is playing
		if (!queue) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		queue.delete();

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Disconnected from the voice channel');
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
