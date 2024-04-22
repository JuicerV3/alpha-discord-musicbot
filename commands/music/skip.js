const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the song'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
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
			.setTitle('Track skipped')
			.setDescription('I have successfuly skipped the track.')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};

const wait = (ms) => {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
};
