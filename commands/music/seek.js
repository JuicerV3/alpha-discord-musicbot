const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const ms = require('ms');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Seek the current track')
		.addStringOption((option) =>
			option
				.setName('time')
				.setDescription('Format DD:HH:MM:SS (Ex. 42:30, 1:12, 24)')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);
		const time = interaction.options.getString('time');

		let milliseconds;
		if (time.split(':').length === 2) {
			/* For MM:SS */
			milliseconds =
				Number(time.split(':')[0]) * 60000 +
				Number(time.split(':')[1]) * 1000;
		} else if (time.split(':').length === 3) {
			/* For HH:MM:SS */
			milliseconds =
				Number(time.split(':')[0]) * 3600000 +
				Number(time.split(':')[1]) * 60000 +
				Number(time.split(':')[2]) * 1000;
		} else if (time.split(':').length === 4) {
			/* For DD:HH:MM:SS */
			milliseconds =
				Number(time.split(':')[0]) * 86400000 +
				Number(time.split(':')[1]) * 3600000 +
				Number(time.split(':')[2]) * 60000 +
				Number(time.split(':')[3]) * 1000;
		} else if (time >= 0 && time <= 60) {
			milliseconds = Number(time) * 1000;
		} else {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Incorrect format')
				.setDescription('Format DD:HH:MM:SS (Ex. 42:30, 1:12, 24)');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		try {
			queue.node.seek(milliseconds);

			const embed = new EmbedBuilder()
				.setColor(0x96ffff)
				.setTitle(`Seeked to \`${time}\``);
			if (time >= 0 && time <= 60)
				embed.setTitle(`Seeked to \`${time}s\``);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 15000);
		} catch (e) {
			console.error(e);

			const embed = new EmbedBuilder()
				.setColor(0xf54242)
				.setTitle('Something went wrong')
				.setDescription(
					`Something went wrong while trying to seek to \`${time}\``
				);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}
	},
};
