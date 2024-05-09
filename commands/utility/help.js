const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('list avaliable commands'),
	async execute(interaction) {
		await interaction.deferReply();
		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL(),
			})
			.setTitle('List of commands')
			.addFields({
				name: 'Music commands',
				value: `\`/play\` Play a song\n\`/pause\` Pause current song\n\`/resume\` Resume current song\n\`/back\` Back to previous song\n\`/skip\` Skip to next song\n\`/seek\` Seek current song\n\`/loop\` Set player loop mode\n\`/nowplaying\` Show nowplaying song\n\`/queue list\` list current queue\n\`/queue jump\` jump to song on the queue\n\`/queue remove\` Remove song from the queue\n\`/queue clear\` Clear all song from the queue\n\`/radio\` Play DASHRADIO Stream\n\`/stop\` Stop the player\n\`/disconnect\` Disconnect bot from the voice channel`,
				inline: true,
			})
			.setFooter({
				text: `Code with pain by @_juicerv3`,
				iconURL: interaction.client.user.avatarURL(),
			})
			.setTimestamp();
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 30000);
	},
};
