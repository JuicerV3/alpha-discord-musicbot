const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Change player loop mode')
		.addStringOption((option) =>
			option
				.setName('mode')
				.setDescription('select loop mode')
				.setRequired(true)
				.addChoices(
					{ name: 'Autoplay Next Track', value: 'autoplay' },
					{ name: 'Current Track', value: 'track' },
					{ name: 'Queue', value: 'queue' },
					{ name: 'Off', value: 'off' }
				)
		),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

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

		// Check if player is playing
		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// convert useroption to string and command
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
					loopStatus = 'Current Track';
					break;
				case 'queue':
					queue.setRepeatMode(QueueRepeatMode.QUEUE);
					loopStatus = 'Queue';
					break;
				case 'off':
					queue.setRepeatMode(QueueRepeatMode.OFF);
					loopStatus = 'Off';
					break;
				default:
					queue.setRepeatMode(QueueRepeatMode.OFF);
					loopStatus = 'Off';
			}
		}

		console.log(
			`\u001b[1;34m[Player]: Changed loop mode to ${loopStatus}\u001b[0m`
		);

		// Return embed
		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle(`Changed loop mode to \`${loopStatus}\``);
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
