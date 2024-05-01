const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the player'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		queue.setRepeatMode(QueueRepeatMode.OFF);
		queue.node.stop();

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Player stopped');
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
