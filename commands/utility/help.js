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
			.setFooter({
				text: `Code with pain by @_juicerv3`,
				iconURL: interaction.client.user.avatarURL(),
			})
			.addFields({
				name: 'Commands',
				value: `${interaction.client.ws.ping}ms`,
				inline: true,
			})
			.setTimestamp();
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 30000);
	},
};
