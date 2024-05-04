const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

		const ping = await interaction.editReply({
			embeds: [new EmbedBuilder().setColor(0x96ffff).setTitle('Pong?')],
		});

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL(),
			})
			.setTitle('Pong!')
			.setFooter({
				text: `Code with pain by @_juicerv3`,
				iconURL: interaction.client.user.avatarURL(),
			})
			.addFields(
				{
					name: 'Websocket:',
					value: `${interaction.client.ws.ping}ms`,
					inline: true,
				},
				{
					name: 'Bot latency:',
					value: `${
						ping.createdTimestamp - interaction.createdTimestamp
					}ms`,
					inline: true,
				}
			)
			.setTimestamp();

		if (queue)
			embed.addFields({
				name: 'Player queue ping',
				value: `${queue.ping}ms`,
				inline: true,
			});

		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
