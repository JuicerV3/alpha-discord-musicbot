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

		if (!history) {
			const embed = new EmbedBuilder()
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		if (history.isEmpty()) {
			const embed = new EmbedBuilder()
				.setTitle('No previous track')
				.setDescription('There is no previous track to go back to')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		await history.back();

		const embed = new EmbedBuilder()
			.setTitle('Track skipped')
			.setDescription('I have successfuly skipped the track.')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
