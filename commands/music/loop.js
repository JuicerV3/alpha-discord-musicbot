const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Change loop mode')
		.addStringOption((option) =>
			option
				.setName('mode')
				.setDescription('set loop mode')
				.setRequired(true)
				.addChoices(
					{ name: 'Autoplay Next Track', value: 'autoplay' },
					{ name: 'Repeat Current Track', value: 'track' },
					{ name: 'Repeat Queue', value: 'queue' },
					{ name: 'Repeat Off', value: 'off' }
				)
		),
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
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const mode = interaction.options.getString('mode');

		let loopStatus;
		if (!mode != null) {
			switch (mode) {
				case 'autoplay':
					queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
					loopStatus = 'Autoplay Next Track';
					break;
				case 'track':
					queue.setRepeatMode(QueueRepeatMode.TRACK);
					loopStatus = 'Repeat Current Track';
					break;
				case 'queue':
					queue.setRepeatMode(QueueRepeatMode.QUEUE);
					loopStatus = 'Repeat Queue';
					break;
				case 'off':
					queue.setRepeatMode(QueueRepeatMode.OFF);
					loopStatus = 'Repeat Off';
					break;
				default:
					queue.setRepeatMode(QueueRepeatMode.OFF);
					loopStatus = 'Repeat Off';
			}
		}

		console.log(
			`\u001b[1;34m[Player]: Changed loop mode to ${loopStatus}\u001b[0m`
		);

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Loop mode changed')
			.setDescription(
				`I have successfuly changed loop mode to \`${loopStatus}\`.`
			)
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
