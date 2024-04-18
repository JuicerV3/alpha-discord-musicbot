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

		const mode = interaction.options.getString('mode');
		let modeName;

		if (!mode != null) {
			switch (mode) {
				case 'autoplay':
					queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
					modeName = 'Autoplay Next Track';
					break;
				case 'track':
					queue.setRepeatMode(QueueRepeatMode.TRACK);
					modeName = 'Repeat Current Track';
					break;
				case 'queue':
					queue.setRepeatMode(QueueRepeatMode.QUEUE);
					modeName = 'Repeat Queue';
					break;
				case 'off':
					queue.setRepeatMode(QueueRepeatMode.OFF);
					modeName = 'Repeat Off';
					break;
				default:
					queue.setRepeatMode(QueueRepeatMode.OFF);
					modeName = 'Repeat Off';
			}
		}

		const embed = new EmbedBuilder()
			.setTitle('Loop mode changed')
			.setDescription(`I have successfuly changed loop mode to ` + modeName + '.')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
