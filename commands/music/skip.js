const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the track'),
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

		const currentRepeatMode = queue.repeatMode;

		queue.setRepeatMode(QueueRepeatMode.OFF);
		queue.node.skip();
		await wait(500);
		switch (currentRepeatMode) {
			case 0:
				queue.setRepeatMode(QueueRepeatMode.OFF);
				break;
			case 1:
				queue.setRepeatMode(QueueRepeatMode.TRACK);
				break;
			case 2:
				queue.setRepeatMode(QueueRepeatMode.QUEUE);
				break;
			case 3:
				queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
				break;
			default:
				queue.setRepeatMode(QueueRepeatMode.OFF);
		}

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Track skipped');
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};

const wait = (ms) => {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
};
