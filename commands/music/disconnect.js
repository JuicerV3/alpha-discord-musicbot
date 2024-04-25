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

		if (!queue) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		queue.delete();

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Disconnected')
			.setDescription('Disconnected from the voice channel')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
