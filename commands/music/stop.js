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

		if (!queue.isPlaying()) {
			const embed = new EmbedBuilder()
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		queue.setRepeatMode(QueueRepeatMode.OFF);
		queue.node.stop();

		const embed = new EmbedBuilder()
			.setTitle('Player stopped')
			.setDescription('I have successfuly stop the player.')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
