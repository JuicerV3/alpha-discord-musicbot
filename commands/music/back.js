const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useHistory } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('back')
		.setDescription('Back to the previous track'),
	async execute(interaction) {
		await interaction.deferReply();
		const history = useHistory(interaction.guildId);

		// check if player is playing and if has history
		if (!history) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}
		if (history.isEmpty()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('There is no previous track')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		await history.back();

		// Return embed
		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Track skipped')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
