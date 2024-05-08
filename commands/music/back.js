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

		// Check if user is in the same voice channel
		if (
			interaction.guild.members.me.voice.channelId &&
			interaction.member.voice.channelId !==
				interaction.guild.members.me.voice.channelId
		) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('You are not in the same voice channel');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// check if player is playing and if has history
		if (!history) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}
		if (history.isEmpty()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('There is no previous track');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		await history.back();

		// Return embed
		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Track skipped');
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
